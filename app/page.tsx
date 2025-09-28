import ActiveDealsPanel from "@/components/ActiveDealsPanel";
import ConnectAccountsPanel from "@/components/ConnectAccountsPanel";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 p-6 md:grid-cols-2">
      <ActiveDealsPanel />
      <ConnectAccountsPanel />
    </div>
  );
}