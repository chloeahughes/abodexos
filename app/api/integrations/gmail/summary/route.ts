import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  // Identify user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ connected: false, lastUpdated: null, emails: [] }, { status: 200 });
  }

  // Connected state + lastUpdated: 
  // Prefer reading from a 'gmail_connections' or 'provider_connections' table if you have one.
  // Fallback: infer lastUpdated from latest received email.
  let lastUpdated: string | null = null;
  let connected = false;

  // Try to read 3 most recent emails for this user
  const { data: emails, error: emailsErr } = await supabase
    .from("emails")
    .select("id, subject, from_name, from_email, received_at, snippet")
    .eq("user_id", user.id)
    .order("received_at", { ascending: false })
    .limit(3);

  if (!emailsErr && emails && emails.length > 0) {
    connected = true;
    lastUpdated = emails[0].received_at;
  }

  // If you track explicit connections, uncomment and adapt:
  // const { data: conn, error: connErr } = await supabase
  //   .from("provider_connections")
  //   .select("provider, last_synced_at")
  //   .eq("user_id", user.id)
  //   .eq("provider", "gmail")
  //   .maybeSingle();
  // if (!connErr && conn) {
  //   connected = true;
  //   lastUpdated = conn.last_synced_at || lastUpdated;
  // }

  return NextResponse.json({
    connected,
    lastUpdated,
    emails: emails || [],
  });
}
