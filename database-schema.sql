-- Abodex Database Schema
-- Run this in your Supabase SQL editor

-- Enable RLS
ALTER TABLE IF EXISTS deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deal_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gmail_tokens ENABLE ROW LEVEL SECURITY;

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text NOT NULL,
  stage text DEFAULT 'Sourcing' CHECK (stage IN ('Sourcing', 'Due Diligence', 'Negotiating', 'Closed')),
  purchase_price numeric,
  asking_price numeric,
  price_per_sqft numeric,
  square_feet numeric,
  annual_noi numeric,
  stakeholders text[] DEFAULT '{}',
  last_update_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Deal emails table
CREATE TABLE IF NOT EXISTS deal_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gmail_msg_id text NOT NULL,
  gmail_thread_id text NOT NULL,
  subject text NOT NULL,
  sender text NOT NULL,
  snippet text,
  sent_at timestamptz NOT NULL,
  matched_keywords text[] DEFAULT '{}'
);

-- Gmail tokens table (if not already exists)
CREATE TABLE IF NOT EXISTS gmail_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token text NOT NULL,
  refresh_token text,
  expiry_date bigint,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS Policies for deals
CREATE POLICY "Users can view their own deals" ON deals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deals" ON deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals" ON deals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals" ON deals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for deal_emails
CREATE POLICY "Users can view their own deal emails" ON deal_emails
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deal emails" ON deal_emails
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deal emails" ON deal_emails
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deal emails" ON deal_emails
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for gmail_tokens
CREATE POLICY "Users can view their own gmail tokens" ON gmail_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gmail tokens" ON gmail_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gmail tokens" ON gmail_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gmail tokens" ON gmail_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_emails_deal_id ON deal_emails(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_emails_user_id ON deal_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_emails_sent_at ON deal_emails(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_gmail_tokens_user_id ON gmail_tokens(user_id);