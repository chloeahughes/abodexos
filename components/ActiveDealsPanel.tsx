import Link from "next/link";
import { Deal } from "@/lib/types";
import { mockDeals, getRelativeTime } from "@/lib/data.mock";

const getStageColor = (stage: Deal["stage"]) => {
  switch (stage) {
    case "Sourcing": return "bg-blue-100 text-blue-800";
    case "Due Diligence": return "bg-yellow-100 text-yellow-800";
    case "Negotiating": return "bg-orange-100 text-orange-800";
    case "Closed": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const StakeholderChips = ({ stakeholders }: { stakeholders: string[] }) => (
  <div className="flex gap-1">
    {stakeholders.map((initials, index) => (
      <span
        key={index}
        className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-700 bg-gray-200 rounded-full"
      >
        {initials}
      </span>
    ))}
  </div>
);

export default function ActiveDealsPanel() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Active Deals</h2>
        <button className="hidden lg:block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          + Create New Deal
        </button>
      </div>

      {/* Mobile Create Button */}
      <button className="lg:hidden w-full mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        + Create New Deal
      </button>

      <div className="space-y-4">
        {mockDeals.map((deal) => (
          <Link
            key={deal.id}
            href={`/deals/${deal.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{deal.name}</h3>
                <p className="text-sm text-gray-600">{deal.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
                  {deal.stage}
                </span>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(deal.totalBudget)}
                  </div>
                  <div className="text-xs text-gray-500">Total Budget</div>
                </div>
              </div>
            </div>

            {/* Budget Progress */}
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Budget Progress</span>
                <span>{Math.round((deal.spent / deal.totalBudget) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(deal.spent / deal.totalBudget) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Last Update */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-sm text-gray-700">{deal.lastUpdateText}</div>
              <div className="text-xs text-gray-500 mt-1">
                {getRelativeTime(deal.lastUpdateAt)}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-sm text-gray-500">Price per sqft</div>
                <div className="text-base font-medium text-gray-900">
                  ${deal.kpis.pricePerSqft}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Current occupancy</div>
                <div className="text-base font-medium text-gray-900">
                  {deal.kpis.occupancyPct}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Annual NOI</div>
                <div className="text-base font-medium text-gray-900">
                  {formatCurrency(deal.kpis.annualNOI)}
                </div>
              </div>
            </div>

            {/* Stakeholders */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Team:</span>
                <StakeholderChips stakeholders={deal.stakeholders} />
              </div>
              <div className="text-sm text-gray-500">
                {deal.daysActive} days active
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
