import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SignInButton from "./signin-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // Unauthenticated state
  if (!session) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Active Deals</h1>
        </div>
        <div className="mx-auto mt-16 max-w-lg rounded-lg border p-6 text-center">
          <p className="mb-4 text-sm text-gray-600">Connect your Google account to continue.</p>
          <SignInButton next="/deals" />
        </div>
      </div>
    );
  }

  // Authenticated state (replace with your full dashboard)
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Active Deals</h1>
        <a className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700" href="#">
          + Create New Deal
        </a>
      </div>
      <div className="rounded-lg border p-6 text-sm text-gray-600">
        Your deals appear here.
      </div>
    </div>
  );
}