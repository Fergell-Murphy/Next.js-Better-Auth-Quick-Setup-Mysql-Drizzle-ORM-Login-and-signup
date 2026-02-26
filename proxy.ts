import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard"];
const authPaths = ["/login", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected && !isAuthPage) {
    return NextResponse.next();
  }

  const response = await fetch(
    new URL("/api/auth/get-session", request.nextUrl.origin),
    {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    },
  );

  const body = (await response.json()) as {
    data?: { user: { name: string }; session: unknown } | null;
  } | null;
  const session = body?.data ?? null;

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackURL", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sign-up"],
};
