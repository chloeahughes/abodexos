import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  // Refresh session cookie if there is one
  await supabase.auth.getSession();

  const url = new URL(req.url);
  const isAuthCallback = url.pathname === "/auth/callback";
  const isStatic =
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.startsWith("/robots.txt") ||
    url.pathname.startsWith("/sitemap.xml");

  if (isAuthCallback || isStatic) return res;
  return res;
}

export const config = { matcher: ["/settings/:path*", "/deals/:path*"] };