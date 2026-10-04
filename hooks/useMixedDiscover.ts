"use client";

import { useQuery } from '@tanstack/react-query';
import { tmdbService, type DiscoverParams, type MediaItem } from '@/services/tmdbService';

/**
 * Runs the same discover query for movies and series and interleaves the
 * results by popularity, for mixed rails like "Popular on Netflix".
 */
export function useMixedDiscover(key: string, params: DiscoverParams, enabled = true, limit = 20) {
    return useQuery({
        queryKey: ['mixedDiscover', key, params],
        enabled,
        staleTime: 1000 * 60 * 30,
        queryFn: async (): Promise<MediaItem[]> => {
            const [movies, series] = await Promise.all([
                tmdbService.discover('movie', params),
                tmdbService.discover('tv', params),
            ]);
            return [...movies.results, ...series.results]
                .filter((item) => item.poster_path)
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .slice(0, limit);
        },
    });
}
