// Providers placed at the root layout so TanStack Query works app-wide.
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { CookieConsent } from "@/components/cookie-consent";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        {children}
        <CookieConsent />
      </QueryClientProvider>
    </SessionProvider>
  );
}
