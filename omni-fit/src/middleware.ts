import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log("🛡️ Middleware: Protection route:", req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        if (pathname === "/" || pathname === "/api/auth" || pathname.startsWith("/api/auth/")) {
          return true;
        }

        // Protect dashboard and other private routes
        if (pathname.startsWith("/dashboard")) {
          console.log("🔐 Accès dashboard - Token présent:", !!token);
          return !!token;
        }

        // Default: allow access
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
