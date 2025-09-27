"use client";
import { useState, useTransition } from "react";
export function GmailConnectorTile({ connected }: { connected: boolean }) {
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();
  const connect = () => { window.location.href = "/api/email/google/init"; };
  const syncNow = () => {
    setMsg("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/email/gmail/sync", { method: "POST" });
        const isJSON = res.headers.get("content-type")?.includes("application/json");
        const data: any = isJSON ? await res.json() : {};
        if (!res.ok) throw new Error(data?.error || `${res.status} ${res.statusText}`);
        setMsg(`Synced ${data.fetched ?? 0} emails.`);
      } catch (e: any) {
        setMsg(`Sync error: ${e.message}`);
      }
    });
  };
  return (
    <div className="rounded-2xl border p-5 flex items-start justify-between">
      <div><h3 className="text-lg font-semibold">Gmail</h3><p className="text-sm text-gray-500">Auto-ingest deal emails.</p></div>
      {!connected ? (
        <button onClick={connect} className="rounded-lg bg-black px-4 py-2 text-white">Connect Gmail</button>
      ) : (
        <button onClick={syncNow} disabled={pending} className="rounded-lg border px-4 py-2">{pending ? "Syncing…" : "Sync now"}</button>
      )}
      {msg && <p className="text-sm mt-2">{msg}</p>}
    </div>
  );
}