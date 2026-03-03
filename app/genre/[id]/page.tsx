"use client";

import React, { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { MovieCard } from '@/components/MovieCard';
import { Film, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateGradientById } from '@/utils/helpers';

export default function GenreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const name = searchParams.get('name') || 'Genre';

    // Unwrap params in React 19 / Next 15
    const resolvedParams = use(params);
    const genreId = parseInt(resolvedParams.id, 10);
    const [page, setPage] = useState(1);

    const { data: moviesData, isLoading } = useQuery({
        queryKey: ['discover', 'movie', genreId, page],
        queryFn: () => tmdbService.discoverByGenre('movie', genreId, page),
        enabled: !isNaN(genreId),
    });

    const movies = moviesData?.results || [];
    const totalPages = moviesData?.total_pages || 1;

    return (
        <div className="flex flex-col gap-8 mx-auto mt-16 px-6 lg:px-10 py-8 pb-20 w-full max-w-[1400px]">

            {/* Header with gradient background matching the card */}
            <div
                className="relative shadow-2xl mb-4 p-8 md:p-12 rounded-3xl overflow-hidden"
                style={{ background: isNaN(genreId) ? '#1f2937' : generateGradientById(genreId) }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

                <div className="z-10 relative flex flex-col gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-fit text-white text-sm transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Genres
                    </button>

                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex justify-center items-center bg-white/20 backdrop-blur-md rounded-2xl w-16 h-16 shrink-0">
                            <Film size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-white text-4xl md:text-5xl tracking-tight">
                                {name} Movies
                            </h1>
                            <p className="mt-2 text-white/80 text-lg">
                                Discover the best and most popular titles in {name.toLowerCase()}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {isLoading ? (
                <div className="gap-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-pulse">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-white/10 rounded-xl w-full aspect-2/3" />
                    ))}
                </div>
            ) : movies.length > 0 ? (
                <div className="flex flex-col gap-10">
                    <div className="gap-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} item={movie} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="bg-surface-dark hover:bg-white/10 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold text-white transition-colors"
                            >
                                Previous
                            </button>
                            <span className="font-medium text-slate-400">
                                Page {page} of {Math.min(totalPages, 500)}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= Math.min(totalPages, 500)} // TMDB limits to 500 pages
                                className="bg-surface-dark hover:bg-white/10 px-6 py-3 rounded-xl font-semibold text-white transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col flex-1 justify-center items-center opacity-50 py-20 min-h-[40vh]">
                    <Film size={64} className="mb-4 text-slate-500" />
                    <h2 className="font-semibold text-slate-400 text-2xl">No movies found</h2>
                    <p className="mt-2 text-slate-500 text-sm">
                        Unable to find any titles for this genre.
                    </p>
                </div>
            )}
        </div>
    );
}
