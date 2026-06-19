import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/analytics",
    "/dashboard/portfolio",
    "/dashboard/create-service",
    "/dashboard/nearby-service",
    "/dashboard/setting",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing auth routes with session, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};