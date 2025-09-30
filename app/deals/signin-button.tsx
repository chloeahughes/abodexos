"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignInButton({ next = "/deals" }: { next?: string }) {
  const handleClick = async () => {
    const origin = window.location.origin; // http://localhost:3000 in dev
    await createClientComponentClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
    >
      Connect to Google
    </button>
  );
}