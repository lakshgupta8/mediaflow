"use client";

import { Play, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import type { MediaItem } from "@/services/tmdbService";
import { useSupabase } from "@/hooks/useSupabase";
import Link from "next/link";

interface HeroSectionProps {
    heroItem?: MediaItem;
    isLoading?: boolean;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

export function HeroSection({ heroItem, isLoading }: HeroSectionProps) {
    const { watchlist, addToWatchlist, removeFromWatchlist } = useSupabase();

    if (isLoading || !heroItem) {
        return (
            <div className="relative bg-white/5 w-full h-[70vh] min-h-[600px] animate-pulse" />
        );
    }

    const title = heroItem.title || heroItem.name || 'Unknown';
    const backdropUrl = heroItem.backdrop_path ? `${TMDB_IMAGE_BASE}${heroItem.backdrop_path}` : '';
    const rating = heroItem.vote_average ? heroItem.vote_average.toFixed(1) : 'NR';

    const derivedMediaType = heroItem.media_type || (heroItem.first_air_date ? 'tv' : 'movie');
    const href = `/${derivedMediaType === 'tv' ? 'series' : 'movie'}/${heroItem.id}`;

    const isWatchlisted = watchlist.some((w: { media_id: number }) => w.media_id === heroItem.id);

    const toggleWatchlist = () => {
        if (isWatchlisted) {
            removeFromWatchlist({ mediaId: heroItem.id, mediaType: derivedMediaType as 'movie' | 'tv' });
        } else {
            addToWatchlist({ mediaId: heroItem.id, mediaType: derivedMediaType as 'movie' | 'tv' });
        }
    };

    return (
        <div className="relative w-full h-[70vh] min-h-[600px]">
            <div className="top-8 left-1/2 z-40 absolute flex items-center gap-2 -translate-x-1/2 pointer-events-none">
                <h1 className="font-bold text-white text-3xl tracking-wide pointer-events-auto">
                    Media<span className="text-primary">Flow</span>
                </h1>
            </div>
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('${backdropUrl}')`,
                }}
            ></div>
            <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/60 to-transparent"></div>
            <div className="absolute inset-0 bg-linear-to-r from-background-dark via-background-dark/40 to-transparent"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative flex flex-col justify-end gap-6 p-10 pb-16 max-w-4xl h-full"
            >
                <div className="flex items-center gap-3">
                    <span className="bg-primary px-2 py-1 rounded font-bold text-background-dark text-xs uppercase tracking-wider">
                        Trending
                    </span>
                    {derivedMediaType === 'tv' && (
                        <span className="bg-black/40 backdrop-blur-sm px-2 py-1 border border-white/20 rounded font-bold text-slate-300 text-xs uppercase tracking-wider">
                            TV Series
                        </span>
                    )}
                    <span className="flex items-center gap-1 font-bold text-primary text-sm">
                        <svg
                            className="fill-current w-4 h-4"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        {rating}
                    </span>
                </div>
                <h1 className="drop-shadow-2xl font-bold text-white text-5xl md:text-7xl leading-[1.1] tracking-tight">
                    {title}
                </h1>
                <p className="drop-shadow-md max-w-2xl text-slate-300 text-lg line-clamp-3 leading-relaxed">
                    {heroItem.overview}
                </p>

                <div className="flex items-center gap-4 pt-2">
                    <Link href={href} className="flex items-center gap-2 bg-primary hover:bg-green-400 shadow-[0_0_20px_rgba(19,236,91,0.4)] px-8 py-3.5 rounded-xl font-bold text-background-dark text-base hover:scale-105 transition-all transform">
                        <Play fill="currentColor" size={20} /> Watch Now
                    </Link>
                    <button
                        onClick={toggleWatchlist}
                        className={`flex items-center gap-2 backdrop-blur-md px-6 py-3.5 border rounded-xl font-semibold text-base transition-all ${isWatchlisted ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
                    >
                        {isWatchlisted ? <Check size={20} /> : <Plus size={20} />}
                        {isWatchlisted ? 'Added to Watchlist' : 'Add to Watchlist'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
