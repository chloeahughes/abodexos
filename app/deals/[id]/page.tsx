"use client";
import { useState } from "react";
import { getDealById, getActivitiesForDeal, getRelativeTime } from "@/lib/data.mock";
import { Deal } from "@/lib/types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStageColor = (stage: Deal["stage"]) => {
  switch (stage) {
    case "Sourcing": return "bg-blue-100 text-blue-800";
    case "Due Diligence": return "bg-yellow-100 text-yellow-800";
    case "Negotiating": return "bg-orange-100 text-orange-800";
    case "Closed": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const StakeholderChips = ({ stakeholders }: { stakeholders: string[] }) => (
  <div className="flex gap-1">
    {stakeholders.map((initials, index) => (
      <span
        key={index}
        className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-700 bg-gray-200 rounded-full"
      >
        {initials}
      </span>
    ))}
  </div>
);

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview");
  const deal = getDealById(params.id);
  const activities = getActivitiesForDeal(params.id);

  if (!deal) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deal Not Found</h1>
          <p className="text-gray-600">The deal you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "documents", label: "Documents" },
    { id: "messages", label: "Messages" },
    { id: "details", label: "Deal Details" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
            <p className="text-gray-600 mt-1">{deal.address}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStageColor(deal.stage)}`}>
            {deal.stage}
          </span>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Total Budget</div>
            <div className="text-xl font-semibold text-gray-900">{formatCurrency(deal.totalBudget)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Spent</div>
            <div className="text-xl font-semibold text-gray-900">{formatCurrency(deal.spent)}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Days Active</div>
            <div className="text-xl font-semibold text-gray-900">{deal.daysActive}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Team</div>
            <div className="mt-1">
              <StakeholderChips stakeholders={deal.stakeholders} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Deal Overview Table */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">Commercial Office</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asking Price</span>
                    <span className="font-medium">{formatCurrency(deal.totalBudget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Price</span>
                    <span className="font-medium">{formatCurrency(deal.totalBudget * 0.95)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per sqft</span>
                    <span className="font-medium">${deal.kpis.pricePerSqft}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Members</span>
                    <StakeholderChips stakeholders={deal.stakeholders} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days in Progress</span>
                    <span className="font-medium">{deal.daysActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Feet</span>
                    <span className="font-medium">25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brokerage</span>
                    <span className="font-medium">Abodex Realty</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-gray-900">{activity.text}</div>
                      <div className="text-sm text-gray-500">
                        {getRelativeTime(activity.timestamp)}
                        {activity.source && ` • ${activity.source}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600">📄</span>
                  </div>
                  <div>
                    <div className="font-medium">Financial Model.xlsx</div>
                    <div className="text-sm text-gray-500">Uploaded 2 days ago</div>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  See Key Info
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">📊</span>
                  </div>
                  <div>
                    <div className="font-medium">Property Inspection Report.pdf</div>
                    <div className="text-sm text-gray-500">Uploaded 1 week ago</div>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  See Key Info
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
            <div className="space-y-3">
              {activities.filter(a => a.type === "email").map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">✉️</span>
                  <div className="flex-1">
                    <div className="text-gray-900">{activity.text}</div>
                    <div className="text-sm text-gray-500">{getRelativeTime(activity.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">Commercial Office</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address</span>
                    <span className="font-medium">{deal.address}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Feet</span>
                    <span className="font-medium">25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium">2018</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Price</span>
                    <span className="font-medium">{formatCurrency(deal.totalBudget * 0.95)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per sqft</span>
                    <span className="font-medium">${deal.kpis.pricePerSqft}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual NOI</span>
                    <span className="font-medium">{formatCurrency(deal.kpis.annualNOI)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occupancy Rate</span>
                    <span className="font-medium">{deal.kpis.occupancyPct}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Broker</span>
                  <span className="font-medium">John Smith - Abodex Realty</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Manager</span>
                  <span className="font-medium">Sarah Johnson - Property Co.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}