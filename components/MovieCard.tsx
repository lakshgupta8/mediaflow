"use client";

import { Play, Plus, Heart } from 'lucide-react';
import type { MediaItem } from '@/services/tmdbService';
import { useSupabase } from '@/hooks/useSupabase';
import Link from 'next/link';

interface MovieCardProps {
    item: MediaItem;
    isRec?: boolean;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export function MovieCard({ item, isRec }: MovieCardProps) {
    const title = item.title || item.name || 'Unknown';
    const releaseDate = item.release_date || item.first_air_date || '';
    const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
    const image = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : (item.backdrop_path ? `${TMDB_IMAGE_BASE}${item.backdrop_path}` : '');
    const quality = item.vote_average ? item.vote_average.toFixed(1) : undefined;
    const description = item.overview;
    const { watchlist, addToWatchlist, removeFromWatchlist, favorites, addToFavorites, removeFromFavorites } = useSupabase();

    const isWatchlisted = watchlist.some((w: { media_id: number }) => w.media_id === item.id);
    const isFavorited = favorites.some((f: { media_id: number }) => f.media_id === item.id);

    const toggleWatchlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if wrapped in a link later
        if (isWatchlisted) {
            removeFromWatchlist({ mediaId: item.id, mediaType: item.media_type as 'movie' | 'tv' });
        } else {
            addToWatchlist({ mediaId: item.id, mediaType: item.media_type as 'movie' | 'tv' });
        }
    };

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isFavorited) {
            removeFromFavorites({ mediaId: item.id, mediaType: item.media_type as 'movie' | 'tv' });
        } else {
            addToFavorites({ mediaId: item.id, mediaType: item.media_type as 'movie' | 'tv' });
        }
    };

    const href = `/${item.media_type === 'tv' ? 'series' : 'movie'}/${item.id}`;

    if (isRec) {
        return (
            <Link href={href} className="group flex flex-col gap-3 w-[320px] min-w-[320px] snap-start cursor-pointer">
                <div
                    className="relative bg-cover bg-center shadow-lg border border-white/10 group-hover:border-primary rounded-xl aspect-video overflow-hidden transition-all duration-300"
                    style={{ backgroundImage: `url('${image}')` }}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent"></div>

                    {/* Action Buttons */}
                    <div className="top-3 right-3 absolute flex gap-2">
                        <button
                            onClick={toggleFavorite}
                            className={`flex justify-center items-center bg-black/60 backdrop-blur-md rounded-full w-8 h-8 transition-colors ${isFavorited ? 'text-red-500' : 'text-white hover:text-red-500'}`}
                            title="Favorite"
                        >
                            <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            onClick={toggleWatchlist}
                            className={`flex justify-center items-center bg-black/60 backdrop-blur-md rounded-full w-8 h-8 transition-colors ${isWatchlisted ? 'text-primary' : 'text-white hover:text-primary'}`}
                            title="Watchlist"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="right-4 bottom-4 left-4 absolute">
                        <h3 className="font-bold text-white text-lg truncate">{title}</h3>
                        <p className="text-slate-400 text-sm line-clamp-1">{description}</p>
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-opacity pointer-events-none">
                        <button className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-bold text-background-dark text-sm transition-transform translate-y-4 group-hover:translate-y-0 duration-300 pointer-events-auto transform">
                            <Play size={18} fill="currentColor" /> Play
                        </button>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={href} className="group flex flex-col gap-3 w-[200px] min-w-[200px] snap-start cursor-pointer">
            <div
                className="relative bg-cover bg-center shadow-lg group-hover:shadow-[0_0_20px_rgba(19,236,91,0.2)] border border-white/10 group-hover:border-primary rounded-xl aspect-2/3 overflow-hidden transition-all duration-300 transform"
                style={{ backgroundImage: `url('${image}')` }}
            >
                <div className="absolute inset-0 flex justify-center items-center bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity">
                    <button className="flex justify-center items-center bg-primary rounded-full w-12 h-12 text-background-dark scale-0 group-hover:scale-100 transition-transform duration-300 transform">
                        <Play fill="currentColor" />
                    </button>
                </div>
                {quality && (
                    <div className="top-2 right-2 absolute bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded font-bold text-primary text-xs">
                        {quality}
                    </div>
                )}
            </div>
            <div>
                <h3 className="font-semibold text-white group-hover:text-primary truncate transition-colors">
                    {title}
                </h3>
                <div className="flex justify-between mt-1 text-slate-400 text-xs">
                    <span>{item.media_type === 'tv' ? 'TV Show' : 'Movie'}</span>
                    <span>{year}</span>
                </div>
            </div>
        </Link>
    );
}
