-- Add deal_id column to emails table
alter table public.emails add column if not exists deal_id uuid;

-- Create index for better performance
create index if not exists emails_deal_id_idx on public.emails(deal_id);
