export type Deal = {
  id: string;
  user_id: string;
  name: string;
  location: string;
  stage: "Sourcing" | "Due Diligence" | "Negotiating" | "Closed";
  purchase_price?: number;
  asking_price?: number;
  price_per_sqft?: number;
  square_feet?: number;
  annual_noi?: number;
  stakeholders: string[];
  last_update_at: string; // ISO
  created_at: string; // ISO
};

export type DealEmail = {
  id: string;
  deal_id: string;
  user_id: string;
  gmail_msg_id: string;
  gmail_thread_id: string;
  subject: string;
  sender: string;
  snippet: string;
  sent_at: string; // ISO
  matched_keywords: string[];
};

export type IntegrationState = {
  gmail: {
    connected: boolean;
    lastUpdated?: string;
    recentEmails?: {
      id: string;
      subject: string;
      from: string;
      date: string;
    }[];
    connectHref?: string;
  };
  excel: {
    connected: boolean;
    lastUpdated?: string;
  };
};

export type ExtractedFields = {
  property_value?: number;
  location?: string;
  square_feet?: number;
  price_per_sqft?: number;
  property_type?: string;
  asking_price?: number;
  purchase_price?: number;
};

export type Activity = {
  id: string;
  dealId: string;
  type: "email" | "document" | "task" | "update";
  text: string;
  timestamp: string;
  source?: string;
};
