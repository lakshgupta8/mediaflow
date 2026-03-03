"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabaseService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

export function useSupabase() {
    const queryClient = useQueryClient();
    const router = useRouter();
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

    // Fetch Recent Watches
    const { data: recentWatches, isLoading: isLoadingRecent } = useQuery({
        queryKey: ['recentWatches', userId],
        queryFn: () => supabaseService.getRecentWatches(userId as string),
        enabled: !!userId,
    });

    // Fetch User Profile
    const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: () => supabaseService.getUserProfile(userId as string),
        enabled: !!userId,
    });

    // Fetch User Settings
    const { data: userSettings, isLoading: isLoadingSettings } = useQuery({
        queryKey: ['userSettings', userId],
        queryFn: () => supabaseService.getUserSettings(userId as string),
        enabled: !!userId,
    });

    const handleUnauthenticated = () => {
        router.push('/login');
        throw new Error("Must be logged in to perform this action");
    };

    // Add to Watchlist Mutation
    const addToWatchlistMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) => {
            if (!userId) return handleUnauthenticated();
            return supabaseService.addToWatchlist({ user_id: userId, media_id: mediaId, media_type: mediaType });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
        }
    });

    // Remove from Watchlist Mutation
    const removeFromWatchlistMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) => {
            if (!userId) return handleUnauthenticated();
            return supabaseService.removeFromWatchlist(userId, mediaId, mediaType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
        }
    });

    // Add to Favorites Mutation
    const addToFavoritesMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) => {
            if (!userId) return handleUnauthenticated();
            return supabaseService.addToFavorites({ user_id: userId, media_id: mediaId, media_type: mediaType });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
        }
    });

    // Remove from Favorites Mutation
    const removeFromFavoritesMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) => {
            if (!userId) return handleUnauthenticated();
            return supabaseService.removeFromFavorites(userId, mediaId, mediaType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
        }
    });

    // Add to Recent Mutation
    const addToRecentMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType, progress }: { mediaId: number; mediaType: 'movie' | 'tv', progress?: number }) => {
            if (!userId) return handleUnauthenticated();
            return supabaseService.addToRecent({ user_id: userId, media_id: mediaId, media_type: mediaType, progress });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentWatches', userId] });
        }
    });

    // Remove from Recent Mutation
    const removeFromRecentMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) => {
            if (!userId) return handleUnauthenticated();
            return supabaseService.removeFromRecent(userId, mediaId, mediaType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentWatches', userId] });
        }
    });

    // Update Profile Mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (updates: { full_name?: string; avatar_url?: string | null; email?: string, password?: string }) => {
            if (!userId) return handleUnauthenticated();
            // Handle Auth updates if email or password provided
            if (updates.email || updates.password) {
                const { createClient } = await import('@/utils/supabase/client');
                const supabase = createClient();
                const { error } = await supabase.auth.updateUser({
                    email: updates.email,
                    password: updates.password
                });
                if (error) throw error;
            }
            // Handle Public Profile updates
            return supabaseService.updateUserProfile(userId, {
                full_name: updates.full_name,
                avatar_url: updates.avatar_url
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        }
    });

    // Upload Avatar Mutation
    const uploadAvatarMutation = useMutation({
        mutationFn: async (file: File) => {
            if (!userId) return handleUnauthenticated();
            const url = await supabaseService.uploadAvatar(userId, file);
            return supabaseService.updateUserProfile(userId, { avatar_url: url });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        }
    });

    // Update Settings Mutation
    const updateSettingsMutation = useMutation({
        mutationFn: async (updates: { theme?: string; email_notifications?: boolean; language?: string }) => {
            if (!userId) return handleUnauthenticated();
            return supabaseService.updateUserSettings(userId, updates);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userSettings', userId] });
        }
    });

    return {
        // Data
        watchlist: watchlist || [],
        favorites: favorites || [],
        recentWatches: recentWatches || [],
        userProfile,
        userSettings,
        isLoadingWatchlist,
        isLoadingFavorites,
        isLoadingRecent,
        isLoadingProfile,
        isLoadingSettings,

        // Mutations
        addToWatchlist: addToWatchlistMutation.mutate,
        removeFromWatchlist: removeFromWatchlistMutation.mutate,
        addToFavorites: addToFavoritesMutation.mutate,
        removeFromFavorites: removeFromFavoritesMutation.mutate,
        addToRecent: addToRecentMutation.mutate,
        removeFromRecent: removeFromRecentMutation.mutate,
        updateProfile: updateProfileMutation.mutateAsync,
        uploadAvatar: uploadAvatarMutation.mutateAsync,
        updateSettings: updateSettingsMutation.mutateAsync,

        // Status
        isAddingToWatchlist: addToWatchlistMutation.isPending,
        isRemovingFromWatchlist: removeFromWatchlistMutation.isPending,
        isAddingToRecent: addToRecentMutation.isPending,
        isUpdatingProfile: updateProfileMutation.isPending,
        isUploadingAvatar: uploadAvatarMutation.isPending,
        isUpdatingSettings: updateSettingsMutation.isPending,
    };
}
