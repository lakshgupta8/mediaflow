"use client";

import { useSupabase } from '@/hooks/useSupabase';
import { useQueries } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { MovieCard } from '@/components/MovieCard';
import { Bookmark, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function WatchlistPage() {
    const { watchlist, isLoadingWatchlist } = useSupabase();

    const results = useQueries({
        queries: watchlist.map((item) => ({
            queryKey: ['media', item.media_type, item.media_id],
            queryFn: () => tmdbService.getDetails(item.media_type, item.media_id),
        })),
    });

    const searchQuery = useSelector((state: RootState) => state.search.query).toLowerCase();

    const isLoadingDetails = results.some(r => r.isLoading);
    const watchlistData = results
        .map(r => r.data)
        .filter(Boolean)
        .filter(item => {
            if (!searchQuery) return true;
            const title = (item?.title || item?.name || '').toLowerCase();
            return title.includes(searchQuery);
        });

    return (
        <div className="flex flex-col gap-8 p-8 w-full">
            <div className="mt-20 mb-4">
                <h1 className="font-bold text-white text-3xl">My Watchlist</h1>
                <p className="mt-2 text-slate-400">
                    {(isLoadingWatchlist || isLoadingDetails) ? 'Loading your list...' : `${watchlistData.length} items saved`}
                </p>
            </div>

            {(isLoadingWatchlist) ? (
                <div className="gap-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white/10 rounded-xl w-full aspect-2/3" />
                    ))}
                </div>
            ) : watchlistData.length > 0 ? (
                <div className="gap-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {watchlistData.map((item) => item ? (
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
                                No matches for &quot;{searchQuery}&quot; in your watchlist.
                            </p>
                        </>
                    ) : (
                        <>
                            <Bookmark size={64} className="mb-4 text-slate-500" />
                            <h2 className="font-semibold text-slate-400 text-2xl">Your watchlist is empty</h2>
                            <p className="mt-2 text-slate-500 text-sm">Find movies and TV shows you want to watch and add them here</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
