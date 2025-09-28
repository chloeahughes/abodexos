export type Deal = {
  id: string;
  name: string;
  address: string;
  stage: "Sourcing" | "Due Diligence" | "Negotiating" | "Closed";
  totalBudget: number;
  spent: number;
  lastUpdateText: string;
  lastUpdateAt: string; // ISO
  daysActive: number;
  kpis: { 
    pricePerSqft: number; 
    occupancyPct: number; 
    annualNOI: number 
  };
  stakeholders: string[]; // initials
};

export type IntegrationState = {
  gmail: { 
    connected: boolean; 
    lastUpdated?: string; 
    bullets?: string[]; 
    connectHref?: string 
  };
  excel: { 
    connected: boolean; 
    lastUpdated?: string; 
    bullets?: string[]; 
    onConnectStub?: boolean 
  };
};

export type Activity = {
  id: string;
  dealId: string;
  type: "email" | "document" | "task" | "update";
  text: string;
  timestamp: string;
  source?: string;
};
