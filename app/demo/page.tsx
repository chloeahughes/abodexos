// app/demo/page.tsx
export const dynamic = "force-dynamic";

import DealsDemo from "@/components/DealsDemo";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Abodex — Demo Deals Dashboard</h1>
          <a
            href="/login?next=/deals"
            className="text-sm underline text-gray-700"
            title="Sign in to access the real dashboard"
          >
            Sign in to save
          </a>
        </header>

        <div className="rounded-2xl border p-5 mb-6">
          <h2 className="text-lg font-semibold mb-1">Gmail</h2>
          <p className="text-sm text-gray-500">
            This is a demo. Gmail isn't connected here. The "Sync" button below is simulated.
          </p>
        </div>

        <DealsDemo />
      </div>
    </main>
  );
}
