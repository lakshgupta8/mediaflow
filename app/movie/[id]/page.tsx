"use client";

import React, { Suspense } from 'react';
import { Play, Plus, Share2, Star, MessageSquare, Edit3, Check, Eye } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { useSupabase } from '@/hooks/useSupabase';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
const TMDB_PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

function MovieDetailsContent() {
    const params = useParams();
    const id = Number(params.id);

    const { data: movie, isLoading, error } = useQuery({
        queryKey: ['movie', id],
        queryFn: () => tmdbService.getDetails('movie', id),
        enabled: !!id,
    });

    const { watchlist, addToWatchlist, removeFromWatchlist, recentWatches, addToRecent, removeFromRecent } = useSupabase();

    if (isLoading || !movie) {
        return <div className="flex flex-1 justify-center items-center min-h-[60vh] text-slate-400">Loading movie details...</div>;
    }

    if (error) {
        return <div className="flex flex-1 justify-center items-center min-h-[60vh] text-red-500">Error loading movie details.</div>;
    }

    const title = movie.title || movie.name || 'Unknown';
    const releaseDate = movie.release_date || movie.first_air_date || '';
    const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
    const duration = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
    const backdropUrl = movie.backdrop_path ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}` : '';

    // Extract cast and crew from credits if available (TMDB API returns this in getDetails usually if append_to_response includes credits, else we mock or leave empty for now assuming service fetches it)
    // For this demonstration, if the service doesn't append credits, we'll try to use them if they exist on the object, or fallback.
    const cast = movie.credits?.cast?.slice(0, 5) || [];
    const crew = movie.credits?.crew || [];
    const director = crew.find((c) => c.job === 'Director');

    const isWatchlisted = watchlist.some((w: { media_id: number }) => w.media_id === movie.id);
    const isWatched = recentWatches.some((r: { media_id: number }) => r.media_id === movie.id);

    // Find the first YouTube trailer, or fallback to any YouTube video attached
    const trailerVideo = movie.videos?.results?.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer') || 
                         movie.videos?.results?.find(vid => vid.site === 'YouTube');
    const trailerUrl = trailerVideo ? `https://www.youtube.com/watch?v=${trailerVideo.key}` : null;

    const toggleWatchlist = () => {
        if (isWatchlisted) {
            removeFromWatchlist({ mediaId: movie.id, mediaType: 'movie' });
        } else {
            addToWatchlist({ mediaId: movie.id, mediaType: 'movie' });
        }
    };

    const toggleWatched = () => {
        if (isWatched) {
            removeFromRecent({ mediaId: movie.id, mediaType: 'movie' });
        } else {
            addToRecent({ mediaId: movie.id, mediaType: 'movie', progress: 100 });
        }
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
                                <span>{duration}</span>
                                <span className="bg-slate-500 rounded-full w-1.5 h-1.5"></span>
                                <span className="flex items-center gap-1.5 text-primary">
                                    <Star fill="currentColor" size={16} /> {rating}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            {trailerUrl && (
                                <a
                                    href={trailerUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-primary px-8 py-3.5 rounded-xl font-bold text-background-dark hover:scale-105 transition-transform"
                                >
                                    <Play fill="currentColor" size={20} />
                                    Play Trailer
                                </a>
                            )}
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
            <div className="gap-12 grid grid-cols-1 lg:grid-cols-12 mx-auto px-6 md:px-10 lg:px-20 py-12 max-w-7xl">

                {/* Main Content (8 cols) */}
                <div className="space-y-12 lg:col-span-8">

                    {/* Synopsis */}
                    <section className="space-y-4">
                        <h3 className="flex items-center gap-2 mb-6 font-bold text-slate-100 text-2xl">
                            <span className="bg-primary rounded-full w-1 h-6"></span> Synopsis
                        </h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            {movie.overview || "No synopsis available."}
                        </p>
                        <div className="flex gap-3 pt-4">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="bg-surface-dark px-4 py-1.5 border border-white/5 rounded-lg text-slate-300 text-sm">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* User Reviews */}
                    <section className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-surface-dark border-b">
                            <h3 className="flex items-center gap-2 font-bold text-slate-100 text-2xl">
                                <span className="bg-primary rounded-full w-1 h-6"></span> User Reviews
                            </h3>
                            <button className="flex items-center gap-2 hover:bg-primary/10 px-4 py-2 rounded-lg font-semibold text-primary text-sm transition-colors">
                                <Edit3 size={16} /> Write Review
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Keep the static reviews structure as placeholders for now */}
                            <div className="flex flex-col flex-1 justify-center items-center opacity-50 py-10">
                                <MessageSquare size={48} className="mb-4 text-slate-500" />
                                <h2 className="font-semibold text-slate-400 text-xl">No reviews yet</h2>
                                <p className="mt-2 text-slate-500 text-sm">Be the first to review this movie</p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Sidebar (4 cols) */}
                <aside className="space-y-10 lg:col-span-4">

                    {/* Cast & Crew */}
                    {cast.length > 0 && (
                        <section className="space-y-6 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                            <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-slate-100 text-xl">
                                <span className="bg-primary rounded-full w-1 h-5"></span> Cast &amp; Crew
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

                                {/* Director */}
                                {director && (
                                    <div className="mt-2 pt-5 border-white/10 border-t">
                                        <p className="mb-3 pl-1 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Director</p>
                                        <div className="group flex items-center gap-4 cursor-pointer">
                                            <div className="rounded-full ring-2 ring-transparent group-hover:ring-primary w-12 h-12 overflow-hidden transition-colors">
                                                <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: `url('${director.profile_path ? TMDB_PROFILE_BASE + director.profile_path : ''}')` }} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-100 group-hover:text-primary text-sm transition-colors">{director.name}</p>
                                                <p className="mt-0.5 text-slate-500 text-xs">{director.job}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Details Box */}
                    <section className="space-y-5 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                        <h4 className="pb-4 border-white/5 border-b font-bold text-slate-100 text-lg">Movie Details</h4>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Status</span>
                                <span className="font-semibold text-slate-200 text-sm">{movie.status || 'Released'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Release Date</span>
                                <span className="font-semibold text-slate-200 text-sm">{releaseDate}</span>
                            </div>
                            {movie.budget && (
                                <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                    <span className="font-medium text-slate-400 text-sm">Budget</span>
                                    <span className="font-semibold text-slate-200 text-sm">${movie.budget.toLocaleString()}</span>
                                </div>
                            )}
                            {movie.revenue && (
                                <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                    <span className="font-medium text-slate-400 text-sm">Revenue</span>
                                    <span className="font-semibold text-primary text-sm">${movie.revenue.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </section>

                </aside>

            </div>
        </div>
    );
}

export default function MovieDetailsPage() {
    return (
        <Suspense fallback={<div className="flex flex-1 justify-center items-center min-h-[60vh] text-slate-400">Loading movie details...</div>}>
            <MovieDetailsContent />
        </Suspense>
    );
}
