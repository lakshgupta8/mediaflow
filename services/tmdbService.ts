import { tmdb } from '@/lib/tmdb';

export type MediaType = 'movie' | 'tv';

export interface TMDBResponse<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export interface TMDBGenre {
    id: number;
    name: string;
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface CrewMember {
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
}

export interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    media_type?: string;
    overview: string;
    vote_average: number;
    vote_count?: number;
    popularity?: number;
    release_date?: string;
    first_air_date?: string;
    genre_ids?: number[];
    original_language?: string;
    // Detail-specific fields:
    runtime?: number;
    episode_run_time?: number[];
    genres?: TMDBGenre[];
    status?: string;
    tagline?: string;
    budget?: number;
    revenue?: number;
    number_of_seasons?: number;
    number_of_episodes?: number;
    seasons?: { id: number; season_number: number; name: string; episode_count: number; poster_path: string | null; air_date: string | null }[];
    created_by?: { id: number; name: string; profile_path: string | null }[];
    networks?: { id: number; name: string; logo_path: string | null }[];
    production_companies?: { id: number; name: string; logo_path: string | null }[];
    spoken_languages?: { english_name: string; iso_639_1: string }[];
    credits?: {
        cast: CastMember[];
        crew: CrewMember[];
    };
    videos?: {
        results: { id: string; key: string; site: string; type: string; name: string }[];
    };
    // Person-specific fields:
    profile_path?: string | null;
    biography?: string;
    birthday?: string;
    deathday?: string | null;
    place_of_birth?: string;
    known_for_department?: string;
    gender?: number;
    character?: string;
    job?: string;
    combined_credits?: {
        cast: MediaItem[];
        crew: MediaItem[];
    };
}

export interface Episode {
    id: number;
    episode_number: number;
    season_number: number;
    name: string;
    overview: string;
    runtime: number | null;
    vote_average: number;
    still_path: string | null;
    air_date: string | null;
}

export interface SeasonDetails {
    id: number;
    season_number: number;
    name: string;
    overview: string;
    episodes: Episode[];
}

// ---------- Watch providers (data by JustWatch, served through TMDB) ----------

export interface WatchProvider {
    provider_id: number;
    provider_name: string;
    logo_path: string;
    display_priority: number;
    display_priorities?: Record<string, number>;
}

/** How a title can be obtained from a provider. */
export type Monetization = 'flatrate' | 'free' | 'ads' | 'rent' | 'buy';

export type RegionAvailability = {
    link: string;
} & Partial<Record<Monetization, WatchProvider[]>>;

export interface WatchRegion {
    iso_3166_1: string;
    english_name: string;
    native_name: string;
}

export type DiscoverSort =
    | 'popularity.desc'
    | 'vote_average.desc'
    | 'primary_release_date.desc'
    | 'first_air_date.desc'
    | 'revenue.desc';

export interface DiscoverParams {
    page?: number;
    sortBy?: DiscoverSort;
    genreIds?: number[];
    providerIds?: number[];
    region?: string;
    monetization?: Monetization[];
    minVotes?: number;
    /** ISO 639-1 code, e.g. "ja" for anime. */
    originalLanguage?: string;
    /** Series only: an episode airs within this window (YYYY-MM-DD). */
    airDateFrom?: string;
    airDateTo?: string;
    /** Series only: premiered on or after this date (YYYY-MM-DD). */
    firstAirDateFrom?: string;
    /** TMDB keyword IDs to exclude. */
    withoutKeywords?: readonly number[];
}

/** TMDB has no anime type; anime is Japanese-language animation. */
export const ANIME_GENRE_ID = 16;

/** TMDB keywords for explicit content that TMDB's adult flag misses (ecchi, hentai, erotic, softcore). */
export const EXPLICIT_KEYWORDS = [195669, 285672, 198385, 384581, 155477, 256466, 378816] as const;

export const ANIME_PRESET = {
    genreIds: [ANIME_GENRE_ID],
    originalLanguage: 'ja',
    withoutKeywords: EXPLICIT_KEYWORDS,
} as const;

