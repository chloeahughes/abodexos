import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
export const dynamic = "force-dynamic";
export default async function WhoAmI() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
  return <pre className="p-4 text-sm">{JSON.stringify({ user, error }, null, 2)}</pre>;
}