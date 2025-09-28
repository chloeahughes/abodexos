import { Deal, IntegrationState, Activity } from "./types";

export const mockDeals: Deal[] = [
  {
    id: "deal-1",
    name: "Harbor Plaza",
    address: "123 Harbor Drive, Seattle, WA 98101",
    stage: "Due Diligence",
    totalBudget: 2500000,
    spent: 750000,
    lastUpdateText: "Updated financial model with new cap rate assumptions",
    lastUpdateAt: "2024-01-15T10:30:00Z",
    daysActive: 45,
    kpis: {
      pricePerSqft: 425,
      occupancyPct: 87,
      annualNOI: 340000
    },
    stakeholders: ["CH", "JS", "MK"]
  },
  {
    id: "deal-2", 
    name: "Riverside Office Complex",
    address: "456 Riverside Blvd, Portland, OR 97201",
    stage: "Sourcing",
    totalBudget: 1800000,
    spent: 320000,
    lastUpdateText: "Received preliminary inspection report",
    lastUpdateAt: "2024-01-14T15:45:00Z",
    daysActive: 23,
    kpis: {
      pricePerSqft: 380,
      occupancyPct: 92,
      annualNOI: 285000
    },
    stakeholders: ["CH", "AB"]
  },
  {
    id: "deal-3",
    name: "Downtown Retail Center",
    address: "789 Main Street, Vancouver, BC V6B 1A1",
    stage: "Negotiating", 
    totalBudget: 3200000,
    spent: 2100000,
    lastUpdateText: "Counter-offer submitted to seller",
    lastUpdateAt: "2024-01-13T09:15:00Z",
    daysActive: 67,
    kpis: {
      pricePerSqft: 485,
      occupancyPct: 94,
      annualNOI: 420000
    },
    stakeholders: ["CH", "JS", "MK", "AB"]
  }
];

export const mockIntegrationState: IntegrationState = {
  gmail: {
    connected: true,
    lastUpdated: "2024-01-15T08:00:00Z",
    bullets: [
      "✉️ Pulled: Lease thread → Harbor Plaza",
      "✉️ Pulled: Investor update → Riverside Office Complex",
      "✉️ Pulled: Due diligence checklist → Downtown Retail Center"
    ],
    connectHref: "/api/email/google/init" // Existing Gmail OAuth route
  },
  excel: {
    connected: false,
    lastUpdated: undefined,
    bullets: [],
    onConnectStub: true // TODO: Wire Microsoft/Drive/Upload integration
  }
};

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    dealId: "deal-1",
    type: "email",
    text: "Received lease renewal terms from tenant",
    timestamp: "2024-01-15T14:30:00Z",
    source: "Gmail"
  },
  {
    id: "act-2", 
    dealId: "deal-1",
    type: "document",
    text: "Updated financial model with new cap rate assumptions",
    timestamp: "2024-01-15T10:30:00Z",
    source: "Files"
  },
  {
    id: "act-3",
    dealId: "deal-2", 
    type: "task",
    text: "Scheduled property inspection for next week",
    timestamp: "2024-01-14T16:20:00Z",
    source: "Tasks"
  },
  {
    id: "act-4",
    dealId: "deal-3",
    type: "update", 
    text: "Counter-offer submitted to seller",
    timestamp: "2024-01-13T09:15:00Z",
    source: "Deal Details"
  }
];

export function getDealById(id: string): Deal | undefined {
  return mockDeals.find(deal => deal.id === id);
}

export function getActivitiesForDeal(dealId: string): Activity[] {
  return mockActivities.filter(activity => activity.dealId === dealId);
}

export function getRelativeTime(isoString: string): string {
  const now = new Date();
  const past = new Date(isoString);
  const diffMs = now.getTime() - past.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return past.toLocaleDateString();
}
