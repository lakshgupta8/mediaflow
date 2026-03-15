import { tmdb } from '@/lib/tmdb';

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

export interface MediaItem {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    media_type?: string;
    overview: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
    // Detail-specific fields:
    runtime?: number;
    genres?: TMDBGenre[];
    status?: string;
    budget?: number;
    revenue?: number;
    credits?: {
        cast: { id: number; name: string; character: string; profile_path: string | null }[];
        crew: { id: number; name: string; job: string; profile_path: string | null }[];
    };
}

export const tmdbService = {
    /**
     * Fetch trending movies or tv shows.
     * @param mediaType 'movie', 'tv', or 'all'
     * @param timeWindow 'day' or 'week'
     */
    async getTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>(`/trending/${mediaType}/${timeWindow}`);
        return data;
    },

    /**
     * Fetch top rated movies or tv shows.
     * @param mediaType 'movie' or 'tv'
     */
    async getTopRated(mediaType: 'movie' | 'tv' = 'movie', page: number = 1): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>(`/${mediaType}/top_rated`, {
            params: { page },
        });
        return data;
    },

    /**
     * Search across all movies, tv shows, and people.
     */
    async searchMulti(query: string, page: number = 1): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>('/search/multi', {
            params: { query, page },
        });
        return data;
    },

    /**
     * Get basic details of a specific movie or tv show.
     */
    async getDetails(mediaType: 'movie' | 'tv', id: number): Promise<MediaItem> {
        const { data } = await tmdb.get<MediaItem>(`/${mediaType}/${id}`, {
            params: { append_to_response: 'credits' },
        });
        return data;
    },

    /**
     * Get details for a specific TV season, including all episodes
     */
    async getTvSeason(seriesId: number, seasonNumber: number): Promise<Record<string, unknown>> {
        const { data } = await tmdb.get(`/tv/${seriesId}/season/${seasonNumber}`);
        return data;
    },

    /**
     * Get official genre list for movies or tv shows.
     */
    async getGenres(mediaType: 'movie' | 'tv' = 'movie'): Promise<{ genres: TMDBGenre[] }> {
        const { data } = await tmdb.get<{ genres: TMDBGenre[] }>(`/genre/${mediaType}/list`);
        return data;
    },

    /**
     * Discover movies or tv shows by genre ID.
     */
    async discoverByGenre(mediaType: 'movie' | 'tv', genreId: number, page: number = 1): Promise<TMDBResponse<MediaItem>> {
        const { data } = await tmdb.get<TMDBResponse<MediaItem>>(`/discover/${mediaType}`, {
            params: {
                with_genres: genreId,
                page,
                sort_by: 'popularity.desc'
            }
        });
        return data;
    },

    /**
     * Get popular, highly-rated movies for a specific genre, to be used as cover images.
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
    }
};
