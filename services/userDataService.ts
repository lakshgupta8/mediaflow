import { ID, Permission, Query, Role, type Models } from 'appwrite';
import {
    account,
    tablesDB,
    storage,
    DATABASE_ID,
    AVATAR_BUCKET_ID,
    TABLES,
    isAppwriteError,
} from '@/lib/appwrite';

export type MediaType = 'movie' | 'tv';

// ---------- Public shapes consumed by the UI ----------

export interface WatchlistItem {
    id: string;
    user_id: string;
    media_id: number;
    media_type: MediaType;
    added_at: string;
}

export interface RecentWatchItem extends WatchlistItem {
    last_watched_at: string;
}

export interface UserProfile {
    id: string;
    full_name: string;
    avatar_url: string | null;
}

export interface Review {
    id: string;
    user_id: string;
    media_id: number;
    media_type: MediaType;
    content: string;
    parent_id: string | null;
    created_at: string;
    user?: {
        full_name: string;
        avatar_url: string | null;
    };
}

// ---------- Row shapes as stored in Appwrite ----------

interface MediaRow extends Models.Row {
    user_id: string;
    media_id: number;
    media_type: MediaType;
}

interface RecentRow extends MediaRow {
    last_watched_at: string;
}

interface ProfileRow extends Models.Row {
    full_name: string;
    avatar_url: string | null;
}

interface ReviewRow extends MediaRow {
    content: string;
    parent_id: string | null;
}

// ---------- Helpers ----------

const PAGE_SIZE = 100;

/** Only the owner can read, update or delete the row. */
const ownerOnly = (userId: string) => [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
];

/** Anyone can read; only the owner can change or delete. */
const publicReadOwnerWrite = (userId: string) => [
    Permission.read(Role.any()),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
];

const toItem = (row: MediaRow): WatchlistItem => ({
    id: row.$id,
    user_id: row.user_id,
    media_id: row.media_id,
    media_type: row.media_type,
    added_at: row.$createdAt,
});

const toRecentItem = (row: RecentRow): RecentWatchItem => ({
    ...toItem(row),
    last_watched_at: row.last_watched_at,
});

const toProfile = (row: ProfileRow): UserProfile => ({
    id: row.$id,
    full_name: row.full_name,
    avatar_url: row.avatar_url ?? null,
});

const toReview = (row: ReviewRow, user?: UserProfile): Review => ({
    id: row.$id,
    user_id: row.user_id,
    media_id: row.media_id,
    media_type: row.media_type,
    content: row.content,
    parent_id: row.parent_id ?? null,
    created_at: row.$createdAt,
    user: user ? { full_name: user.full_name, avatar_url: user.avatar_url } : undefined,
});

/** Fetches every row matching the queries, following the cursor across pages. */
async function listAllRows<Row extends Models.Row>(tableId: string, queries: string[]): Promise<Row[]> {
    const rows: Row[] = [];
    let cursor: string | undefined;

    for (;;) {
        const page = await tablesDB.listRows<Row>({
            databaseId: DATABASE_ID,
            tableId,
            queries: [
                ...queries,
                Query.limit(PAGE_SIZE),
                ...(cursor ? [Query.cursorAfter(cursor)] : []),
            ],
        });

        rows.push(...page.rows);
        if (page.rows.length < PAGE_SIZE) break;
        cursor = page.rows[page.rows.length - 1].$id;
    }

    return rows;
}

const mediaQueries = (userId: string, mediaId: number, mediaType: MediaType) => [
    Query.equal('user_id', userId),
    Query.equal('media_id', mediaId),
    Query.equal('media_type', mediaType),
];

async function addMediaRow(tableId: string, item: Omit<WatchlistItem, 'id' | 'added_at'>): Promise<WatchlistItem | null> {
    try {
        const row = await tablesDB.createRow<MediaRow>({
            databaseId: DATABASE_ID,
            tableId,
            rowId: ID.unique(),
            data: { user_id: item.user_id, media_id: item.media_id, media_type: item.media_type },
            permissions: ownerOnly(item.user_id),
        });
        return toItem(row);
    } catch (error) {
        // 409 = the unique (user, media) index already holds this entry; treat as a no-op.
        if (isAppwriteError(error, 409)) return null;
        throw error;
    }
}

