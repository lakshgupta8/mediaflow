/**
 * Shared Appwrite identifiers used by both the browser SDK (`lib/appwrite.ts`)
 * and the server SDK (`lib/appwrite-server.ts`).
 *
 * Table and bucket IDs are fixed so the provisioning script
 * (`scripts/setup-appwrite.ts`) and the app always agree on them.
 */
export const APPWRITE_ENDPOINT =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'mediaflow';

export const AVATAR_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'avatars';

export const TABLES = {
    profiles: 'profiles',
    watchlists: 'watchlists',
    favorites: 'favorites',
    recentWatches: 'recent_watches',
    reviews: 'reviews',
} as const;

/** Tables that hold per-user rows keyed by a `user_id` column. */
export const USER_OWNED_TABLES = [
    TABLES.watchlists,
    TABLES.favorites,
    TABLES.recentWatches,
    TABLES.reviews,
] as const;
