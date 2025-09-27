"use client";
import { useState } from "react";

interface SyncGmailButtonProps {
  connected: boolean;
}

export function SyncGmailButton({ connected }: SyncGmailButtonProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("/api/email/gmail/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Synced ${data.fetched || 0} emails`);
      } else {
        setMessage(`Sync error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setMessage(`Sync error: ${error instanceof Error ? error.message : "Network error"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <a 
        href="/api/email/google/init"
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Connect Gmail
      </a>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleSync}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Syncing..." : "Sync Gmail"}
      </button>
      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
}
