import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/supabase/supabaseAdmin";
import crypto from "crypto";

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "base64");
function encrypt(plain: string) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  const tag = c.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export async function GET(req: NextRequest) {
  try {
    const supa = createServerComponentClient({ cookies });
    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.redirect("/settings/integrations?gmail=auth_required");

    const code = new URL(req.url).searchParams.get("code");
    if (!code) return NextResponse.redirect("/settings/integrations?gmail=error");

    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_OAUTH_REDIRECT_URI!
    );
    const { tokens } = await oauth2.getToken(code);

    await supabaseAdmin.from("oauth_google_tokens").upsert({
      user_id: user.id,
      access_token: tokens.access_token || null,
      refresh_token: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
      expiry_ts: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      scope: tokens.scope || null,
      updated_at: new Date().toISOString(),
    });
    return NextResponse.redirect("/settings/integrations?gmail=connected");
  } catch (err: any) {
    console.error("CALLBACK ERROR:", err?.message, err);
    return NextResponse.json({ ok: false, where: "callback", error: String(err?.message || err) }, { status: 500 });
  }
}