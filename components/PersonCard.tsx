"use client";

import { User } from 'lucide-react';
import type { MediaItem } from '@/services/tmdbService';
import Link from 'next/link';
import Image from 'next/image';

interface PersonCardProps {
    item: MediaItem;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export function PersonCard({ item }: PersonCardProps) {
    const name = item.name || 'Unknown';
    const image = item.profile_path ? `${TMDB_IMAGE_BASE}${item.profile_path}` : '';
    const department = item.known_for_department;

    return (
        <Link href={`/people/${item.id}`} className="group flex flex-col gap-3 w-full cursor-pointer animate-fade-in">
            <div
                className="relative bg-surface-dark shadow-lg group-hover:shadow-[0_0_20px_rgba(19,236,91,0.2)] border border-white/10 group-hover:border-primary rounded-xl aspect-2/3 overflow-hidden transition-all duration-300 transform"
            >
                {image ? (
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="group-hover:scale-110 object-cover transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    />
                ) : (
                    <div className="flex justify-center items-center w-full h-full">
                        <User className="text-slate-600 group-hover:text-primary transition-colors" size={48} />
                    </div>
                )}
                
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                
                <div className="right-3 bottom-3 left-3 absolute text-white">
                    <p className="font-bold text-sm truncate">{name}</p>
                    {department && <p className="text-primary text-[10px] uppercase tracking-wider">{department}</p>}
                </div>
            </div>
        </Link>
    );
}
