"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/bejelentkezes" })}
      className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary/60"
    >
      Kijelentkezés
    </button>
  );
}
