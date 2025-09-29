import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's deals
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (dealsError) {
      console.error('Error fetching deals:', dealsError);
      return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
    }

    return NextResponse.json({ deals: deals || [] });

  } catch (error) {
    console.error('Error in deals API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
