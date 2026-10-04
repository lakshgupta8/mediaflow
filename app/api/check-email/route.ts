import { Query } from 'node-appwrite';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite-server';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ exists: false }, { status: 400 });
        }

        // The API key lets us look users up without exposing the list to the browser.
        const { users } = createAdminClient();
        const result = await users.list({
            queries: [Query.equal('email', email.toLowerCase().trim()), Query.limit(1)],
        });

        return NextResponse.json({ exists: result.users.length > 0 });
    } catch (error) {
        console.error('Email check error:', error);
        return NextResponse.json({ exists: false }, { status: 500 });
    }
}
