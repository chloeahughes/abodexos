import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    // Check for Gmail connection in oauth_google_tokens table
    const { data: tokens, error } = await supabase
      .from("oauth_google_tokens")
      .select("user_id")
      .eq("user_id", user.id)
      .limit(1);

    if (error) {
      console.error("Error checking Gmail connection:", error);
      return NextResponse.json({ connected: false }, { status: 500 });
    }

    return NextResponse.json({ connected: !!tokens?.length });
  } catch (error) {
    console.error("Connection status error:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}
