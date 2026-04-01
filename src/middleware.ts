import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const url = req.nextUrl.clone();
    const { pathname } = url;

    // 1. Skip checks for essential paths
    if (
      pathname.startsWith("/api") || 
      pathname.startsWith("/_next") || 
      pathname.startsWith("/maintenance") ||
      pathname.includes(".") // static files
    ) {
      return NextResponse.next();
    }

    // 2. Admin Protection
    if (pathname.startsWith("/admin")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // 3. Maintenance Mode Check (Global)
    try {
      const maintenanceRes = await fetch(`${req.nextUrl.origin}/api/admin/maintenance`, {
        next: { revalidate: 60 } // Cache for 60 seconds
      });
      const { maintenanceMode } = await maintenanceRes.json();

      if (maintenanceMode && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/maintenance", req.url));
      }
    } catch (e) {
      console.error("Maintenance check failed:", e);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        // This is a dummy return to allow the middleware function above to run
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*", "/swap/:path*"],
};
