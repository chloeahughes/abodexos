"use client";

import { useEffect, useState } from 'react';
import CreateDealButton from '@/components/CreateDealButton';
import DealCard from '@/components/DealCard';
import { Deal } from '@/lib/types';

export default function ActiveDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setDeals(data.deals || []);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Active Deals</h1>
        <CreateDealButton />
      </div>

      {/* Deals Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading deals...</div>
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <h3 className="text-lg font-medium mb-2">No deals yet</h3>
            <p className="text-sm">Create your first deal to get started with automated deal management.</p>
          </div>
          <CreateDealButton />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}