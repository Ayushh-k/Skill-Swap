import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;
    const isAdmin = token?.role === "admin";

    // 1. Skip checks for essential/system paths
    if (
      pathname.startsWith("/api") || 
      pathname.startsWith("/_next") || 
      pathname.startsWith("/maintenance") ||
      pathname.includes(".") // static files like favicon.ico, images, etc.
    ) {
      return NextResponse.next();
    }

    // 2. Admin Protection (Redirects to login if not admin)
    if (pathname.startsWith("/admin")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // 3. Maintenance Mode Check (Global)
    // We fetch the status from our internal API which checks the DB
    try {
      const maintenanceRes = await fetch(`${req.nextUrl.origin}/api/admin/maintenance`, {
        next: { revalidate: 30 } // Cache for 30 seconds
      });
      const { maintenanceMode } = await maintenanceRes.json();

      if (maintenanceMode && !isAdmin) {
        // Redirect non-admins to maintenance page
        // We ensure we don't redirect if already on login (optional, but good for UX)
        if (pathname !== "/login") {
           return NextResponse.redirect(new URL("/maintenance", req.url));
        }
      }
    } catch (e) {
      console.error("Maintenance check failed:", e);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
