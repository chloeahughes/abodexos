import ActiveDealsPanel from "@/components/ActiveDealsPanel";

export default function DealsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Deals</h1>
        <p className="text-gray-600 mt-1">View and manage all your deals</p>
      </div>

      <ActiveDealsPanel />
    </div>
  );
}
