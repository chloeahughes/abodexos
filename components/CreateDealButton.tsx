"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import KeywordsInput from './KeywordsInput';
import { Plus, Loader2 } from 'lucide-react';

type CreateDealRequest = {
  keywords: string[];
  dealName?: string;
};

type CreateDealResponse = {
  dealId: string;
  matchedCount: number;
};

export default function CreateDealButton() {
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [dealName, setDealName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'searching' | 'extracting' | 'creating'>('idle');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (keywords.length === 0) {
      alert('Please add at least one keyword');
      return;
    }

    setIsLoading(true);
    setStatus('searching');

    try {
      const request: CreateDealRequest = {
        keywords,
        dealName: dealName.trim() || undefined,
      };

      setStatus('extracting');
      
      const response = await fetch('/api/deals/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create deal');
      }

      setStatus('creating');
      
      const result: CreateDealResponse = await response.json();
      
      // Close modal and navigate to the new deal
      setOpen(false);
      setKeywords([]);
      setDealName('');
      setStatus('idle');
      
      // Show success message
      alert(`Deal created from ${result.matchedCount} emails.`);
      
      // Navigate to the new deal
      router.push(`/deals/${result.dealId}`);
      
    } catch (error) {
      console.error('Error creating deal:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create deal'}`);
    } finally {
      setIsLoading(false);
      setStatus('idle');
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'searching':
        return 'Searching Gmail for matching emails...';
      case 'extracting':
        return 'Extracting deal information...';
      case 'creating':
        return 'Creating your deal...';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
          <p className="text-sm text-gray-600">Add your new property here.</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-sm text-gray-700 mb-4">
              Add relevant keywords to allow Gmail to auto-arrange files and key project details 
              associated with this deal to your auto-filled deals
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="dealName" className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Name (optional)
                </label>
                <input
                  type="text"
                  id="dealName"
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  placeholder="e.g., Downtown Office Complex"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
              
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <KeywordsInput
                  value={keywords}
                  onChange={setKeywords}
                  placeholder="e.g., downtown office, 123 main street, property investment"
                />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              {getStatusText()}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || keywords.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Automate Deal'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
