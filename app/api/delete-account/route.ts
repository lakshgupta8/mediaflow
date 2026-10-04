import { Query } from 'node-appwrite';
import { NextRequest, NextResponse } from 'next/server';
import {
    createAdminClient,
    createUserClient,
    DATABASE_ID,
    AVATAR_BUCKET_ID,
    TABLES,
    USER_OWNED_TABLES,
} from '@/lib/appwrite-server';

const PAGE_SIZE = 100;

export async function DELETE(request: NextRequest) {
    try {
        // The browser sends a short-lived Appwrite JWT proving who is asking.
        const authHeader = request.headers.get('Authorization');
        const jwt = authHeader?.replace('Bearer ', '');

        if (!jwt) {
            return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });
        }

        let userId: string;
        try {
            const { account } = createUserClient(jwt);
            userId = (await account.get()).$id;
        } catch {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        }

        const { users, tablesDB, storage } = createAdminClient();

        // Remove every row the user owns, page by page.
        for (const tableId of USER_OWNED_TABLES) {
            for (;;) {
                const page = await tablesDB.listRows({
                    databaseId: DATABASE_ID,
                    tableId,
                    queries: [Query.equal('user_id', userId), Query.limit(PAGE_SIZE)],
                });
                if (page.rows.length === 0) break;

                await Promise.all(
                    page.rows.map((row) =>
                        tablesDB.deleteRow({ databaseId: DATABASE_ID, tableId, rowId: row.$id })
                    )
                );
                if (page.rows.length < PAGE_SIZE) break;
            }
        }

        // Public profile (row ID = user ID). Ignore if it was never created.
        try {
            await tablesDB.deleteRow({ databaseId: DATABASE_ID, tableId: TABLES.profiles, rowId: userId });
        } catch {
            // no profile row
        }

        // Avatar files are named "<userId>-<timestamp>.<ext>".
        try {
            const files = await storage.listFiles({
                bucketId: AVATAR_BUCKET_ID,
                queries: [Query.startsWith('name', userId), Query.limit(PAGE_SIZE)],
            });
            await Promise.all(
                files.files.map((file) => storage.deleteFile({ bucketId: AVATAR_BUCKET_ID, fileId: file.$id }))
            );
        } catch (error) {
            console.error('Failed to delete avatar files:', error);
        }

        // Finally delete the auth user, which frees the email for reuse.
        await users.delete({ userId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
}
