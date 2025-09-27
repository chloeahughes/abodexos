"use client";
import { useState, useTransition } from "react";
export function GmailControls({ connected }: { connected: boolean }) {
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();
  const syncNow = () => {
    setMsg("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/email/gmail/sync", { method: "POST" });
        const isJSON = res.headers.get("content-type")?.includes("application/json");
        const data: any = isJSON ? await res.json() : {};
        if (!res.ok) throw new Error(data?.error || `${res.status} ${res.statusText}`);
        setMsg(`Synced ${data.fetched ?? 0} emails.`);
      } catch (e: any) { setMsg(`Sync error: ${e.message}`); }
    });
  };
  if (!connected) {
    return <a className="rounded-lg bg-black px-4 py-2 text-white" href="/api/email/google/init">Connect Gmail</a>;
  }
  return (
    <div className="flex items-center gap-3">
      <button onClick={syncNow} disabled={pending} className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60">
        {pending ? "Syncing…" : "Sync now"}
      </button>
      {msg && <span className="text-sm text-gray-500">{msg}</span>}
    </div>
  );
}
