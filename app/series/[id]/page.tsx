"use client";

import React, { useState, Suspense } from 'react';
import { Play, Plus, Share2, Star, ChevronDown, MonitorPlay, Check, Loader2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { useSupabase } from '@/hooks/useSupabase';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
const TMDB_PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

interface TVSeriesExt {
    number_of_seasons?: number;
    created_by?: Array<{ id: number; name: string; profile_path: string | null }>;
    networks?: Array<{ name: string }>;
}

interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

function SeriesDetailsContent() {
    const params = useParams();
    const id = Number(params.id);

    const { data: series, isLoading, error } = useQuery({
        queryKey: ['tv', id],
        queryFn: () => tmdbService.getDetails('tv', id),
        enabled: !!id,
    });

    const { watchlist, addToWatchlist, removeFromWatchlist, recentWatches, addToRecent, removeFromRecent } = useSupabase();

    // Series specific fields 
    const tvExtended = series as typeof series & TVSeriesExt;
    const seasonsCount = tvExtended?.number_of_seasons || 1;

    const [activeSeasonNumber, setActiveSeasonNumber] = useState(1);
    const [showAllEpisodes, setShowAllEpisodes] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch dynamic season data whenever the activeSeasonNumber changes
    const { data: seasonData, isLoading: isSeasonLoading } = useQuery({
        queryKey: ['tv_season', id, activeSeasonNumber],
        queryFn: () => tmdbService.getTvSeason(id, activeSeasonNumber),
        enabled: !!id && !!activeSeasonNumber,
    });

    if (isLoading || !series) {
        return <div className="flex flex-1 justify-center items-center min-h-[60vh] text-slate-400">Loading series details...</div>;
    }

    if (error) {
        return <div className="flex flex-1 justify-center items-center min-h-[60vh] text-red-500">Error loading series details.</div>;
    }

    const title = series.name || series.title || 'Unknown';
    const firstAirDate = series.first_air_date || series.release_date || '';
    const year = firstAirDate ? new Date(firstAirDate).getFullYear() : '';
    const rating = series.vote_average ? series.vote_average.toFixed(1) : 'NR';
    const backdropUrl = series.backdrop_path ? `${TMDB_IMAGE_BASE}${series.backdrop_path}` : '';

    // Extract cast and crew
    const cast: CastMember[] = series.credits?.cast?.slice(0, 5) || [];
    const creators = tvExtended.created_by || [];

    const isWatchlisted = watchlist.some((w: { media_id: number }) => w.media_id === series.id);
    const isWatched = recentWatches.some((r: { media_id: number }) => r.media_id === series.id);

    const toggleWatchlist = () => {
        if (isWatchlisted) {
            removeFromWatchlist({ mediaId: series.id, mediaType: 'tv' });
        } else {
            addToWatchlist({ mediaId: series.id, mediaType: 'tv' });
        }
    };

    const toggleWatched = () => {
        if (isWatched) {
            removeFromRecent({ mediaId: series.id, mediaType: 'tv' });
        } else {
            addToRecent({ mediaId: series.id, mediaType: 'tv', progress: 100 });
        }
    };

    // Safely map TMDB episodes to our UI format
    const episodesArray = (seasonData?.episodes as Record<string, unknown>[]) || [];
    const episodes = episodesArray.length > 0 ? episodesArray.map((ep) => ({
        id: Number(ep.id),
        episode_number: Number(ep.episode_number),
        title: String(ep.name),
        duration: ep.runtime ? `${Number(ep.runtime)}m` : 'N/A',
        rating: ep.vote_average ? Number(ep.vote_average).toFixed(1) : 'NR',
        plot: ep.overview ? String(ep.overview) : "No overview available.",
        image: ep.still_path ? `${TMDB_IMAGE_BASE}${String(ep.still_path)}` : (series.backdrop_path ? `${TMDB_IMAGE_BASE}${series.backdrop_path}` : '')
    })) : [];

    const displayEpisodes = showAllEpisodes ? episodes : episodes.slice(0, 3);

    const handleSeasonSelect = (seasonNum: number) => {
        setActiveSeasonNumber(seasonNum);
        setIsDropdownOpen(false);
        setShowAllEpisodes(false);
    };

    return (
        <div className="flex flex-col pb-12 w-full overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative flex items-end w-full min-h-[500px] aspect-21/9">
                <div className="z-0 absolute inset-0">
                    <div className="z-10 absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/40 to-transparent"></div>
                    <div className="z-10 absolute inset-0 bg-linear-to-r from-background-dark via-transparent to-transparent"></div>
                    <div
                        className="bg-cover bg-center w-full h-full"
                        style={{ backgroundImage: `url('${backdropUrl}')` }}
                    />
                </div>

                <div className="z-20 relative mx-auto px-6 md:px-10 lg:px-20 pb-12 w-full max-w-7xl">
                    <div className="space-y-6 max-w-2xl">
                        <div className="space-y-4">
                            <h1 className="font-bold text-slate-100 text-5xl md:text-7xl uppercase tracking-tighter">
                                {title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 font-medium text-slate-300 text-sm">
                                <span className="bg-primary/20 px-2.5 py-1 border border-primary/30 rounded text-primary">
                                    HD
                                </span>
                                <span>{year}</span>
                                <span className="bg-slate-500 rounded-full w-1.5 h-1.5"></span>
                                <span>{seasonsCount} Seasons</span>
                                <span className="bg-slate-500 rounded-full w-1.5 h-1.5"></span>
                                <span className="flex items-center gap-1.5 text-primary">
                                    <Star fill="currentColor" size={16} /> {rating}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="flex items-center gap-2 bg-primary px-8 py-3.5 rounded-xl font-bold text-background-dark hover:scale-105 transition-transform">
                                <Play fill="currentColor" size={20} />
                                Play S1 E1
                            </button>
                            <button
                                onClick={toggleWatchlist}
                                className={`flex items-center gap-2 backdrop-blur-md px-6 py-3.5 border rounded-xl font-semibold text-base transition-all ${isWatchlisted ? 'bg-primary/20 border-primary text-primary hover:bg-primary/30' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
                            >
                                {isWatchlisted ? <Check size={20} /> : <Plus size={20} />}
                                {isWatchlisted ? 'Added to Watchlist' : 'Add to Watchlist'}
                            </button>
                            <button
                                onClick={toggleWatched}
                                className={`flex items-center gap-2 backdrop-blur-md px-6 py-3.5 border rounded-xl font-semibold text-base transition-all ${isWatched ? 'bg-green-500/20 border-green-500 text-green-400 hover:bg-green-500/30' : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'}`}
                            >
                                {isWatched ? <Check size={20} /> : <Eye size={20} />}
                                {isWatched ? 'Watched It' : 'Mark as Watched'}
                            </button>
                            <button className="flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl w-12 h-12 text-slate-100 transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <div className="gap-12 grid grid-cols-1 lg:grid-cols-12 mx-auto px-6 md:px-10 lg:px-20 py-12 w-full max-w-7xl">

                {/* Main Content (8 cols) */}
                <div className="space-y-12 lg:col-span-8">

                    {/* Synopsis */}
                    <section className="space-y-4">
                        <p className="text-slate-400 text-lg leading-relaxed">
                            {series.overview || "No synopsis available."}
                        </p>
                        <div className="flex gap-3 pt-4">
                            {series.genres?.map(genre => (
                                <span key={genre.id} className="bg-surface-dark px-4 py-1.5 border border-white/5 rounded-lg text-slate-300 text-sm">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Episodes Catalogue Section */}
                    <section className="space-y-6">
                        <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 pb-4 border-surface-dark border-b">
                            <h3 className="flex items-center gap-2 font-bold text-slate-100 text-2xl">
                                <span className="bg-primary rounded-full w-1 h-6"></span> Episodes
                            </h3>

                            {/* Custom Season Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex justify-between items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 border border-white/10 rounded-lg min-w-[160px] font-medium text-slate-200 transition-colors"
                                >
                                    Season {activeSeasonNumber}
                                    <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="right-0 z-50 absolute bg-surface-dark shadow-2xl shadow-black/50 mt-2 border border-white/10 rounded-lg w-full max-h-64 overflow-x-hidden overflow-y-auto"
                                        >
                                            {Array.from({ length: seasonsCount }).map((_, i) => {
                                                const sNum = i + 1;
                                                return (
                                                    <button
                                                        key={`season-${sNum}`}
                                                        onClick={() => handleSeasonSelect(sNum)}
                                                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors ${activeSeasonNumber === sNum ? 'text-primary bg-primary/5' : 'text-slate-300'}`}
                                                    >
                                                        Season {sNum}
                                                        {activeSeasonNumber === sNum && <span className="float-right bg-primary mt-1.5 rounded-full w-1.5 h-1.5"></span>}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Episodes List */}
                        <div className="space-y-4 min-h-[200px]">
                            {isSeasonLoading ? (
                                <div className="flex justify-center items-center py-10 text-slate-400">
                                    <Loader2 className="text-primary animate-spin" size={32} />
                                </div>
                            ) : episodes.length === 0 ? (
                                <div className="flex justify-center items-center py-10 text-slate-400">
                                    No episodes found for this season.
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {displayEpisodes.map((ep: { id: number, episode_number: number, title: string, duration: string, rating: string, plot: string, image: string }, index: number) => (
                                        <motion.div
                                            key={ep.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative flex sm:flex-row flex-col gap-4 sm:gap-6 bg-surface-dark p-4 border border-white/5 hover:border-primary/30 rounded-2xl overflow-hidden transition-all cursor-pointer"
                                        >
                                            {/* Highlight Bar */}
                                            <div className="top-0 bottom-0 left-0 absolute bg-primary opacity-0 group-hover:opacity-100 w-1 transition-opacity" />

                                            {/* Thumbnail */}
                                            <div className="relative rounded-xl w-full sm:w-48 aspect-video overflow-hidden shrink-0">
                                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform" style={{ backgroundImage: `url(${ep.image})` }} />
                                                <div className="absolute inset-0 flex justify-center items-center bg-black/40 group-hover:bg-black/20 transition-colors">
                                                    <div className="flex justify-center items-center bg-white/20 opacity-0 group-hover:opacity-100 backdrop-blur-md rounded-full size-10 text-white group-hover:scale-110 transition-opacity">
                                                        <Play size={20} className="ml-1" fill="currentColor" />
                                                    </div>
                                                </div>
                                                <div className="right-2 bottom-2 absolute bg-black/80 px-2 py-0.5 rounded font-medium text-[11px] text-white">
                                                    {ep.duration}
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex flex-col flex-1 justify-center space-y-2 py-1">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h4 className="font-bold text-slate-100 group-hover:text-primary text-lg transition-colors">
                                                            <span className="mr-2 text-slate-500">{(index + 1).toString().padStart(2, '0')}</span>
                                                            {ep.title}
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-white/5 backdrop-blur px-2 py-1 rounded">
                                                        <Star size={12} className="text-primary" fill="currentColor" />
                                                        <span className="font-bold text-[11px] text-slate-200">{ep.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="pr-4 text-slate-400 text-sm line-clamp-2">{ep.plot}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Load More Button */}
                        {!isSeasonLoading && !showAllEpisodes && episodes.length > 3 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center pt-2"
                            >
                                <button
                                    onClick={() => setShowAllEpisodes(true)}
                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 border border-white/10 rounded-xl font-medium text-slate-300 text-sm transition-all"
                                >
                                    <MonitorPlay size={16} />
                                    Load All {episodes.length} Episodes
                                </button>
                            </motion.div>
                        )}
                    </section>
                </div>

                {/* Sidebar (4 cols) */}
                <aside className="space-y-10 lg:col-span-4">

                    {/* Cast & Crew */}
                    {cast.length > 0 && (
                        <section className="space-y-6 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                            <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-slate-100 text-xl">
                                <span className="bg-primary rounded-full w-1 h-5"></span> Series Cast
                            </h3>
                            <div className="space-y-5 pt-2">
                                {cast.map((person) => (
                                    <div key={person.id} className="group flex items-center gap-4 cursor-pointer">
                                        <div className="rounded-full ring-2 ring-transparent group-hover:ring-primary w-12 h-12 overflow-hidden transition-colors">
                                            <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: `url('${person.profile_path ? TMDB_PROFILE_BASE + person.profile_path : ''}')` }} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-100 group-hover:text-primary text-sm transition-colors">{person.name}</p>
                                            <p className="mt-0.5 text-slate-500 text-xs">{person.character}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Creators */}
                                {creators.length > 0 && (
                                    <div className="mt-2 pt-5 border-white/10 border-t">
                                        <p className="mb-3 pl-1 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Creators</p>
                                        {creators.map((creator) => (
                                            <div key={creator.id} className="group flex items-center gap-4 mb-3 cursor-pointer">
                                                <div className="rounded-full ring-2 ring-transparent group-hover:ring-primary w-12 h-12 overflow-hidden transition-colors">
                                                    <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: `url('${creator.profile_path ? TMDB_PROFILE_BASE + creator.profile_path : ''}')` }} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-100 group-hover:text-primary text-sm transition-colors">{creator.name}</p>
                                                    <p className="mt-0.5 text-slate-500 text-xs">Creator</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Details Box */}
                    <section className="space-y-5 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                        <h4 className="pb-4 border-white/5 border-b font-bold text-slate-100 text-lg">Series Info</h4>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Status</span>
                                <span className="font-semibold text-primary text-sm">{series.status || 'Returning Series'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Network</span>
                                <span className="font-semibold text-slate-200 text-sm">{tvExtended.networks?.[0]?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">First Aired</span>
                                <span className="font-semibold text-slate-200 text-sm">{firstAirDate}</span>
                            </div>
                        </div>
                    </section>

                </aside>

            </div>
        </div>
    );
}

export default function SeriesDetailsPage() {
    return (
        <Suspense fallback={<div className="flex flex-1 justify-center items-center min-h-[60vh] text-slate-400">Loading series details...</div>}>
            <SeriesDetailsContent />
        </Suspense>
    );
}
