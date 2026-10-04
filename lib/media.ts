import type { MediaItem, MediaType } from '@/services/tmdbService';

/** TMDB image sizes we actually use. */
export type TmdbSize = 'w92' | 'w154' | 'w185' | 'w300' | 'w342' | 'w500' | 'w780' | 'w1280' | 'h632' | 'original';

export const tmdbImage = (path: string | null | undefined, size: TmdbSize = 'w500') =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const mediaTitle = (item: Pick<MediaItem, 'title' | 'name'>) => item.title || item.name || 'Untitled';

export const mediaYear = (item: Pick<MediaItem, 'release_date' | 'first_air_date'>) => {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear() : null;
};

/** Movies and series share list endpoints; fall back to field shape when media_type is missing. */
export const mediaTypeOf = (item: Pick<MediaItem, 'media_type' | 'first_air_date' | 'name' | 'title'>): MediaType => {
    if (item.media_type === 'tv' || item.media_type === 'movie') return item.media_type;
    return item.first_air_date || (item.name && !item.title) ? 'tv' : 'movie';
};

export const mediaHref = (item: Pick<MediaItem, 'id' | 'media_type' | 'first_air_date' | 'name' | 'title'>) =>
    `/${mediaTypeOf(item) === 'tv' ? 'series' : 'movie'}/${item.id}`;

export const formatRuntime = (minutes?: number | null) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
};

export const formatRating = (vote?: number) => (vote ? vote.toFixed(1) : null);

export const findTrailer = (item: Pick<MediaItem, 'videos'>) => {
    const videos = item.videos?.results || [];
    return (
        videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser') ||
        videos.find((v) => v.site === 'YouTube') ||
        null
    );
};

export const regionName = (code: string) => {
    try {
        return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code;
    } catch {
        return code;
    }
};
