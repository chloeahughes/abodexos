import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supaSSR = createServerComponentClient({ cookies });
  const { data: { user } } = await supaSSR.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status:401 });

  const { email_uuid } = await req.json();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await admin.from("emails").update({ deal_id: params.id }).eq("id_uuid", email_uuid).eq("user_id", user.id);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status:400 });
  return NextResponse.json({ ok:true });
}
