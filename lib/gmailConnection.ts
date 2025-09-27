import { createClient } from "@supabase/supabase-js";
export async function hasGmailConnection(userId: string) {
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data } = await admin.from("oauth_google_tokens").select("user_id").eq("user_id", userId).limit(1);
  return !!data?.length;
}
