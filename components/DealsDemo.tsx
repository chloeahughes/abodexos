"use client";
import { useEffect, useMemo, useState } from "react";

type Deal = {
  id: string;
  title: string;
  stage: "New" | "Qualifying" | "Negotiating" | "Closed Won";
  owner: string;
  value: number;
  lastEmail?: string;
};

const DEMO_KEY = "abodex-demo-deals-v1";

const seed: Deal[] = [
  { id: "d1", title: "1240 Elm St", stage: "New", owner: "Chloe", value: 950000, lastEmail: "Intro email from buyer's agent" },
  { id: "d2", title: "55 Pine Ave", stage: "Qualifying", owner: "Jae", value: 1225000, lastEmail: "Buyer requested comps" },
  { id: "d3", title: "19 Irving St", stage: "Negotiating", owner: "Chloe", value: 875000, lastEmail: "Offer counter @ 870k" },
  { id: "d4", title: "77 Cedar Ct", stage: "Closed Won", owner: "Team", value: 1630000, lastEmail: "Congrats email sent" },
];

function useDemoDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(DEMO_KEY) : null;
    setDeals(raw ? JSON.parse(raw) : seed);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DEMO_KEY, JSON.stringify(deals));
    }
  }, [deals]);
  return { deals, setDeals };
}

export default function DealsDemo() {
  const { deals, setDeals } = useDemoDeals();
  const [msg, setMsg] = useState<string>("");

  const totals = useMemo(() => {
    const total = deals.reduce((s, d) => s + d.value, 0);
    const pipeline = deals
      .filter((d) => d.stage !== "Closed Won")
      .reduce((s, d) => s + d.value, 0);
    return { total, pipeline };
  }, [deals]);

  const fakeSync = async () => {
    setMsg("Syncing…");
    await new Promise((r) => setTimeout(r, 800));
    // "sync" by bumping the lastEmail on one item
    setDeals((prev) =>
      prev.map((d, i) => (i === 0 ? { ...d, lastEmail: "Demo: new email about disclosures" } : d))
    );
    setMsg("Demo sync complete.");
    setTimeout(() => setMsg(""), 2000);
  };

  const advanceStage = (id: string) => {
    const order: Deal["stage"][] = ["New", "Qualifying", "Negotiating", "Closed Won"];
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const idx = order.indexOf(d.stage);
        return { ...d, stage: order[Math.min(idx + 1, order.length - 1)] };
      })
    );
  };

  const addDeal = () => {
    const n = (Math.random() * 900000 + 300000) | 0;
    const id = Math.random().toString(36).slice(2, 8);
    setDeals((prev) => [
      {
        id,
        title: `${id.toUpperCase()} Maple Dr`,
        stage: "New",
        owner: "You",
        value: n,
        lastEmail: "Demo: lead came in via web form",
      },
      ...prev,
    ]);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">Pipeline</div>
          <div className="text-2xl font-semibold">${(totals.pipeline / 1000).toFixed(1)}k</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-semibold">${(totals.total / 1000).toFixed(1)}k</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addDeal} className="rounded-lg border px-4 py-2">Add demo deal</button>
          <button onClick={fakeSync} className="rounded-lg bg-black px-4 py-2 text-white">
            Sync (demo)
          </button>
          {msg && <span className="text-sm text-gray-600">{msg}</span>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {deals.map((d) => (
          <div key={d.id} className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{d.title}</div>
              <div className="text-sm text-gray-500">{d.owner}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm">
                <span className="inline-block rounded-full border px-2 py-0.5 mr-2 text-xs">{d.stage}</span>
                <span className="text-gray-500">${(d.value / 1000).toFixed(1)}k</span>
              </div>
              <button
                onClick={() => advanceStage(d.id)}
                className="text-sm underline"
                title="Advance stage (demo)"
              >
                Advance stage
              </button>
            </div>
            {d.lastEmail && (
              <div className="mt-2 text-xs text-gray-500">Last email: {d.lastEmail}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
