"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function SignInForm() {
  const supabase = createClientComponentClient();
  const params = useSearchParams();
  const next = params.get("next") || "/deals";

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <button
        className="rounded-md bg-black px-4 py-2 text-white"
        onClick={async () => {
          const origin = window.location.origin;
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` }
          });
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center p-6">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
