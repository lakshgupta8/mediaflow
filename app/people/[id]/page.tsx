"use client";

import React, { Suspense, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { MovieCard } from '@/components/MovieCard';
import { User, Calendar, MapPin, Award, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/h632';

function PersonDetailsContent() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const { data: person, isLoading, error } = useQuery({
        queryKey: ['person', id],
        queryFn: () => tmdbService.getPersonDetails(id),
        enabled: !!id,
    });

    const knownFor = useMemo(() => {
        const cast = person?.combined_credits?.cast || [];
        const crew = person?.combined_credits?.crew || [];
        const allCredits = [...cast, ...crew];

        // Use a Map to deduplicate by media_type and id
        const uniqueCredits = new Map<string, typeof allCredits[0]>();
        
        allCredits.forEach(item => {
            const key = `${item.media_type}-${item.id}`;
            // If we have a duplicate, we might want to prefer cast over crew or vice versa, 
            // but usually just keeping the first one encountered is fine if they are sorted by popularity.
            if (!uniqueCredits.has(key)) {
                uniqueCredits.set(key, item);
            }
        });

        return Array.from(uniqueCredits.values())
            .filter(item => item.poster_path)
            .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
            .slice(0, 12);
    }, [person]);

    if (isLoading || !person) {
        return (
            <div className="flex flex-1 justify-center items-center min-h-[60vh] text-slate-400">
                <div className="flex flex-col items-center gap-4">
                    <div className="border-primary border-t-2 border-r-2 rounded-full w-12 h-12 animate-spin" />
                    <p>Loading person details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 justify-center items-center min-h-[60vh] text-red-500">
                Error loading person details.
            </div>
        );
    }

    const profileUrl = person.profile_path ? `${TMDB_IMAGE_BASE}${person.profile_path}` : null;

    return (
        <div className="flex flex-col pb-12 w-full overflow-x-hidden">
            {/* Header / Back Navigation */}
            <div className="top-24 left-6 md:left-10 lg:left-20 z-50 absolute">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2 border border-white/10 rounded-xl text-white text-sm transition-all"
                >
                    <ChevronLeft size={18} /> Back
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative flex items-center bg-linear-to-b from-primary/10 to-transparent pt-32 pb-12 min-h-[400px]">
                <div className="z-10 absolute inset-0 bg-background-dark/20 backdrop-blur-3xl" />
                
                <div className="z-20 relative mx-auto px-6 md:px-10 lg:px-20 w-full max-w-7xl">
                    <div className="flex md:flex-row flex-col items-center md:items-end gap-10">
                        {/* Profile Image */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative group shadow-2xl border-4 border-white/10 rounded-2xl w-64 aspect-2/3 overflow-hidden shrink-0"
                        >
                            {profileUrl ? (
                                <Image
                                    src={profileUrl}
                                    alt={person.name || 'Person'}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex justify-center items-center bg-surface-dark w-full h-full">
                                    <User size={80} className="text-slate-600" />
                                </div>
                            )}
                        </motion.div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h1 className="font-bold text-slate-100 text-4xl md:text-6xl uppercase tracking-tighter">
                                    {person.name}
                                </h1>
                                <p className="mt-2 font-medium text-primary text-lg md:text-xl uppercase tracking-widest">
                                    {person.known_for_department}
                                </p>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap justify-center md:justify-start items-center gap-6 pt-4 text-slate-400"
                            >
                                {person.birthday && (
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-primary" />
                                        <span>Born {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                )}
                                {person.place_of_birth && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-primary" />
                                        <span>{person.place_of_birth}</span>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <div className="gap-12 grid grid-cols-1 lg:grid-cols-12 mx-auto px-6 md:px-10 lg:px-20 py-12 max-w-7xl">
                
                {/* Main Column */}
                <div className="space-y-12 lg:col-span-8">
                    
                    {/* Biography */}
                    <section className="space-y-6">
                        <h3 className="flex items-center gap-2 font-bold text-slate-100 text-2xl">
                            <span className="bg-primary rounded-full w-1 h-6"></span> Biography
                        </h3>
                        <div className="text-slate-400 text-lg leading-relaxed whitespace-pre-line">
                            {person.biography || `We don't have a biography for ${person.name}.`}
                        </div>
                    </section>

                    {/* Known For Grid */}
                    {knownFor.length > 0 && (
                        <section className="space-y-8">
                            <h3 className="flex items-center gap-3 font-bold text-slate-100 text-2xl">
                                <Award className="text-primary" size={24} /> Known For
                            </h3>
                            <div className="gap-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                                {knownFor.map((item) => (
                                    <MovieCard key={`${item.media_type}-${item.id}`} item={item} fillWidth />
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="space-y-10 lg:col-span-4">
                    <section className="space-y-5 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                        <h4 className="pb-4 border-white/5 border-b font-bold text-slate-100 text-lg">Personal Info</h4>
                        <div className="space-y-4 pt-2">
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 text-sm">Gender</span>
                                <span className="font-semibold text-slate-200">
                                    {person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : person.gender === 3 ? 'Non-binary' : 'Not specified'}
                                </span>
                            </div>
                            {person.birthday && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-500 text-sm">Birthday</span>
                                    <span className="font-semibold text-slate-200">{person.birthday}</span>
                                </div>
                            )}
                            {person.deathday && (
                                <div className="flex flex-col gap-1 text-red-400">
                                    <span className="text-slate-400 text-sm">Day of Death</span>
                                    <span className="font-semibold">{person.deathday}</span>
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-500 text-sm">Known Credits</span>
                                <span className="font-semibold text-slate-200">{person.combined_credits?.cast?.length || 0}</span>
                            </div>
                        </div>
                    </section>
                </aside>

            </div>
        </div>
    );
}

export default function PersonPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-1 justify-center items-center min-h-[60vh] text-slate-400">
                Loading person details...
            </div>
        }>
            <PersonDetailsContent />
        </Suspense>
    );
}
