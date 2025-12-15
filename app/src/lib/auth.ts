import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import { sanityClient } from "./sanity";
import { userByEmailQuery } from "./queries";

type SanityUser = {
  _id: string;
  email: string;
  name?: string;
  passwordHash?: string;
  provider?: string;
  image?: string;
};

async function findUserByEmail(email: string): Promise<SanityUser | null> {
  try {
    return await sanityClient.fetch(userByEmailQuery, { email });
  } catch {
    return null;
  }
}

async function ensureOauthUser(profile: { email?: string | null; name?: string | null; picture?: string | null }, provider: string) {
  if (!profile.email) return null;
  const existing = await findUserByEmail(profile.email);
  if (existing?._id) return existing;
  try {
    const doc = await sanityClient.create({
      _type: "user",
      email: profile.email,
      name: profile.name || "",
      provider,
      image: profile.picture || undefined,
    });
    return doc as SanityUser;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email és jelszó",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Jelszó", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("Hibás email vagy jelszó");
        }
        const user = await findUserByEmail(email);
        if (!user?.passwordHash) {
          throw new Error("Hibás email vagy jelszó");
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          throw new Error("Hibás email vagy jelszó");
        }
        return { id: user._id, email: user.email, name: user.name || user.email, image: user.image };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET
      ? [
          AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") return true;
      if (account?.provider === "google" || account?.provider === "apple") {
        const profileEmail = typeof profile?.email === "string" ? profile.email : undefined;
        const profileName = typeof profile?.name === "string" ? profile.name : undefined;
        const profilePicture =
          profile && typeof (profile as { picture?: unknown }).picture === "string"
            ? (profile as { picture?: string }).picture
            : user.image;
        const created = await ensureOauthUser(
          { email: profileEmail, name: profileName || user.name, picture: profilePicture },
          account.provider,
        );
        if (created) {
          user.id = created._id;
          user.email = created.email;
          user.name = created.name || created.email;
          user.image = created.image;
          return true;
        }
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        const sessionUser = session.user as typeof session.user & { id?: string };
        sessionUser.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/bejelentkezes",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const authHandler = NextAuth(authOptions);
