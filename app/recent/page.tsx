"use client";

import React from 'react';
import { Clock, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { AuthGuard } from '@/components/AuthGuard';
import { useSupabase } from '@/hooks/useSupabase';
import { useQueries } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { MovieCard } from '@/components/MovieCard';

export default function RecentPage() {
    const { recentWatches, isLoadingRecent } = useSupabase();

    const results = useQueries({
        queries: recentWatches.map((item) => ({
            queryKey: ['media', item.media_type, item.media_id],
            queryFn: () => tmdbService.getDetails(item.media_type, item.media_id),
        })),
    });

    const searchQuery = useSelector((state: RootState) => state.search.query).toLowerCase();

    const isLoadingDetails = results.some(r => r.isLoading);
    const recentData = results
        .map(r => r.data)
        .filter(Boolean)
        .filter(item => {
            if (!searchQuery) return true;
            const title = (item?.title || item?.name || '').toLowerCase();
            return title.includes(searchQuery);
        });

    return (
        <AuthGuard title="Recently Watched" description="Jump back into the movies and TV shows you've been watching. Log in to sync your watch history across all your devices.">
            <div className="flex flex-col gap-8 mx-auto mt-16 px-6 lg:px-10 py-8 pb-20 w-full max-w-[1400px]">

                {/* Header Section */}
                <div className="flex md:flex-row flex-col justify-between md:items-end gap-6 pb-4 border-white/5 border-b">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10 text-primary">
                                <Clock size={20} />
                            </span>
                            <h1 className="font-black text-white text-4xl leading-tight tracking-tight">
                                Recently Watched
                            </h1>
                        </div>
                        <p className="pl-1 max-w-xl font-medium text-slate-400 text-base">
                            Jump back into the movies and TV shows you&apos;ve been watching on MediaFlow.
                        </p>
                    </div>
                </div>

                {/* Grid */}
                {(isLoadingRecent || isLoadingDetails) ? (
                    <div className="gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white/10 rounded-xl w-full aspect-2/3" />
                        ))}
                    </div>
                ) : recentData.length > 0 ? (
                    <div className="gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {recentData.map((item) => item ? (
                            <MovieCard key={item.id} item={item} />
                        ) : null)}
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 justify-center items-center opacity-50 py-20 min-h-[40vh]">
                        <Search size={64} className="mb-4 text-slate-500" />
                        <h2 className="font-semibold text-slate-400 text-2xl">No recent watches found</h2>
                        <p className="mt-2 text-slate-500 text-sm">
                            {searchQuery ? `No matches for "${searchQuery}" in your history.` : "You haven't watched anything recently."}
                        </p>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
