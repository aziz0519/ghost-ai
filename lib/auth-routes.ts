const publicRoutePrefixes = ["/sign-in", "/sign-up"];

export function isPublicRoute(pathname: string) {
  if (pathname === "/") {
    return true;
  }

  return publicRoutePrefixes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function getSignInUrl(pathname = "/") {
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in";

  if (!pathname || pathname === "/") {
    return signInUrl;
  }

  return `${signInUrl}?redirect_url=${encodeURIComponent(pathname)}`;
}

export function getSignUpUrl(pathname = "/") {
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up";

  if (!pathname || pathname === "/") {
    return signUpUrl;
  }

  return `${signUpUrl}?redirect_url=${encodeURIComponent(pathname)}`;
}
