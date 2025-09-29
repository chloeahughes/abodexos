"use client";

import { useState, useEffect } from 'react';
import { IntegrationState } from '../types';

export function useIntegrations(): IntegrationState {
  const [integrations, setIntegrations] = useState<IntegrationState>({
    gmail: {
      connected: false,
      lastUpdated: undefined,
      recentEmails: [],
      connectHref: process.env.NEXT_PUBLIC_GMAIL_CONNECT_HREF || '/api/auth/google/start',
    },
    excel: {
      connected: false,
      lastUpdated: undefined,
    },
  });

  useEffect(() => {
    let mounted = true;

    const fetchIntegrations = async () => {
      try {
        // Fetch Gmail integration status and recent emails
        const gmailResponse = await fetch('/api/integrations/gmail/summary', {
          cache: 'no-store',
        });

        if (gmailResponse.ok) {
          const gmailData = await gmailResponse.json();
          
          if (mounted) {
            setIntegrations(prev => ({
              ...prev,
              gmail: {
                ...prev.gmail,
                connected: gmailData.connected,
                lastUpdated: gmailData.lastUpdated,
                recentEmails: gmailData.emails?.map((email: any) => ({
                  id: email.id,
                  subject: email.subject || '(no subject)',
                  from: email.from_name || email.from_email || 'Unknown',
                  date: email.received_at,
                })) || [],
              },
            }));
          }
        }

        // TODO: Fetch Excel integration status when implemented
        // const excelResponse = await fetch('/api/integrations/excel/summary');
        // if (excelResponse.ok) {
        //   const excelData = await excelResponse.json();
        //   if (mounted) {
        //     setIntegrations(prev => ({
        //       ...prev,
        //       excel: {
        //         connected: excelData.connected,
        //         lastUpdated: excelData.lastUpdated,
        //       },
        //     }));
        //   }
        // }

      } catch (error) {
        console.error('Error fetching integrations:', error);
      }
    };

    fetchIntegrations();

    return () => {
      mounted = false;
    };
  }, []);

  return integrations;
}
