"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSignInUrl, isPublicRoute } from "@/lib/auth-routes";

export function ClerkAuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const isPublicPath = isPublicRoute(pathname);

    if (!isSignedIn && !isPublicPath) {
      router.replace(getSignInUrl(pathname));
      return;
    }

    if (isSignedIn && (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/")) {
      router.replace("/editor");
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  if (!isLoaded) {
    return null;
  }

  return <>{children}</>;
}
