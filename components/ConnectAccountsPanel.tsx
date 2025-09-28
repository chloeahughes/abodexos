"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileSpreadsheet } from "lucide-react";
import { formatDateTime } from "@/lib/format";

type EmailRow = {
  id: string;
  subject: string | null;
  from_name: string | null;
  from_email: string | null;
  received_at: string | null;
  snippet?: string | null;
};

type GmailSummary = {
  connected: boolean;
  lastUpdated: string | null;
  emails: EmailRow[];
};

export default function ConnectAccountsPanel() {
  const [gmail, setGmail] = useState<GmailSummary>({
    connected: false,
    lastUpdated: null,
    emails: [],
  });

  // TODO: Replace with your real start route
  const gmailConnectHref =
    process.env.NEXT_PUBLIC_GMAIL_CONNECT_HREF || "/api/auth/google/start";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/integrations/gmail/summary", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load gmail summary");
        const data = (await res.json()) as GmailSummary;
        if (mounted) setGmail(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card id="connect" className="h-full">
      <CardHeader>
        <CardTitle>Connect Accounts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gmail */}
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <div className="font-medium">Email (Gmail)</div>
          </div>

          {gmail.connected ? (
            <div className="text-sm">
              <div className="mb-2 text-green-700">
                Connected — Last updated {formatDateTime(gmail.lastUpdated)}
              </div>
              <ul className="space-y-2">
                {gmail.emails.map((m) => (
                  <li key={m.id} className="rounded bg-red-50 p-2">
                    <div className="font-medium">{m.subject || "(no subject)"}</div>
                    <div className="text-xs text-gray-600">
                      From: {m.from_name || m.from_email || "Unknown"} • {formatDateTime(m.received_at)}
                    </div>
                  </li>
                ))}
                {gmail.emails.length === 0 && (
                  <li className="rounded bg-red-50 p-2 text-xs text-gray-600">No recent emails</li>
                )}
              </ul>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-muted-foreground">
                Sync your Gmail to keep deals current. Just 2 clicks.
              </p>
              <Button asChild>
                <Link href={gmailConnectHref}>Connect Gmail ✉️</Link>
              </Button>
            </>
          )}
        </div>

        {/* Excel */}
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <div className="font-medium">Excel</div>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Connect Excel to auto-fill Deal Details. Just 2 clicks.
          </p>
          <Button onClick={() => alert("TODO: Wire Excel connection")}>Connect Excel 📊</Button>
        </div>
      </CardContent>
    </Card>
  );
}