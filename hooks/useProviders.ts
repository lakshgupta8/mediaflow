"use client";

import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { tmdbService, type MediaType } from '@/services/tmdbService';

const DAY = 1000 * 60 * 60 * 24;

/** The user's current watch region and subscribed providers. */
export function usePreferences() {
    return useSelector((state: RootState) => state.preferences);
}

/** All providers (movies + series) available in the active region. */
export function useProviderCatalog(region?: string) {
    const prefs = usePreferences();
    const activeRegion = region || prefs.region;
    return useQuery({
        queryKey: ['providers', 'all', activeRegion],
        queryFn: () => tmdbService.getAllProviders(activeRegion),
        enabled: prefs.hydrated || !!region,
        staleTime: DAY,
    });
}

/** Where one title can be watched, for the active region. */
export function useWatchProviders(mediaType: MediaType, id: number) {
    const { region, hydrated } = usePreferences();
    const query = useQuery({
        queryKey: ['watchProviders', mediaType, id],
        queryFn: () => tmdbService.getWatchProviders(mediaType, id),
        enabled: !!id,
        staleTime: 1000 * 60 * 60,
    });
    return {
        ...query,
        region,
        hydrated,
        availability: query.data?.[region] || null,
        regionsAvailable: query.data ? Object.keys(query.data) : [],
    };
}

export function useWatchRegions() {
    return useQuery({
        queryKey: ['watchRegions'],
        queryFn: () => tmdbService.getWatchRegions(),
        staleTime: DAY * 7,
    });
}

export function useGenres(mediaType: MediaType) {
    return useQuery({
        queryKey: ['genres', mediaType],
        queryFn: () => tmdbService.getGenres(mediaType),
        staleTime: DAY,
    });
}
