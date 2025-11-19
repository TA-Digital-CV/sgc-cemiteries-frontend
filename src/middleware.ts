import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * middleware
 * Purpose: Configurable auth bypass for non-production environments.
 * Security: Disabled in production; logs usages for audit; only applies to protected paths.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname || "/";

  const NODE_ENV = process.env.NODE_ENV || "development";
  const BYPASS_AUTH =
    String(process.env.BYPASS_AUTH || "false").toLowerCase() === "true";
  const BYPASS_ROLES = String(process.env.BYPASS_AUTH_ROLES || "");

  const isProduction = NODE_ENV === "production";
  const protectedPaths = [
    "/cemeteries",
    "/blocks",
    "/sections",
    "/plots",
    "/analytics",
    "/maps",
  ];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  // Allow public/auth routes
  const isPublic =
    path.startsWith("/login") ||
    path.startsWith("/logout") ||
    path.startsWith("/api/auth");
  if (isPublic) {
    if (!isProduction && BYPASS_AUTH) {
      const roles = BYPASS_ROLES.length > 0 ? BYPASS_ROLES : "READONLY";
      const redirectTo = new URL("/cemeteries", req.url);
      const res = NextResponse.redirect(redirectTo);
      res.cookies.set("bypass_auth", "1", { path: "/", httpOnly: false });
      res.cookies.set("bypass_roles", roles, { path: "/", httpOnly: false });
      console.log(
        JSON.stringify({
          type: "BYPASS_AUTH_USED",
          path,
          roles,
          at: new Date().toISOString(),
        }),
      );
      return res;
    }
    return NextResponse.next();
  }
  if (!isProtected) return NextResponse.next();

  // Check NextAuth session cookies
  const hasSession = Boolean(
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
      req.cookies.get("next-auth.session-token")?.value,
  );
  if (hasSession) return NextResponse.next();

  // Enforce production safety: never bypass in production
  if (isProduction) {
    // No session and production → redirect to login
    console.log(
      JSON.stringify({
        type: "AUTH_REDIRECT",
        reason: "production_no_session",
        path,
        at: new Date().toISOString(),
      }),
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Bypass enabled in non-production
  if (BYPASS_AUTH) {
    const res = NextResponse.next();
    // Attach bypass cookies for downstream guards
    const roles = BYPASS_ROLES.length > 0 ? BYPASS_ROLES : "READONLY";
    res.cookies.set("bypass_auth", "1", { path: "/", httpOnly: false });
    res.cookies.set("bypass_roles", roles, {
      path: "/",
      httpOnly: false,
    });
    // Audit log
    console.log(
      JSON.stringify({
        type: "BYPASS_AUTH_USED",
        path,
        roles,
        at: new Date().toISOString(),
      }),
    );
    return res;
  }

  // Default: redirect to login when no session and bypass disabled
  console.log(
    JSON.stringify({
      type: "AUTH_REDIRECT",
      reason: "no_session_bypass_disabled",
      path,
      at: new Date().toISOString(),
    }),
  );
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: [
    "/cemeteries/:path*",
    "/blocks/:path*",
    "/sections/:path*",
    "/plots/:path*",
    "/analytics/:path*",
    "/maps/:path*",
  ],
};
