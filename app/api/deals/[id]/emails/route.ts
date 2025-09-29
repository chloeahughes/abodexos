import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dealId = params.id;

    // Verify user owns this deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('id')
      .eq('id', dealId)
      .eq('user_id', user.id)
      .single();

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    // Fetch deal emails
    const { data: emails, error: emailsError } = await supabase
      .from('deal_emails')
      .select('*')
      .eq('deal_id', dealId)
      .eq('user_id', user.id)
      .order('sent_at', { ascending: false });

    if (emailsError) {
      console.error('Error fetching deal emails:', emailsError);
      return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
    }

    return NextResponse.json({ emails: emails || [] });

  } catch (error) {
    console.error('Error fetching deal emails:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