export type ListName = 'popular' | 'top_rated' | 'now_playing' | 'upcoming' | 'on_the_air' | 'airing_today';

/** Discover/list endpoints omit media_type; stamp it so cards can route correctly. */
const withMediaType = (data: TMDBResponse<MediaItem>, mediaType: MediaType): TMDBResponse<MediaItem> => ({
    ...data,
    results: data.results.map((item) => ({ ...item, media_type: item.media_type || mediaType })),
});

const sortProviders = (providers: WatchProvider[], region: string) =>
    [...providers].sort((a, b) => {
        const pa = a.display_priorities?.[region] ?? a.display_priority ?? 999;
        const pb = b.display_priorities?.[region] ?? b.display_priority ?? 999;
        return pa - pb;
    });

export const tmdbService = {
    /**
     * Fetch trending movies or tv shows.
     * @param mediaType 'movie', 'tv', or 'all'
     * @param timeWindow 'day' or 'week'
     */
    async getTrending(mediaType: MediaType | 'all' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>(`/trending/${mediaType}/${timeWindow}`);
        return mediaType === 'all' ? data : withMediaType(data, mediaType);
    },

    /** Fetch top rated movies or tv shows. */
    async getTopRated(mediaType: MediaType = 'movie', page: number = 1): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>(`/${mediaType}/top_rated`, {
            params: { page },
        });
        return withMediaType(data, mediaType);
    },

    /** Curated TMDB lists such as popular, now_playing or on_the_air. */
    async getList(mediaType: MediaType, list: ListName, page: number = 1, region?: string): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>(`/${mediaType}/${list}`, {
            params: { page, ...(region ? { region } : {}) },
        });
        return withMediaType(data, mediaType);
    },

    /** Search across all movies, tv shows, and people. */
    async searchMulti(query: string, page: number = 1): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>('/search/multi', {
            params: { query, page, include_adult: false },
        });
        return data;
    },

    /** Get details of a specific movie or tv show, including credits and videos. */
    async getDetails(mediaType: MediaType, id: number): Promise<MediaItem> {
        const { data } = await tmdb.get<MediaItem>(`/${mediaType}/${id}`, {
            params: { append_to_response: 'credits,videos' },
        });
        return { ...data, media_type: mediaType };
    },

    /** Titles TMDB recommends alongside the given one. */
    async getRecommendations(mediaType: MediaType, id: number): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>(`/${mediaType}/${id}/recommendations`);
        return withMediaType(data, mediaType);
    },

    /** Details for a specific TV season, including all episodes. */
    async getTvSeason(seriesId: number, seasonNumber: number): Promise<SeasonDetails> {
        const { data } = await tmdb.get<SeasonDetails>(`/tv/${seriesId}/season/${seasonNumber}`);
        return data;
    },

    /** Official genre list for movies or tv shows. */
    async getGenres(mediaType: MediaType = 'movie'): Promise<{ genres: TMDBGenre[] }> {
        const { data } = await tmdb.get<{ genres: TMDBGenre[] }>(`/genre/${mediaType}/list`);
        return data;
    },

    /** Discover movies or tv shows by genre ID. */
    async discoverByGenre(mediaType: MediaType, genreId: number, page: number = 1): Promise<TMDBResponse<MediaItem>> {
        return this.discover(mediaType, { genreIds: [genreId], page });
    },

    /**
     * General-purpose discovery, including filtering by streaming provider.
     * Provider filters require a watch region.
     */
    async discover(mediaType: MediaType, params: DiscoverParams = {}): Promise<TMDBResponse<MediaItem>> {
        const sortBy = params.sortBy === 'primary_release_date.desc' && mediaType === 'tv'
            ? 'first_air_date.desc'
            : params.sortBy === 'first_air_date.desc' && mediaType === 'movie'
                ? 'primary_release_date.desc'
                : params.sortBy || 'popularity.desc';

        const query: Record<string, string | number | boolean> = {
            page: params.page || 1,
            sort_by: sortBy,
            include_adult: false,
        };

        if (params.genreIds?.length) query.with_genres = params.genreIds.join(',');
        if (params.providerIds?.length) query.with_watch_providers = params.providerIds.join('|');
        if (params.region && (params.providerIds?.length || params.monetization?.length)) {
            query.watch_region = params.region;
        }
        if (params.monetization?.length) query.with_watch_monetization_types = params.monetization.join('|');
        if (params.originalLanguage) query.with_original_language = params.originalLanguage;
        if (mediaType === 'tv' && params.airDateFrom) query['air_date.gte'] = params.airDateFrom;
        if (mediaType === 'tv' && params.airDateTo) query['air_date.lte'] = params.airDateTo;
        if (mediaType === 'tv' && params.firstAirDateFrom) query['first_air_date.gte'] = params.firstAirDateFrom;
        if (params.withoutKeywords?.length) query.without_keywords = params.withoutKeywords.join('|');

        // Rating and newest sorts surface junk without a vote floor.
        const minVotes = params.minVotes ?? (sortBy === 'vote_average.desc' ? 300 : sortBy.includes('date') ? 20 : 0);
        if (minVotes) query['vote_count.gte'] = minVotes;
        if (sortBy.includes('date')) {
            const today = new Date().toISOString().slice(0, 10);
            query[mediaType === 'tv' ? 'first_air_date.lte' : 'primary_release_date.lte'] = today;
        }

        const { data } = await tmdb.get<TMDBResponse<MediaItem>>(`/discover/${mediaType}`, { params: query });
        return withMediaType(data, mediaType);
    },

    /**
     * Popular, well-known movies for a genre, used as cover images.
     * Returns up to 20 results so the UI can pick one at random.
     */
    async getTopMoviesForGenre(genreId: number): Promise<MediaItem[]> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>('/discover/movie', {
            params: {
                with_genres: genreId,
                sort_by: 'popularity.desc',
                'vote_count.gte': 1000,
                page: 1
            }
        });
        return data.results || [];
    },

    /** Details of a specific person, with their combined credits. */
    async getPersonDetails(id: number): Promise<MediaItem> {
        const { data } = await tmdb.get<MediaItem>(`/person/${id}`, {
            params: { append_to_response: 'combined_credits,external_ids' },
        });
        return data;
    },

    /** Combined credits (movies and TV) for a person. */
    async getPersonCredits(id: number): Promise<MediaItem['combined_credits']> {
        const { data } = await tmdb.get<MediaItem['combined_credits']>(`/person/${id}/combined_credits`);
        return data;
    },

    // ---------- Watch providers ----------

    /** Where a title can be streamed, rented or bought, keyed by region code. */
    async getWatchProviders(mediaType: MediaType, id: number): Promise<Record<string, RegionAvailability>> {
        const { data } = await tmdb.get<{ results: Record<string, RegionAvailability> }>(`/${mediaType}/${id}/watch/providers`);
        return data.results || {};
    },

    /** Every provider that carries movies or series in a region, most prominent first. */
    async getProviderCatalog(mediaType: MediaType, region: string): Promise<WatchProvider[]> {
        const { data } = await tmdb.get<{ results: WatchProvider[] }>(`/watch/providers/${mediaType}`, {
            params: { watch_region: region },
        });
        return sortProviders(data.results || [], region);
    },

    /** Movie and series providers for a region, merged and de-duplicated. */
    async getAllProviders(region: string): Promise<WatchProvider[]> {
        const [movie, tv] = await Promise.all([
            this.getProviderCatalog('movie', region),
            this.getProviderCatalog('tv', region),
        ]);
        const byId = new Map<number, WatchProvider>();
        [...movie, ...tv].forEach((provider) => {
            if (!byId.has(provider.provider_id)) byId.set(provider.provider_id, provider);
        });
        return sortProviders(Array.from(byId.values()), region);
    },

    /** Countries that have watch-provider data. */
    async getWatchRegions(): Promise<WatchRegion[]> {
        const { data } = await tmdb.get<{ results: WatchRegion[] }>('/watch/providers/regions');
        return (data.results || []).sort((a, b) => a.english_name.localeCompare(b.english_name));
    },
};
