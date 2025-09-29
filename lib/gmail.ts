import { google } from 'googleapis';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  from: string;
  internalDate: string;
  body?: string;
}

export async function getGmailClientForUser(userId: string) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get the stored Gmail token for this user
  const { data: tokenData, error } = await supabase
    .from('gmail_tokens')
    .select('access_token, refresh_token, expiry_date')
    .eq('user_id', userId)
    .single();

  if (error || !tokenData) {
    throw new Error('Gmail not connected for user');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry_date: tokenData.expiry_date,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function searchMessages(
  gmailClient: any,
  query: string,
  maxResults: number = 150
): Promise<GmailMessage[]> {
  try {
    const response = await gmailClient.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const messages = response.data.messages || [];
    const messageDetails = await Promise.all(
      messages.map(async (msg: any) => {
        const detail = await gmailClient.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });

        const headers = detail.data.payload.headers;
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
        const from = headers.find((h: any) => h.name === 'From')?.value || '';
        const snippet = detail.data.snippet || '';
        const internalDate = detail.data.internalDate || '';

        // Extract body text if available
        let body = '';
        if (detail.data.payload.body?.data) {
          body = Buffer.from(detail.data.payload.body.data, 'base64').toString();
        } else if (detail.data.payload.parts) {
          const textPart = detail.data.payload.parts.find((part: any) => 
            part.mimeType === 'text/plain' && part.body?.data
          );
          if (textPart) {
            body = Buffer.from(textPart.body.data, 'base64').toString();
          }
        }

        return {
          id: msg.id,
          threadId: msg.threadId,
          subject,
          snippet,
          from,
          internalDate,
          body,
        };
      })
    );

    return messageDetails;
  } catch (error) {
    console.error('Error searching Gmail messages:', error);
    throw error;
  }
}

export async function getMessageDetails(gmailClient: any, messageId: string): Promise<GmailMessage> {
  try {
    const response = await gmailClient.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const headers = response.data.payload.headers;
    const subject = headers.find((h: any) => h.name === 'Subject')?.value || '';
    const from = headers.find((h: any) => h.name === 'From')?.value || '';
    const snippet = response.data.snippet || '';
    const internalDate = response.data.internalDate || '';

    let body = '';
    if (response.data.payload.body?.data) {
      body = Buffer.from(response.data.payload.body.data, 'base64').toString();
    } else if (response.data.payload.parts) {
      const textPart = response.data.payload.parts.find((part: any) => 
        part.mimeType === 'text/plain' && part.body?.data
      );
      if (textPart) {
        body = Buffer.from(textPart.body.data, 'base64').toString();
      }
    }

    return {
      id: messageId,
      threadId: response.data.threadId,
      subject,
      snippet,
      from,
      internalDate,
      body,
    };
  } catch (error) {
    console.error('Error getting message details:', error);
    throw error;
  }
}
