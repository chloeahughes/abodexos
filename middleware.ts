// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { user } } = await supabase.auth.getUser();

  const url = new URL(req.url);
  const needsAuth = url.pathname.startsWith("/settings");

  if (needsAuth && !user) {
    url.pathname = "/login";
   // preserve target so we can return after login
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = { 
  matcher: ["/settings/:path*", "/deals/:path*"] 
};