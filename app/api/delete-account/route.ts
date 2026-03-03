import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        // Get the access token from the Authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });
        }

        // Use the service role client to verify the token and get the user
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

        if (userError || !user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        const userId = user.id;

        // Delete from all user tables
        await supabaseAdmin.from('watchlists').delete().eq('user_id', userId);
        await supabaseAdmin.from('favorites').delete().eq('user_id', userId);
        await supabaseAdmin.from('recent_watches').delete().eq('user_id', userId);
        await supabaseAdmin.from('user_settings').delete().eq('user_id', userId);
        await supabaseAdmin.from('users').delete().eq('id', userId);

        // Delete the auth user (frees up the email for reuse)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error('Failed to delete auth user:', deleteError);
            return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
