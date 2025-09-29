import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, FileText } from 'lucide-react';
import { Deal, DealEmail } from '@/lib/types';
import { formatDateTime } from '@/lib/format';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper to format currency
const formatCurrency = (value?: number) => {
  if (!value) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Helper to get stage badge color
const getStageColor = (stage: Deal['stage']) => {
  switch (stage) {
    case 'Sourcing':
      return 'bg-blue-100 text-blue-800';
    case 'Due Diligence':
      return 'bg-yellow-100 text-yellow-800';
    case 'Negotiating':
      return 'bg-orange-100 text-orange-800';
    case 'Closed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getDaysActive = (createdAt: string) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default async function DealDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    notFound();
  }

  const { data: deal, error: dealError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (dealError || !deal) {
    console.error("Error fetching deal:", dealError);
    notFound();
  }

  const { data: dealEmails, error: emailsError } = await supabase
    .from("deal_emails")
    .select("*")
    .eq("deal_id", params.id)
    .eq("user_id", user.id)
    .order("sent_at", { ascending: false });

  if (emailsError) {
    console.error("Error fetching deal emails:", emailsError);
    // Continue without emails if there's an error
  }

  const daysActive = getDaysActive(deal.created_at);

  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{deal.name}</h1>
          <Badge className={`px-3 py-1 text-sm ${getStageColor(deal.stage)}`}>
            {deal.stage}
          </Badge>
        </div>
        <p className="text-lg text-gray-600 mb-4">{deal.location}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-xs text-gray-500">Asking Price</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(deal.asking_price)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-xs text-gray-500">Purchase Price</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(deal.purchase_price)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-xs text-gray-500">Days Active</p>
            <p className="text-lg font-semibold text-gray-900">{daysActive}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <p className="text-xs text-gray-500">Annual NOI</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(deal.annual_noi)}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Deal Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Property Type:</span>
                <span className="font-medium text-gray-900">Commercial</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Asking Price:</span>
                <span className="font-medium text-gray-900">{formatCurrency(deal.asking_price)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Purchase Price:</span>
                <span className="font-medium text-gray-900">{formatCurrency(deal.purchase_price)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Price per Sqft:</span>
                <span className="font-medium text-gray-900">
                  {deal.price_per_sqft ? `$${deal.price_per_sqft}` : '—'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Team Members:</span>
                <span className="font-medium text-gray-900 flex space-x-1">
                  {deal.stakeholders.map((initials) => (
                    <span
                      key={initials}
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-xs font-medium text-gray-700"
                    >
                      {initials}
                    </span>
                  ))}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Days in Progress:</span>
                <span className="font-medium text-gray-900">{daysActive}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Square Feet:</span>
                <span className="font-medium text-gray-900">
                  {deal.square_feet ? `${deal.square_feet.toLocaleString()} sqft` : '—'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Brokerage:</span>
                <span className="font-medium text-gray-900">CRE Solutions</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Files</h2>
            <ul className="space-y-4">
              {dealEmails && dealEmails.length > 0 ? (
                dealEmails.map((email) => (
                  <li key={email.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <span className="text-base font-medium text-gray-900">{email.subject}</span>
                        <p className="text-sm text-gray-500">From: {email.sender}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      See Key Info
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-center py-8 text-gray-500">
                  No files found. Connect Gmail to see documents from your emails.
                </li>
              )}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Activity</h2>
            <div className="relative pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {dealEmails && dealEmails.length > 0 ? (
                dealEmails.map((email, index) => (
                  <div key={email.id} className="relative mb-6">
                    <div className="absolute -left-2.5 top-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-white"></div>
                    <p className="text-base text-gray-800 mb-1">
                      Email received: {email.subject}
                    </p>
                    <p className="text-sm text-gray-500">
                      From: {email.sender} • {formatDateTime(email.sent_at)}
                    </p>
                    {email.snippet && (
                      <p className="text-sm text-gray-600 mt-1 italic">
                        "{email.snippet.substring(0, 100)}..."
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No activity yet. Connect Gmail to see email activity.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Communication</h2>
            <ul className="space-y-3">
              {dealEmails && dealEmails.length > 0 ? (
                dealEmails.map((email) => (
                  <li key={email.id} className="flex items-center p-3 border rounded-lg bg-red-50 text-red-800">
                    <Mail className="w-5 h-5 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">{email.subject}</div>
                      <div className="text-sm">
                        From: {email.sender} • {formatDateTime(email.sent_at)}
                      </div>
                    </div>
                    <a
                      href={`https://mail.google.com/mail/u/0/#inbox/${email.gmail_thread_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline hover:no-underline"
                    >
                      View in Gmail
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-center py-8 text-gray-500">
                  No emails found. Connect Gmail to see communication history.
                </li>
              )}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}