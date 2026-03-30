import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-in-prod";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  
  const protectedPaths = ["/dashboard", "/explore", "/swap"];
  
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect users who are logged in away from auth pages
  if (token && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup"))) {
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (e) {
      // invalid token, just let them see the login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/explore/:path*", "/swap/:path*", "/login", "/signup"],
};