async function removeMediaRows(tableId: string, userId: string, mediaId: number, mediaType: MediaType) {
    const rows = await listAllRows<MediaRow>(tableId, mediaQueries(userId, mediaId, mediaType));
    await Promise.all(
        rows.map((row) => tablesDB.deleteRow({ databaseId: DATABASE_ID, tableId, rowId: row.$id }))
    );
    return true;
}

async function getMediaRows(tableId: string, userId: string): Promise<WatchlistItem[]> {
    const rows = await listAllRows<MediaRow>(tableId, [
        Query.equal('user_id', userId),
        Query.orderDesc('$createdAt'),
    ]);
    return rows.map(toItem);
}

function avatarFileIdFromUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    const match = url.match(new RegExp(`/buckets/${AVATAR_BUCKET_ID}/files/([^/?]+)/`));
    return match?.[1] ?? null;
}

async function deleteAvatarFile(url: string | null | undefined) {
    const fileId = avatarFileIdFromUrl(url);
    if (!fileId) return;
    try {
        await storage.deleteFile({ bucketId: AVATAR_BUCKET_ID, fileId });
    } catch {
        // The file may already be gone; the profile update is what matters.
    }
}

function chunk<T>(items: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
    return out;
}

// ---------- Service ----------

export const userDataService = {

    // --- Watchlist ---
    addToWatchlist(item: Omit<WatchlistItem, 'id' | 'added_at'>) {
        return addMediaRow(TABLES.watchlists, item);
    },

    removeFromWatchlist(userId: string, mediaId: number, mediaType: MediaType) {
        return removeMediaRows(TABLES.watchlists, userId, mediaId, mediaType);
    },

    getWatchlist(userId: string) {
        return getMediaRows(TABLES.watchlists, userId);
    },

    // --- Favorites ---
    addToFavorites(item: Omit<WatchlistItem, 'id' | 'added_at'>) {
        return addMediaRow(TABLES.favorites, item);
    },

    removeFromFavorites(userId: string, mediaId: number, mediaType: MediaType) {
        return removeMediaRows(TABLES.favorites, userId, mediaId, mediaType);
    },

    getFavorites(userId: string) {
        return getMediaRows(TABLES.favorites, userId);
    },

    // --- Recent Watches ---
    async addToRecent(item: Omit<WatchlistItem, 'id' | 'added_at'>): Promise<RecentWatchItem> {
        const existing = await tablesDB.listRows<RecentRow>({
            databaseId: DATABASE_ID,
            tableId: TABLES.recentWatches,
            queries: [...mediaQueries(item.user_id, item.media_id, item.media_type), Query.limit(1)],
        });

        const update = { last_watched_at: new Date().toISOString() };

        // Upsert: marking a title again bumps the timestamp on the existing row.
        const current = existing.rows[0];
        const row = current
            ? await tablesDB.updateRow<RecentRow>({
                databaseId: DATABASE_ID,
                tableId: TABLES.recentWatches,
                rowId: current.$id,
                data: update,
            })
            : await tablesDB.createRow<RecentRow>({
                databaseId: DATABASE_ID,
                tableId: TABLES.recentWatches,
                rowId: ID.unique(),
                data: {
                    user_id: item.user_id,
                    media_id: item.media_id,
                    media_type: item.media_type,
                    ...update,
                },
                permissions: ownerOnly(item.user_id),
            });

        return toRecentItem(row);
    },

    removeFromRecent(userId: string, mediaId: number, mediaType: MediaType) {
        return removeMediaRows(TABLES.recentWatches, userId, mediaId, mediaType);
    },

    async getRecentWatches(userId: string): Promise<RecentWatchItem[]> {
        const rows = await listAllRows<RecentRow>(TABLES.recentWatches, [
            Query.equal('user_id', userId),
            Query.orderDesc('last_watched_at'),
        ]);
        return rows.map(toRecentItem);
    },

    // --- User Profile ---
    async createUserProfile(userId: string, fullName: string): Promise<UserProfile> {
        const row = await tablesDB.createRow<ProfileRow>({
            databaseId: DATABASE_ID,
            tableId: TABLES.profiles,
            rowId: userId,
            data: { full_name: fullName, avatar_url: null },
            permissions: publicReadOwnerWrite(userId),
        });
        return toProfile(row);
    },

    async getUserProfile(userId: string): Promise<UserProfile> {
        try {
            const row = await tablesDB.getRow<ProfileRow>({
                databaseId: DATABASE_ID,
                tableId: TABLES.profiles,
                rowId: userId,
            });
            return toProfile(row);
        } catch (error) {
            if (!isAppwriteError(error, 404)) throw error;
            // Profile missing (e.g. signup was interrupted): create it from the auth account.
            const me = await account.get();
            return this.createUserProfile(userId, me.name || me.email.split('@')[0] || 'User');
        }
    },

    async getProfilesByIds(userIds: string[]): Promise<Map<string, UserProfile>> {
        const map = new Map<string, UserProfile>();
        const unique = Array.from(new Set(userIds));

        for (const ids of chunk(unique, PAGE_SIZE)) {
            const page = await tablesDB.listRows<ProfileRow>({
                databaseId: DATABASE_ID,
                tableId: TABLES.profiles,
                queries: [Query.equal('$id', ids), Query.limit(ids.length)],
            });
            page.rows.forEach((row) => map.set(row.$id, toProfile(row)));
        }

        return map;
    },

    async updateUserProfile(userId: string, updates: { full_name?: string; avatar_url?: string | null }): Promise<UserProfile> {
        const data: { full_name?: string; avatar_url?: string | null } = {};

        if (updates.full_name !== undefined) {
            data.full_name = updates.full_name;
            // Keep the auth account's display name in sync with the public profile.
            await account.updateName({ name: updates.full_name });
        }

        if (updates.avatar_url !== undefined) {
            data.avatar_url = updates.avatar_url;
            if (updates.avatar_url === null) {
                const current = await this.getUserProfile(userId);
                await deleteAvatarFile(current.avatar_url);
            }
        }

        const row = await tablesDB.updateRow<ProfileRow>({
            databaseId: DATABASE_ID,
            tableId: TABLES.profiles,
            rowId: userId,
            data,
        });
        return toProfile(row);
    },

    async uploadAvatar(userId: string, file: File): Promise<string> {
        const previous = await this.getUserProfile(userId);

        // Prefix the file name with the user ID so the account-deletion route can find it.
        const ext = file.name.split('.').pop() || 'jpg';
        const named = new File([file], `${userId}-${Date.now()}.${ext}`, { type: file.type });

        const created = await storage.createFile({
            bucketId: AVATAR_BUCKET_ID,
            fileId: ID.unique(),
            file: named,
            permissions: publicReadOwnerWrite(userId),
        });

        await deleteAvatarFile(previous.avatar_url);

        return storage.getFileView({ bucketId: AVATAR_BUCKET_ID, fileId: created.$id });
    },

    // --- Reviews ---
    async addReview(review: Omit<Review, 'id' | 'created_at' | 'user'>): Promise<Review> {
        const row = await tablesDB.createRow<ReviewRow>({
            databaseId: DATABASE_ID,
            tableId: TABLES.reviews,
            rowId: ID.unique(),
            data: {
                user_id: review.user_id,
                media_id: review.media_id,
                media_type: review.media_type,
                content: review.content,
                parent_id: review.parent_id || null,
            },
            permissions: publicReadOwnerWrite(review.user_id),
        });
        return toReview(row);
    },

    async getReviewsForMedia(mediaId: number, mediaType: MediaType): Promise<Review[]> {
        const rows = await listAllRows<ReviewRow>(TABLES.reviews, [
            Query.equal('media_id', mediaId),
            Query.equal('media_type', mediaType),
            Query.orderDesc('$createdAt'),
        ]);

        // Appwrite has no joins: attach author profiles in a second query.
        const profiles = await this.getProfilesByIds(rows.map((row) => row.user_id));
        return rows.map((row) => toReview(row, profiles.get(row.user_id)));
    },

    async getUserReviews(userId: string): Promise<Review[]> {
        const rows = await listAllRows<ReviewRow>(TABLES.reviews, [
            Query.equal('user_id', userId),
            Query.orderDesc('$createdAt'),
        ]);
        return rows.map((row) => toReview(row));
    },

    async deleteReview(reviewId: string) {
        await tablesDB.deleteRow({
            databaseId: DATABASE_ID,
            tableId: TABLES.reviews,
            rowId: reviewId,
        });
        return true;
    },
};
