import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SignInButton from "./signin-button";
import CreateDealButton from "@/components/CreateDealButton";
import DealCard from "@/components/DealCard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Active Deals</h1>
        </div>
        <div className="mx-auto mt-16 max-w-lg rounded-lg border p-6 text-center">
          <p className="mb-4 text-sm text-gray-600">
            Connect your Google account to continue.
          </p>
          <SignInButton next="/deals" />
        </div>
      </div>
    );
  }

  // fetch deals for this user
  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Active Deals</h1>
        <CreateDealButton />
      </div>

      {(!deals || deals.length === 0) ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">
          No deals yet. Click "Create New Deal" to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {deals.map((d) => (
            <DealCard key={d.id} deal={d} />
          ))}
        </div>
      )}
    </div>
  );
}
