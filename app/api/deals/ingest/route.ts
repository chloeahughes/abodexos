import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getGmailClientForUser, searchMessages } from '@/lib/gmail';
import { consolidateExtractedFields } from '@/lib/extract';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CreateDealRequest {
  keywords: string[];
  dealName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body: CreateDealRequest = await request.json();
    const { keywords, dealName } = body;

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
    }

    // Check if Gmail is connected
    const { data: gmailToken, error: tokenError } = await supabase
      .from('gmail_tokens')
      .select('access_token')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !gmailToken) {
      return NextResponse.json({ error: 'Gmail not connected' }, { status: 400 });
    }

    // Build Gmail search query
    const keywordQuery = keywords.map(kw => `"${kw}"`).join(' OR ');
    const gmailQuery = `(${keywordQuery}) newer_than:180d`;

    // Get Gmail client and search for messages
    const gmailClient = await getGmailClientForUser(user.id);
    const messages = await searchMessages(gmailClient, gmailQuery, 150);

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No matching emails found' }, { status: 400 });
    }

    // Extract fields from messages
    const messageTexts = messages.map(msg => ({
      text: `${msg.subject} ${msg.snippet} ${msg.body || ''}`,
      subject: msg.subject,
    }));

    const extractedFields = consolidateExtractedFields(messageTexts);

    // Generate deal name if not provided
    const finalDealName = dealName || 
      extractedFields.location || 
      messages[0]?.subject?.substring(0, 50) || 
      'New Deal';

    // Create deal in database
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        user_id: user.id,
        name: finalDealName,
        location: extractedFields.location || 'TBD',
        stage: 'Sourcing',
        purchase_price: extractedFields.purchase_price,
        asking_price: extractedFields.asking_price,
        price_per_sqft: extractedFields.price_per_sqft,
        square_feet: extractedFields.square_feet,
        annual_noi: extractedFields.annual_noi,
        stakeholders: ['You'], // Default stakeholder
        last_update_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dealError) {
      console.error('Error creating deal:', dealError);
      return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
    }

    // Store matched emails
    const dealEmails = messages.map(msg => ({
      deal_id: deal.id,
      user_id: user.id,
      gmail_msg_id: msg.id,
      gmail_thread_id: msg.threadId,
      subject: msg.subject,
      sender: msg.from,
      snippet: msg.snippet,
      sent_at: new Date(parseInt(msg.internalDate)).toISOString(),
      matched_keywords: keywords.filter(kw => 
        msg.subject.toLowerCase().includes(kw.toLowerCase()) ||
        msg.snippet.toLowerCase().includes(kw.toLowerCase())
      ),
    }));

    const { error: emailsError } = await supabase
      .from('deal_emails')
      .insert(dealEmails);

    if (emailsError) {
      console.error('Error storing deal emails:', emailsError);
      // Don't fail the request if emails can't be stored
    }

    return NextResponse.json({
      dealId: deal.id,
      matchedCount: messages.length,
    });

  } catch (error) {
    console.error('Error in deals ingest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
