// app/api/deals/[id]/link-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

type Context = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Context) {
  // Auth via cookies
  const supaSSR = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supaSSR.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
  }

  // Input
  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const email_uuid = typeof body?.email_uuid === "string" ? body.email_uuid : "";
  if (!email_uuid) {
    return NextResponse.json({ ok: false, error: "invalid_email_uuid" }, { status: 400 });
  }

  // Admin client to bypass RLS for update
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await admin
    .from("emails")
    .update({ deal_id: params.id })
    .eq("id_uuid", email_uuid)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}