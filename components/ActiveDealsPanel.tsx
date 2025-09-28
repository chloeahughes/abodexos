"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/format";
import { Mail } from "lucide-react";

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

export default function ActiveDealsPanel() {
  const [gmail, setGmail] = useState<GmailSummary>({
    connected: false,
    lastUpdated: null,
    emails: [],
  });

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

  // Example fake deals; replace with real data
  const deals = [
    { id: "1", name: "Downtown Office Complex" },
    { id: "2", name: "Lakeside Apartments" },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Active Deals</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Connect Accounts
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Connect Accounts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <div className="mb-2 font-medium">Gmail</div>
                {gmail.connected ? (
                  <>
                    <div className="mb-2 text-sm text-green-700">
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
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">Not connected.</div>
                )}
              </div>

              <div className="text-xs text-gray-500">
                Tip: Use the Connect Accounts tab to link Gmail and Excel.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {deals.map((d) => (
            <Link
              key={d.id}
              href={`/deals/${d.id}`}
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
            >
              <span className="font-medium">{d.name}</span>
              <span className="text-xs text-muted-foreground">Up to date</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
