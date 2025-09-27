import { NextResponse } from "next/server";
import { google } from "googleapis";

function need(name: string, v?: string) {
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function GET() {
  try {
    const CLIENT_ID  = need("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
    const CLIENT_SECRET = need("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET);
    const REDIRECT_URI  = need("GOOGLE_OAUTH_REDIRECT_URI", process.env.GOOGLE_OAUTH_REDIRECT_URI);
    const SCOPES = (process.env.GMAIL_SCOPES || "https://www.googleapis.com/auth/gmail.readonly").split(" ");

    const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const url = oauth2.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
    });
    return NextResponse.redirect(url);
  } catch (err: any) {
    console.error("INIT ERROR:", err?.message, err);
    return NextResponse.json({ ok: false, where: "init", error: String(err?.message || err) }, { status: 500 });
  }
}