"use client";

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { MovieCard } from '@/components/MovieCard';
import { Search } from 'lucide-react';
import { Suspense } from 'react';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const { data: searchResults, isLoading } = useQuery({
        queryKey: ['search', query],
        queryFn: () => tmdbService.searchMulti(query),
        enabled: !!query,
    });

    const results = searchResults?.results || [];

    return (
        <div className="flex flex-col gap-8 p-8 w-full">
            <div className="mt-20 mb-4">
                <h1 className="font-bold text-white text-3xl">
                    Search Results for <span className="text-primary">&quot;{query}&quot;</span>
                </h1>
                <p className="mt-2 text-slate-400">
                    {isLoading ? 'Searching...' : `Found ${results.length} results`}
                </p>
            </div>

            {isLoading ? (
                <div className="gap-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-pulse">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-white/10 rounded-xl w-full aspect-2/3" />
                    ))}
                </div>
            ) : results.length > 0 ? (
                <div className="gap-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {results.map((item) => (
                        <MovieCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col flex-1 justify-center items-center opacity-50 py-20 min-h-[40vh]">
                    <Search size={64} className="mb-4 text-slate-500" />
                    <h2 className="font-semibold text-slate-400 text-2xl">No results found</h2>
                    <p className="mt-2 text-slate-500 text-sm">Try adjusting your search query</p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex flex-1 justify-center items-center min-h-[40vh] text-slate-400">Loading search...</div>}>
            <SearchContent />
        </Suspense>
    );
}
