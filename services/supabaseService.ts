import { supabase } from '@/lib/supabase';

export interface WatchlistItem {
    id?: string;
    user_id: string;
    media_id: number;
    media_type: 'movie' | 'tv';
    created_at?: string;
}

export const supabaseService = {

    // --- Watchlist ---
    async addToWatchlist(item: Omit<WatchlistItem, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('watchlists')
            .insert([item])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async removeFromWatchlist(userId: string, mediaId: number, mediaType: 'movie' | 'tv') {
        const { error } = await supabase
            .from('watchlists')
            .delete()
            .match({ user_id: userId, media_id: mediaId, media_type: mediaType });

        if (error) throw error;
        return true;
    },

    async getWatchlist(userId: string) {
        const { data, error } = await supabase
            .from('watchlists')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as WatchlistItem[];
    },

    // --- Favorites ---
    async addToFavorites(item: Omit<WatchlistItem, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('favorites')
            .insert([item])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async removeFromFavorites(userId: string, mediaId: number, mediaType: 'movie' | 'tv') {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .match({ user_id: userId, media_id: mediaId, media_type: mediaType });

        if (error) throw error;
        return true;
    },

    async getFavorites(userId: string) {
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as WatchlistItem[];
    }
};
