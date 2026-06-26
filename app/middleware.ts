import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // All /dashboard/* routes require authentication
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Redirect old /login and /register routes to the new /Auth route
  if (pathname === "/login") {
    const redirectUrl = new URL("/Auth", req.url);
    if (req.nextUrl.search) {
      redirectUrl.search = req.nextUrl.search;
    }
    return NextResponse.redirect(redirectUrl);
  }
  if (pathname === "/register") {
    const redirectUrl = new URL("/Auth", req.url);
    redirectUrl.searchParams.set("mode", "register");
    return NextResponse.redirect(redirectUrl);
  }

  // Auth pages — redirect authenticated users away
  const isAuthRoute = pathname === "/Auth";

  if (isDashboardRoute && !session) {
    const redirectUrl = new URL("/Auth", req.url);
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/Auth"],
};
