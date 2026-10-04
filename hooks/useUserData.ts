"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userDataService, type MediaType } from '@/services/userDataService';
import { authService } from '@/services/authService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

/**
 * All per-user data (watchlist, favorites, recents, profile, reviews) backed by Appwrite,
 * cached with React Query and keyed by the logged-in user's ID.
 */
export function useUserData() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?.id;

    // Fetch Watchlist
    const { data: watchlist, isLoading: isLoadingWatchlist } = useQuery({
        queryKey: ['watchlist', userId],
        queryFn: () => userDataService.getWatchlist(userId as string),
        enabled: !!userId,
    });

    // Fetch Favorites
    const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
        queryKey: ['favorites', userId],
        queryFn: () => userDataService.getFavorites(userId as string),
        enabled: !!userId,
    });

    // Fetch Recent Watches
    const { data: recentWatches, isLoading: isLoadingRecent } = useQuery({
        queryKey: ['recentWatches', userId],
        queryFn: () => userDataService.getRecentWatches(userId as string),
        enabled: !!userId,
    });

    // Fetch User Profile
    const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['userProfile', userId],
        queryFn: () => userDataService.getUserProfile(userId as string),
        enabled: !!userId,
    });

    // Fetch User Reviews
    const { data: userReviews, isLoading: isLoadingUserReviews } = useQuery({
        queryKey: ['userReviews', userId],
        queryFn: () => userDataService.getUserReviews(userId as string),
        enabled: !!userId,
    });

    const handleUnauthenticated = () => {
        router.push('/login');
        throw new Error("Must be logged in to perform this action");
    };

    // Add to Watchlist Mutation
    const addToWatchlistMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: MediaType }) => {
            if (!userId) return handleUnauthenticated();
            return userDataService.addToWatchlist({ user_id: userId, media_id: mediaId, media_type: mediaType });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
        }
    });

    // Remove from Watchlist Mutation
    const removeFromWatchlistMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: MediaType }) => {
            if (!userId) return handleUnauthenticated();
            return userDataService.removeFromWatchlist(userId, mediaId, mediaType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
        }
    });

    // Add to Favorites Mutation
    const addToFavoritesMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: MediaType }) => {
            if (!userId) return handleUnauthenticated();
            return userDataService.addToFavorites({ user_id: userId, media_id: mediaId, media_type: mediaType });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
        }
    });

    // Remove from Favorites Mutation
    const removeFromFavoritesMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: MediaType }) => {
            if (!userId) return handleUnauthenticated();
            return userDataService.removeFromFavorites(userId, mediaId, mediaType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
        }
    });

    // Add to Recent Mutation
    const addToRecentMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: MediaType }) => {
            if (!userId) return handleUnauthenticated();
            return userDataService.addToRecent({ user_id: userId, media_id: mediaId, media_type: mediaType });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentWatches', userId] });
        }
    });

    // Remove from Recent Mutation
    const removeFromRecentMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: MediaType }) => {
            if (!userId) return handleUnauthenticated();
            return userDataService.removeFromRecent(userId, mediaId, mediaType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentWatches', userId] });
        }
    });

    // Update Profile Mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (updates: { full_name?: string; avatar_url?: string | null; email?: string; currentPassword?: string }) => {
            if (!userId) return handleUnauthenticated();

            // Changing the login email requires the current password (Appwrite rule).
            if (updates.email) {
                if (!updates.currentPassword) {
                    throw new Error('Enter your current password to change your email address.');
                }
                await authService.updateEmail(updates.email, updates.currentPassword);
            }

            // Public profile updates
            return userDataService.updateUserProfile(userId, {
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
            const url = await userDataService.uploadAvatar(userId, file);
            return userDataService.updateUserProfile(userId, { avatar_url: url });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
        }
    });

    // Add Review Mutation
    const addReviewMutation = useMutation({
        mutationFn: async ({ mediaId, mediaType, content, parentId }: { mediaId: number; mediaType: MediaType; content: string; parentId?: string }) => {
            if (!userId) return handleUnauthenticated();
            return userDataService.addReview({ user_id: userId, media_id: mediaId, media_type: mediaType, content, parent_id: parentId || null });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', variables.mediaId, variables.mediaType] });
            queryClient.invalidateQueries({ queryKey: ['userReviews', userId] });
        }
    });

    // Delete Review Mutation
    const deleteReviewMutation = useMutation({
        mutationFn: async (reviewId: string) => {
            if (!userId) return handleUnauthenticated();
            return userDataService.deleteReview(reviewId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
            queryClient.invalidateQueries({ queryKey: ['userReviews', userId] });
        }
    });

    return {
        // Data
        watchlist: watchlist || [],
        favorites: favorites || [],
        recentWatches: recentWatches || [],
        userProfile,
        userReviews: userReviews || [],
        isLoadingWatchlist,
        isLoadingFavorites,
        isLoadingRecent,
        isLoadingProfile,
        isLoadingUserReviews,

        // Mutations
        addToWatchlist: addToWatchlistMutation.mutate,
        removeFromWatchlist: removeFromWatchlistMutation.mutate,
        addToFavorites: addToFavoritesMutation.mutate,
        removeFromFavorites: removeFromFavoritesMutation.mutate,
        addToRecent: addToRecentMutation.mutate,
        removeFromRecent: removeFromRecentMutation.mutate,
        updateProfile: updateProfileMutation.mutateAsync,
        uploadAvatar: uploadAvatarMutation.mutateAsync,
        addReview: addReviewMutation.mutateAsync,
        deleteReview: deleteReviewMutation.mutateAsync,

        // Status
        isAddingToWatchlist: addToWatchlistMutation.isPending,
        isRemovingFromWatchlist: removeFromWatchlistMutation.isPending,
        isAddingToRecent: addToRecentMutation.isPending,
        isUpdatingProfile: updateProfileMutation.isPending,
        isUploadingAvatar: uploadAvatarMutation.isPending,
        isAddingReview: addReviewMutation.isPending,
        isDeletingReview: deleteReviewMutation.isPending,
    };
}
