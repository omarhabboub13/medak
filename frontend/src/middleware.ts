import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("medak_token")?.value;

  const isAdminApp =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  // Only protect the CMS — never bounce /admin/login away because of a stale cookie
  if (isAdminApp && !token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/register") ||
    pathname === "/login"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
