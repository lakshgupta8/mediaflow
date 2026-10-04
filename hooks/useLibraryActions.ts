"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/store/store';
import { userDataService } from '@/services/userDataService';
import type { MediaType } from '@/services/tmdbService';

/**
 * Lightweight watchlist / favorites toggles for cards and heroes.
 * Shares React Query cache keys with useUserData, so both stay in sync.
 */
export function useLibraryActions() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const { data: watchlist = [] } = useQuery({
        queryKey: ['watchlist', userId],
        queryFn: () => userDataService.getWatchlist(userId as string),
        enabled: !!userId,
    });

    const { data: favorites = [] } = useQuery({
        queryKey: ['favorites', userId],
        queryFn: () => userDataService.getFavorites(userId as string),
        enabled: !!userId,
    });

    const watchlistMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType, remove }: { mediaId: number; mediaType: MediaType; remove: boolean }) => {
            if (!userId) throw new Error('Not logged in');
            return remove
                ? userDataService.removeFromWatchlist(userId, mediaId, mediaType)
                : userDataService.addToWatchlist({ user_id: userId, media_id: mediaId, media_type: mediaType });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['watchlist', userId] }),
    });

    const favoritesMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType, remove }: { mediaId: number; mediaType: MediaType; remove: boolean }) => {
            if (!userId) throw new Error('Not logged in');
            return remove
                ? userDataService.removeFromFavorites(userId, mediaId, mediaType)
                : userDataService.addToFavorites({ user_id: userId, media_id: mediaId, media_type: mediaType });
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['favorites', userId] }),
    });

    const isInWatchlist = (id: number, type: MediaType) => watchlist.some((w) => w.media_id === id && w.media_type === type);
    const isFavorite = (id: number, type: MediaType) => favorites.some((f) => f.media_id === id && f.media_type === type);

    const requireLogin = () => {
        if (userId) return false;
        router.push('/login');
        return true;
    };

    return {
        isLoggedIn: !!userId,
        isInWatchlist,
        isFavorite,
        toggleWatchlist: (id: number, type: MediaType) => {
            if (requireLogin()) return;
            watchlistMutation.mutate({ mediaId: id, mediaType: type, remove: isInWatchlist(id, type) });
        },
        toggleFavorite: (id: number, type: MediaType) => {
            if (requireLogin()) return;
            favoritesMutation.mutate({ mediaId: id, mediaType: type, remove: isFavorite(id, type) });
        },
        isPending: watchlistMutation.isPending || favoritesMutation.isPending,
    };
}
