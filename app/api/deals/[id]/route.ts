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

    // Fetch deal details
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .eq('user_id', user.id)
      .single();

    if (dealError || !deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ deal });

  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
