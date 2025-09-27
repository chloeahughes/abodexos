"use client";
import { useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
export default function LoginForm({ nextPath }: { nextPath: string }) {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState(""); const [msg, setMsg] = useState("");
  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("Sending link…");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setMsg(error ? `Error: ${error.message}` : "Check your email for the sign-in link.");
  }, [email, nextPath, supabase]);
  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <input className="border px-3 py-2 w-80" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
      <button className="px-4 py-2 bg-black text-white rounded">Send magic link</button>
      <p className="text-sm text-gray-500">{msg}</p>
    </form>
  );
}