"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabaseService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function useSupabase() {
    const queryClient = useQueryClient();
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id;

    // Fetch Watchlist
    const { data: watchlist, isLoading: isLoadingWatchlist } = useQuery({
        queryKey: ['watchlist', userId],
        queryFn: () => supabaseService.getWatchlist(userId as string),
        enabled: !!userId,
    });

    // Fetch Favorites
    const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
        queryKey: ['favorites', userId],
        queryFn: () => supabaseService.getFavorites(userId as string),
        enabled: !!userId,
    });

    // Add to Watchlist Mutation
    const addToWatchlistMutation = useMutation({
        mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
            supabaseService.addToWatchlist({ user_id: userId as string, media_id: mediaId, media_type: mediaType }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
        }
    });

    // Remove from Watchlist Mutation
    const removeFromWatchlistMutation = useMutation({
        mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
            supabaseService.removeFromWatchlist(userId as string, mediaId, mediaType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
        }
    });

    // Add to Favorites Mutation
    const addToFavoritesMutation = useMutation({
        mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
            supabaseService.addToFavorites({ user_id: userId as string, media_id: mediaId, media_type: mediaType }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
        }
    });

    // Remove from Favorites Mutation
    const removeFromFavoritesMutation = useMutation({
        mutationFn: ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) =>
            supabaseService.removeFromFavorites(userId as string, mediaId, mediaType),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
        }
    });

    return {
        // Data
        watchlist: watchlist || [],
        favorites: favorites || [],
        isLoadingWatchlist,
        isLoadingFavorites,

        // Mutations
        addToWatchlist: addToWatchlistMutation.mutate,
        removeFromWatchlist: removeFromWatchlistMutation.mutate,
        addToFavorites: addToFavoritesMutation.mutate,
        removeFromFavorites: removeFromFavoritesMutation.mutate,

        // Status
        isAddingToWatchlist: addToWatchlistMutation.isPending,
        isRemovingFromWatchlist: removeFromWatchlistMutation.isPending,
    };
}
