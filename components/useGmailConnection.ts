"use client";
import { useState, useEffect } from "react";

interface GmailConnectionState {
  connected: boolean;
  loading: boolean;
  error?: string;
}

export function useGmailConnection(): GmailConnectionState {
  const [state, setState] = useState<GmailConnectionState>({
    connected: false,
    loading: true,
  });

  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await fetch("/api/email/connection-status");
        if (response.ok) {
          const data = await response.json();
          setState({
            connected: data.connected || false,
            loading: false,
          });
        } else {
          setState({
            connected: false,
            loading: false,
            error: "Failed to check connection status",
          });
        }
      } catch (error) {
        setState({
          connected: false,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    checkConnection();
  }, []);

  return state;
}
