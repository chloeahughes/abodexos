import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { hasGmailConnection } from "@/lib/gmailConnection";

export default async function DealPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-6">Please sign in. <a className="underline" href="/login">Go to login</a></div>;

  const connected = await hasGmailConnection(user.id);

  // fetch latest emails for this deal
  const { data: emails } = await supabase
    .from("emails")
    .select("id_uuid, gmail_id, subject, from_name, from_email, date_received, is_unread, snippet")
    .eq("user_id", user.id)
    .eq("deal_id", params.id)
    .order("date_received", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deal</h1>
        {!connected ? (
          <a href="/api/email/google/init" className="rounded-lg bg-black px-4 py-2 text-white">Connect Gmail</a>
        ) : (
          <form action="/api/email/gmail/sync" method="post">
            <button className="rounded-lg border px-4 py-2" formAction="/api/email/gmail/sync">Sync now</button>
          </form>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Emails</h2>
        {/* Quick link by UUID (for testing) */}
        <form className="flex gap-2 mb-4" action={`/api/deals/${params.id}/link-email`} method="post" onSubmit={(e)=>e.preventDefault()}>
          {/* swap to a real picker later */}
        </form>
        {!emails?.length ? (
          <p className="text-sm text-gray-500">No emails linked to this deal yet.</p>
        ) : (
          <ul className="divide-y">
            {emails!.map(e => (
              <li key={e.id_uuid} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{e.subject || "(no subject)"}</div>
                    <div className="text-sm text-gray-500">
                      From: {e.from_name ? `${e.from_name} <${e.from_email}>` : e.from_email} • {new Date(e.date_received).toLocaleString()}
                    </div>
                    {e.snippet && <div className="text-sm mt-1 line-clamp-2">{e.snippet}</div>}
                  </div>
                  <div className="text-xs">{e.is_unread ? "Unread" : ""}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <Link className="underline" href="/settings/integrations">Manage Gmail connection</Link>
      </div>
    </div>
  );
}
