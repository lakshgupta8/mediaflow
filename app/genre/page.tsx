"use client";

import React from 'react';
import { Film, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useQuery } from '@tanstack/react-query';
import { tmdbService, TMDBGenre } from '@/services/tmdbService';
import Link from 'next/link';
import { generateGradientById } from '@/utils/helpers'; // Assuming we have or will create this

function GenreCard({ genre }: { genre: TMDBGenre }) {
    const { data: bestMovie } = useQuery({
        queryKey: ['bestMovie', genre.id],
        queryFn: () => tmdbService.getBestMovieForGenre(genre.id),
        staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
    });

    const bgImage = bestMovie?.poster_path || bestMovie?.backdrop_path
        ? `https://image.tmdb.org/t/p/w780${bestMovie.poster_path || bestMovie.backdrop_path}`
        : null;

    return (
        <Link
            href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
            className="group block relative bg-surface-dark hover:shadow-[0_10px_40px_-10px_rgba(19,236,91,0.3)] rounded-2xl ring-1 ring-white/10 hover:ring-primary w-full aspect-video overflow-hidden transition-all hover:-translate-y-2 duration-500 cursor-pointer"
        >
            {/* Background Image/Gradient */}
            <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={bgImage ? { backgroundImage: `url('${bgImage}')` } : { background: generateGradientById(genre.id) }}
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-linear-to-t ${bgImage ? 'from-black/95 via-black/60 to-black/10' : 'from-black/90 via-black/40 to-transparent'} opacity-80 group-hover:opacity-95 transition-opacity duration-500`} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="flex justify-between items-center">
                    <h3 className="drop-shadow-md font-bold text-white group-hover:text-primary text-2xl transition-colors">
                        {genre.name}
                    </h3>
                    <div className="flex justify-center items-center bg-white/20 opacity-0 group-hover:opacity-100 backdrop-blur-md rounded-full w-10 h-10 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                        <Film size={20} className="text-white group-hover:text-primary" />
                    </div>
                </div>
                <p className={`opacity-0 group-hover:opacity-100 ${bestMovie ? 'mt-1' : 'mt-2'} font-medium text-primary/80 text-sm transition-opacity duration-500 delay-100`}>
                    Explore {genre.name.toLowerCase()} titles ↗
                </p>
            </div>
        </Link>
    );
}

export default function GenrePage() {
    const { data: genreData, isLoading } = useQuery({
        queryKey: ['genres', 'movie'],
        queryFn: () => tmdbService.getGenres('movie'),
    });

    const genres = genreData?.genres || [];

    const searchQuery = useSelector((state: RootState) => state.search.query).toLowerCase();
    const filteredGenres = genres.filter(genre => {
        if (!searchQuery) return true;
        return genre.name.toLowerCase().includes(searchQuery);
    });

    return (
        <div className="flex flex-col gap-10 mx-auto mt-16 px-6 lg:px-10 py-8 pb-20 w-full max-w-[1400px]">

            {/* Header */}
            <div className="flex flex-col gap-3">
                <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-[-0.033em]">
                    Explore Categories
                </h1>
                <p className="max-w-2xl font-medium text-slate-400 text-lg">
                    Find your next obsession by diving into our curated genres. From heart-pounding <span className="text-primary italic">Action</span> to mind-bending <span className="text-primary italic">Sci-Fi</span>.
                </p>
            </div>

            {/* Categories Grid */}
            {isLoading ? (
                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white/10 rounded-2xl w-full aspect-video" />
                    ))}
                </div>
            ) : filteredGenres.length > 0 ? (
                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredGenres.map((genre) => (
                        <GenreCard key={genre.id} genre={genre} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col flex-1 justify-center items-center opacity-50 py-20 min-h-[40vh]">
                    <Search size={64} className="mb-4 text-slate-500" />
                    <h2 className="font-semibold text-slate-400 text-2xl">No genres found</h2>
                    <p className="mt-2 text-slate-500 text-sm">
                        No matches for &quot;{searchQuery}&quot;.
                    </p>
                </div>
            )}

        </div>
    );
}
