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

    // 2. Auth Protection (Redirects to login if not authenticated)
    const isProtectedRoute = pathname.startsWith("/dashboard") || 
                           pathname.startsWith("/explore") || 
                           pathname.startsWith("/profile") || 
                           pathname.startsWith("/swap") ||
                           pathname.startsWith("/admin");

    if (isProtectedRoute && !isAuth) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }

    // 3. Admin Protection (Redirects to home if not admin)
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 4. Maintenance Mode Check (Global)
    try {
      const maintenanceRes = await fetch(`${req.nextUrl.origin}/api/admin/maintenance`, {
        next: { revalidate: 30 }
      });
      const { maintenanceMode } = await maintenanceRes.json();

      if (maintenanceMode && !isAdmin) {
        if (pathname !== "/login" && pathname !== "/maintenance") {
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
      authorized: ({ token, req }) => {
        // Return true to handle our own logic in the middleware function above
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
