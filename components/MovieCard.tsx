"use client";

import { Star, Play, Plus, Clock } from 'lucide-react';

interface MovieCardProps {
    title: string;
    genre: string;
    year: string;
    image: string;
    quality?: string;
    isRec?: boolean;
    description?: string;
}

export function MovieCard({ title, genre, year, image, quality, isRec, description }: MovieCardProps) {
    if (isRec) {
        return (
            <div className="group flex flex-col gap-3 w-[320px] min-w-[320px] snap-start cursor-pointer">
                <div
                    className="relative bg-cover bg-center shadow-lg rounded-xl ring-1 ring-white/10 group-hover:ring-primary aspect-video overflow-hidden transition-all duration-300"
                    style={{ backgroundImage: `url('${image}')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    <div className="right-4 bottom-4 left-4 absolute">
                        <h3 className="font-bold text-white text-lg truncate">{title}</h3>
                        <p className="text-slate-400 text-sm line-clamp-1">{description}</p>
                    </div>
                    <div className="absolute inset-0 flex justify-center items-center bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] transition-opacity">
                        <button className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg font-bold text-background-dark text-sm transition-transform translate-y-4 group-hover:translate-y-0 duration-300 transform">
                            <Play size={18} fill="currentColor" /> Play
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex flex-col gap-3 w-[200px] min-w-[200px] snap-start cursor-pointer">
            <div
                className="relative bg-cover bg-center shadow-lg group-hover:shadow-[0_0_20px_rgba(19,236,91,0.2)] rounded-xl ring-1 ring-white/10 group-hover:ring-primary aspect-[2/3] overflow-hidden transition-all duration-300"
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
                    <span>{genre}</span>
                    <span>{year}</span>
                </div>
            </div>
        </div>
    );
}
