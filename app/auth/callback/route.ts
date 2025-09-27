import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/settings/integrations";
  const supabase = createRouteHandlerClient({ cookies });
  if (code) { await supabase.auth.exchangeCodeForSession(code); }
  return NextResponse.redirect(new URL(next, url.origin));
}