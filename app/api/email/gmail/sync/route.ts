import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { google } from "googleapis";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const key = Buffer.from(process.env.ENCRYPTION_KEY || "", "base64");
function safeDecrypt(b64?: string | null) {
  if (!b64) return undefined;
  const buf = Buffer.from(b64, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const d = crypto.createDecipheriv("aes-256-gcm", key);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(data), d.final()]).toString("utf8");
}

export async function POST(req: NextRequest) {
  try {
    // 1) Who is the user?
    const supaSSR = createServerComponentClient({ cookies });
    const { data: { user } } = await supaSSR.auth.getUser();
    if (!user) return NextResponse.json({ ok:false, where:"auth", error:"not_authenticated" }, { status:401 });

    // 2) Admin client (service role)
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3) Load tokens
    const { data: tok, error: tokErr } = await admin
      .from("oauth_google_tokens")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (tokErr) throw new Error(`db_tokens: ${tokErr.message}`);
    if (!tok)  return NextResponse.json({ ok:false, where:"tokens", error:"no_tokens" }, { status:400 });

    // 4) Google client
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
    const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URI!;
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      throw new Error("missing_google_envs");
    }

    const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const accessToken = tok.access_token || undefined;
    let refreshToken;
    try {
      refreshToken = safeDecrypt(tok.refresh_token);
    } catch (e:any) {
      console.error("DECRYPT ERROR:", e?.message);
      // continue with access token only
    }
    oauth2.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2 });

    // 5) Fetch + upsert
    const profile = await gmail.users.getProfile({ userId: "me" });
    const connectionEmail = profile.data.emailAddress || "gmail";

    const list = await gmail.users.messages.list({
      userId: "me",
      q: "newer_than:30d",
      maxResults: 25,
    });

    let count = 0;
    for (const m of list.data.messages || []) {
      const full = await gmail.users.messages.get({ userId: "me", id: m.id!, format: "full" });

      const headers = Object.fromEntries((full.data.payload?.headers ?? []).map(h => [h.name!, h.value || ""]));
      const subject = headers["Subject"] || "";
      const dateHdr = headers["Date"] || "";
      const date_received = dateHdr ? new Date(dateHdr) : new Date();

      const parseOne = (s?: string) => {
        if (!s) return { name:"", email:"" };
        const mm = s.match(/^(.*)<([^>]+)>$/);
        return mm ? { name:mm[1].trim().replace(/(^"|"$)/g,""), email:mm[2].trim() } : { name:"", email:s.trim() };
      };
      const splitMany = (s?: string) => (s ? s.split(",").map(v => v.trim()).filter(Boolean) : []);

      const from = parseOne(headers["From"]);
      const to = splitMany(headers["To"]);
      const cc = splitMany(headers["Cc"]);
      const bcc = splitMany(headers["Bcc"]);

      const labels = full.data.labelIds || [];
      const is_unread = labels.includes("UNREAD");

      const { error: upErr } = await admin.from("emails").upsert({
        user_id: user.id,
        connection_email: connectionEmail,
        gmail_id: full.data.id!,
        thread_id: full.data.threadId!,
        subject,
        snippet: full.data.snippet || "",
        from_name: from.name,
        from_email: from.email,
        to_emails: to,
        cc_emails: cc,
        bcc_emails: bcc,
        date_received,
        is_unread,
        labels,
        raw_size_bytes: Number(full.data.sizeEstimate || 0),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,gmail_id" });
      if (upErr) throw new Error(`db_upsert: ${upErr.message}`);
      count++;
    }

    return NextResponse.json({ ok:true, fetched: count });
  } catch (err:any) {
    console.error("SYNC ERROR:", err?.message, err);
    return NextResponse.json(
      { ok:false, where:"sync", error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
