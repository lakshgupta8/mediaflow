"use client";

import { useSupabase } from '@/hooks/useSupabase';
import { useQueries } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { MovieCard } from '@/components/MovieCard';
import { Heart, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { AuthGuard } from '@/components/AuthGuard';

export default function FavoritesPage() {
    const { favorites, isLoadingFavorites } = useSupabase();

    // Use useQueries to dynamically fetch details for everything in the favorites
    const results = useQueries({
        queries: favorites.map((item) => ({
            queryKey: ['media', item.media_type, item.media_id],
            queryFn: () => tmdbService.getDetails(item.media_type, item.media_id),
        })),
    });
    const searchQuery = useSelector((state: RootState) => state.search.query).toLowerCase();

    const isLoadingDetails = results.some(r => r.isLoading);
    const favoritesData = results
        .map(r => r.data)
        .filter(Boolean)
        .filter(item => {
            if (!searchQuery) return true;
            const title = (item?.title || item?.name || '').toLowerCase();
            return title.includes(searchQuery);
        });

    return (
        <AuthGuard title="Your Favorites" description="Your very own collection of favorite movies and TV shows. Log in to access and manage your favorites anytime, anywhere.">
            <div className="flex flex-col gap-8 p-8 w-full">
                <div className="mt-20 mb-4">
                    <h1 className="font-bold text-white text-3xl">My Favorites</h1>
                    <p className="mt-2 text-slate-400">
                        {(isLoadingFavorites || isLoadingDetails) ? 'Loading your list...' : `${favoritesData.length} items saved`}
                    </p>
                </div>

                {(isLoadingFavorites) ? (
                    <div className="gap-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white/10 rounded-xl w-full aspect-2/3" />
                        ))}
                    </div>
                ) : favoritesData.length > 0 ? (
                    <div className="gap-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {favoritesData.map((item) => item ? (
                            <MovieCard key={item.id} item={item} />
                        ) : null)}
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 justify-center items-center opacity-50 py-20 min-h-[40vh]">
                        {searchQuery ? (
                            <>
                                <Search size={64} className="mb-4 text-slate-500" />
                                <h2 className="font-semibold text-slate-400 text-2xl">No items found</h2>
                                <p className="mt-2 text-slate-500 text-sm">
                                    No matches for &quot;{searchQuery}&quot; in your favorites.
                                </p>
                            </>
                        ) : (
                            <>
                                <Heart size={64} className="mb-4 text-slate-500" />
                                <h2 className="font-semibold text-slate-400 text-2xl">No favorites yet</h2>
                                <p className="mt-2 text-slate-500 text-sm">Find movies and TV shows you love and add them here</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
