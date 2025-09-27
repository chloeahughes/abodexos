import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { GmailConnectorTile } from "@/components/GmailConnectorTile";

export default async function IntegrationsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div className="p-6">
        Please sign in. <a className="underline" href="/login">Go to login</a>
      </div>
    );
  }

  const { data: tokens } = await supabase
    .from("oauth_google_tokens")
    .select("user_id")
    .eq("user_id", user.id)
    .limit(1);
  const connected = !!tokens?.length;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Integrations</h1>
      <GmailConnectorTile connected={connected} />
    </div>
  );
}
