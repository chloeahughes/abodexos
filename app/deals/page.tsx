import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { hasGmailConnection } from "@/lib/gmailConnection";
import { SyncGmailButton } from "@/components/SyncGmailButton";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/deals");
  }

  // Check Gmail connection server-side
  const connected = await hasGmailConnection(user.id);

  // Fetch recent emails
  const { data: emails } = await supabase
    .from("emails")
    .select("id_uuid, gmail_id, subject, from_name, from_email, date_received, is_unread, snippet")
    .eq("user_id", user.id)
    .order("date_received", { ascending: false })
    .limit(10);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Deals Dashboard</h1>
        <SyncGmailButton connected={connected} />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Emails</h2>
        {!emails?.length ? (
          <p className="text-gray-500">No emails found. Connect Gmail to start syncing.</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Showing {emails.length} most recent emails
            </p>
            <ul className="divide-y">
              {emails.map((email) => (
                <li key={email.id_uuid} className="py-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {email.subject || "(no subject)"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        From: {email.from_name ? `${email.from_name} <${email.from_email}>` : email.from_email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(email.date_received).toLocaleString()}
                      </div>
                      {email.snippet && (
                        <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {email.snippet}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {email.is_unread && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
