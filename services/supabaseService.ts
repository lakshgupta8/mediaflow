import { createClient } from '@/utils/supabase/client';

export interface WatchlistItem {
    id?: string;
    user_id: string;
    media_id: number;
    media_type: 'movie' | 'tv';
    added_at?: string;
}

export interface Review {
    id: string;
    user_id: string;
    media_id: number;
    media_type: 'movie' | 'tv';
    content: string;
    created_at: string;
    user?: {
        full_name: string;
        avatar_url: string | null;
    };
}

export const supabaseService = {

    // --- Watchlist ---
    async addToWatchlist(item: Omit<WatchlistItem, 'id' | 'added_at'>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('watchlists')
            .insert([item])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async removeFromWatchlist(userId: string, mediaId: number, mediaType: 'movie' | 'tv') {
        const supabase = createClient();
        const { error } = await supabase
            .from('watchlists')
            .delete()
            .match({ user_id: userId, media_id: mediaId, media_type: mediaType });

        if (error) throw error;
        return true;
    },

    async getWatchlist(userId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('watchlists')
            .select('*')
            .eq('user_id', userId)
            .order('added_at', { ascending: false });

        if (error) throw error;
        return data as WatchlistItem[];
    },

    // --- Favorites ---
    async addToFavorites(item: Omit<WatchlistItem, 'id' | 'added_at'>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('favorites')
            .insert([item])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async removeFromFavorites(userId: string, mediaId: number, mediaType: 'movie' | 'tv') {
        const supabase = createClient();
        const { error } = await supabase
            .from('favorites')
            .delete()
            .match({ user_id: userId, media_id: mediaId, media_type: mediaType });

        if (error) throw error;
        return true;
    },

    async getFavorites(userId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', userId)
            .order('added_at', { ascending: false });

        if (error) throw error;
        return data as WatchlistItem[];
    },

    // --- Recent Watches ---
    async addToRecent(item: Omit<WatchlistItem, 'id' | 'added_at'> & { progress?: number }) {
        const supabase = createClient();

        // Upsert behavior: If user watches again, update the timestamp and progress
        const { data, error } = await supabase
            .from('recent_watches')
            .upsert(
                {
                    user_id: item.user_id,
                    media_id: item.media_id,
                    media_type: item.media_type,
                    progress: item.progress || 100,
                    last_watched_at: new Date().toISOString(),
                },
                { onConflict: 'user_id,media_id,media_type' }
            )
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async removeFromRecent(userId: string, mediaId: number, mediaType: 'movie' | 'tv') {
        const supabase = createClient();
        const { error } = await supabase
            .from('recent_watches')
            .delete()
            .match({ user_id: userId, media_id: mediaId, media_type: mediaType });

        if (error) throw error;
        return true;
    },

    async getRecentWatches(userId: string) {
        const supabase = createClient();

        // App-level 30-day cleanup filter
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data, error } = await supabase
            .from('recent_watches')
            .select('*')
            .eq('user_id', userId)
            .gte('last_watched_at', thirtyDaysAgo.toISOString())
            .order('last_watched_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // --- User Profile ---
    async getUserProfile(userId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateUserProfile(userId: string, updates: { full_name?: string; avatar_url?: string | null }) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async uploadAvatar(userId: string, file: File) {
        const supabase = createClient();

        // Ensure file extension is obtained
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    // --- User Settings ---
    async getUserSettings(userId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned, which might be fine on new accounts before trigger runs
        return data;
    },

    async updateUserSettings(userId: string, updates: { theme?: string; email_notifications?: boolean; language?: string }) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('user_settings')
            .upsert(
                { user_id: userId, ...updates },
                { onConflict: 'user_id' }
            )
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // --- Reviews ---
    async addReview(review: Omit<Review, 'id' | 'created_at' | 'user'>) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('reviews')
            .insert([review])
            .select()
            .single();

        if (error) throw error;
        return data as Review;
    },

    async getReviewsForMedia(mediaId: number, mediaType: 'movie' | 'tv') {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                *,
                user:users (
                    full_name,
                    avatar_url
                )
            `)
            .match({ media_id: mediaId, media_type: mediaType })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Review[];
    },

    async getUserReviews(userId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Review[];
    },

    async deleteReview(reviewId: string, userId: string) {
        const supabase = createClient();
        const { error } = await supabase
            .from('reviews')
            .delete()
            .match({ id: reviewId, user_id: userId });

        if (error) throw error;
        return true;
    }
};
