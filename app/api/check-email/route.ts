import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ exists: false }, { status: 400 });
        }

        // Use the service role key to query auth.users (bypasses RLS)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        // Check the public.users table (mirrored from auth.users via trigger)
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle();

        if (error) {
            console.error('Email check error:', error);
            return NextResponse.json({ exists: false }, { status: 500 });
        }

        return NextResponse.json({ exists: !!data });
    } catch {
        return NextResponse.json({ exists: false }, { status: 500 });
    }
}
