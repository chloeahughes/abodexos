import ActiveDealsPanel from "@/components/ActiveDealsPanel";
import ConnectAccountsPanel from "@/components/ConnectAccountsPanel";

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your active deals and connected accounts</p>
      </div>

      {/* Desktop: Two-column layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        <ActiveDealsPanel />
        <ConnectAccountsPanel />
      </div>

      {/* Mobile: Stacked layout with Active Deals first */}
      <div className="lg:hidden space-y-6">
        <ActiveDealsPanel />
        <ConnectAccountsPanel />
      </div>
    </div>
  );
}