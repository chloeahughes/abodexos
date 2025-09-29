"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileSpreadsheet } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { useIntegrations } from "@/lib/hooks/useIntegrations";

export default function ConnectAccountsPanel() {
  const integrations = useIntegrations();

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
            <div className="font-medium">Connect Gmail</div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Sync your Gmail with Abodex and automate your deals from mail — without doing any manual work
          </p>

          {integrations.gmail.connected ? (
            <div className="text-sm">
              <div className="mb-2 text-green-700">
                Connected — Last updated {formatDateTime(integrations.gmail.lastUpdated)}
              </div>
              <ul className="space-y-2">
                {integrations.gmail.recentEmails?.map((email) => (
                  <li key={email.id} className="rounded bg-red-50 p-2">
                    <div className="font-medium">{email.subject}</div>
                    <div className="text-xs text-gray-600">
                      From: {email.from} • {formatDateTime(email.date)}
                    </div>
                  </li>
                ))}
                {(!integrations.gmail.recentEmails || integrations.gmail.recentEmails.length === 0) && (
                  <li className="rounded bg-red-50 p-2 text-xs text-gray-600">No recent emails</li>
                )}
              </ul>
            </div>
          ) : (
            <Button asChild>
              <Link href={integrations.gmail.connectHref || "/api/auth/google/start"}>
                Connect Gmail ✉️
              </Link>
            </Button>
          )}
        </div>

        {/* Excel */}
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <div className="font-medium">Connect Excel</div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Sync your Excel with Abodex and automate your deals from sheets — saving hours of manual work
          </p>

          {integrations.excel.connected ? (
            <div className="text-sm">
              <div className="mb-2 text-green-700">
                Connected — Last updated {formatDateTime(integrations.excel.lastUpdated)}
              </div>
              <ul className="space-y-2">
                <li className="rounded bg-green-50 p-2 text-green-800">
                  📊 Pulled: Rent Roll.xlsx
                </li>
                <li className="rounded bg-green-50 p-2 text-green-800">
                  📊 Pulled: Deal Metrics.xlsx
                </li>
              </ul>
            </div>
          ) : (
            <Button onClick={() => alert("TODO: Wire Excel connection")}>
              Connect Excel 📊
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}