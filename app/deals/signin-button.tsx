"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_ORIGIN ||
  (typeof window !== "undefined" ? window.location.origin : "");

export default function SignInButton({ next = "/deals" }: { next?: string }) {
  const handleClick = async () => {
    const supabase = createClientComponentClient();
    const redirectTo = `${APP_ORIGIN}/auth/callback?next=${encodeURIComponent(next)}`;

    // Ask Supabase for the OAuth URL but don't navigate yet
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true, // 👈 don't navigate; give us the URL
      },
    });

    if (error) {
      console.error("OAuth start failed:", error);
      alert(`OAuth start failed:\n${error.message}`);
      return;
    }

    // Show and log the URL so we can copy it
    console.log("OAuth URL:", data?.url);
    alert(`OAuth URL:\n${data?.url || "(no url returned)"}`);
    // When debugging is done, replace the alert with:
    // if (data?.url) window.location.href = data.url;
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