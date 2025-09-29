"use client";

import Link from 'next/link';
import { Deal } from '@/lib/types';
import { formatDateTime } from '@/lib/format';

interface DealCardProps {
  deal: Deal;
}

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

const formatCurrency = (amount?: number) => {
  if (!amount) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return formatDateTime(dateString);
};

const getDaysActive = (createdAt: string) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function DealCard({ deal }: DealCardProps) {
  const daysActive = getDaysActive(deal.created_at);
  
  return (
    <Link
      href={`/deals/${deal.id}`}
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:ring-2 hover:ring-purple-300 hover:bg-purple-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      <div className="relative">
        {/* See Deal button - top left */}
        <div className="absolute -top-2 -left-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/deals/${deal.id}`;
            }}
            className="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            See Deal
          </button>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{deal.name}</h3>
            <p className="text-sm text-gray-600">{deal.location}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(deal.stage)}`}>
            {deal.stage}
          </span>
        </div>

        {/* Budget Progress */}
        {deal.asking_price && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Asking Price</span>
              <span>{formatCurrency(deal.asking_price)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: '30%' }} // Mock progress - could be based on actual spent vs budget
              ></div>
            </div>
          </div>
        )}

        {/* Last Update */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="text-sm text-gray-700">Last updated</div>
          <div className="text-xs text-gray-500">
            {formatDate(deal.last_update_at)}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Price per sqft</div>
            <div className="text-base font-medium text-gray-900">
              {deal.price_per_sqft ? `$${deal.price_per_sqft}` : '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Annual NOI</div>
            <div className="text-base font-medium text-gray-900">
              {formatCurrency(deal.annual_noi)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Days Active</div>
            <div className="text-base font-medium text-gray-900">
              {daysActive}
            </div>
          </div>
        </div>

        {/* Stakeholders */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Team:</span>
            <div className="flex gap-1">
              {deal.stakeholders.map((initials, index) => (
                <span
                  key={index}
                  className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-700 bg-gray-200 rounded-full"
                >
                  {initials}
                </span>
              ))}
            </div>
          </div>
          {deal.square_feet && (
            <div className="text-sm text-gray-500">
              {deal.square_feet.toLocaleString()} sqft
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
