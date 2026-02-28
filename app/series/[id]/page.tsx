"use client";

import React, { useState } from 'react';
import { Play, Plus, Share2, Star, ChevronDown, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SeriesDetailsPage() {
    const series = {
        title: "Arcane",
        year: "2021",
        seasonsCount: 2,
        rating: "9.0",
        quality: "4K ULTRA HD",
        backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnE28h4wU_S2L7XqZ8zY558T1s-6s7m712b8z0d00V9_uJ5kH8-wNQsEa9gR90lWJ6Wv0hE8M1Y_z4ZzC9W-7z8uWvw58HvwZ1J9kR0l7M_m69r_uT9qH8v_l9mZ4tZ7E2hW8Z3v_qZw3zW9Z5l1yWvwZ4tZ7wZ5l1yWvwZ4tZ7", // Placeholder, you might want a real arcane backdrop
        synopsis: "Set in utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions-and the power that will tear them apart.",
        genres: ["Animation", "Action", "Adventure", "Sci-Fi"]
    };

    // Keep the high-quality backdrop from Interstellar for visual testing, or replace
    const backdropImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuCJTo66q1_p_HKc-RfCbK3kkdpsZjJ5cYHik4gQmxN-7ARihIuTH2IxYqw1BAfQwqUOOqUiPUuA8onJMo-G9Vo6SofEwz52Oq37OcfP3GvzVytQ_84HkHXOQKf_Tljq4OaroApsP_OzHuebg2TWRm6BgBKK9-Dr9kFgaSNFcO5PsOEY9awz8zPvUXPlR4kTUc3avGaBJ-f8FO10_tJUUfCAVo4KZPcU5pCZ72oUUmbKU1gaWN5pbNT6xSu3XnhnP2OzMIsBOxx31Q";


    const cast = [
        {
            name: "Hailee Steinfeld",
            role: "Vi (voice)",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdt7zwPtibX-lY7i2N9AthrAyOEYJi6xyl_kuqvK4W2o6DBLGzehxYenjwcojTBBdURyKssaEvmyEy8YnK15h2-2KwOt4_P2L94j6Vkx2QYUHWq3NYSH0vthX1XUmFRYT1qPiTsxhU29drhnUOdNOC3BOdpmv15k3Yon6Ja-GOvxY4jz0LpSPz0KNnzau1y5rfMVJ9Zp9sibLNckL63ZSmHshTKa5-5LnvwjnlwHmNhY1HdsPFR3FKMzsolkFYVtMnPsnUXlimzA" // Placeholder
        },
        {
            name: "Ella Purnell",
            role: "Jinx (voice)",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoc_AFBhqCj7FtLi1AscNEkA0n8X-RXrk-eONvUbbGkD8_c91sQOelvNtX8WNHOMO9BFzYVByKdA9ntEdr9GepbXh16e_H2XQkOD6LMytAS2qW76Jk7SdRbUMmTF-nV7r4asyDFxoIfVj5iJZXsehfmF9-9cEU_oer-4SFa8U1TSrozpAgyCSsTCUJR3P2_-6SBTkSyTVIIb5ro_m6GSa_tArN7fuV1D_gRSoFGxBNWRdJqyB7hpMIm2aeRRnnJzrYR6pVDTgVuA" // Placeholder
        },
        {
            name: "Kevin Alejandro",
            role: "Jayce (voice)",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxgmnqnz0Yzxq0aRH_chaSnXyIoTTm096KyUeK5T6sL0j4eXNwgN4xa9NZbCF8KJ2y4FgXnUbJBx52oYgeoq4voGPKsQsvd2RTnqQkBiTqeWNJDQJrF1tTJL2xSU1SpCIs7SfVLq7qwBjCPqVJVI3enXULvSEJc2caQIfbonD2mR0Vp8yQPAxW1u0p_sHolcL28tzG8lMKWqjlJSNk_WuLWG9DhQTUpsObxl7o-VaYcuVLqfKHqcvIWhyzkoJkDAbjwOfWyCDUZA" // Placeholder
        }
    ];

    const creators = {
        name: "Christian Linke, Alex Yee",
        role: "Creators",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcOuoyMHBi-m5xxbB9Y8QCjIkpj2Sk8s180dRJWQ3gZ5T2ryUmfljidMoCn4kW6dIoeNzTlF27cuM-qkqvs43ppvj3X_FJuAn6KmQSlV9eLhsdKvovfibjy_l7YtBkHZvwYZho1sm42lbiQP7a0iIJuImUOwFtDFh8JFoDViIaVkrNIfrAKCM52MkKO2Yv3boKfZlmA09c18yY-r4k1jODvnigd51vmJPrgCANk-dx_--MzDW0Z0-haaVfpwfPbnxHb-_PTvh2PQ" // Placeholder
    };

    // Series Data Example
    const seasons = [
        {
            id: 1,
            title: "Season 1",
            episodes: [
                { id: 101, title: "Welcome to the Playground", duration: "43m", rating: "8.8", plot: "Orphaned sisters Vi and Powder bring trouble to Zaun's underground streets following a heist in posh Piltover.", image: backdropImg },
                { id: 102, title: "Some Mysteries Are Better Left Unsolved", duration: "40m", rating: "8.4", plot: "Idealistic inventor Jayce attempts to harness magic through science-despite his mentor's warnings.", image: backdropImg },
                { id: 103, title: "The Base Violence Necessary for Change", duration: "44m", rating: "9.8", plot: "An epic showdown leaves fateful consequences for both Piltover and Zaun. Identities are forged.", image: backdropImg },
                { id: 104, title: "Happy Progress Day!", duration: "40m", rating: "8.9", plot: "With Piltover prospering from their technology, Jayce and Viktor weigh their next move.", image: backdropImg },
            ]
        },
        {
            id: 2,
            title: "Season 2",
            episodes: [
                { id: 201, title: "Heavy Is the Crown", duration: "45m", rating: "9.2", plot: "The aftermath of the council attack forces Piltover into harsh retaliation, pushing Zaun to the breaking point.", image: backdropImg },
                { id: 202, title: "Watch It All Burn", duration: "42m", rating: "9.1", plot: "As enforcers raid the undercity, new alliances form in the shadows. Jinx embraces the chaos.", image: backdropImg },
                { id: 203, title: "Finally Got The Name Right", duration: "46m", rating: "9.5", plot: "Vi tracks down an old friend. Jayce faces the consequences of Hextech weaponization.", image: backdropImg },
            ]
        }
    ];

    const [activeSeason, setActiveSeason] = useState(seasons[0]);
    const [showAllEpisodes, setShowAllEpisodes] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Only show first 3 episodes initially to save "loading time/space"
    const displayEpisodes = showAllEpisodes ? activeSeason.episodes : activeSeason.episodes.slice(0, 3);

    const handleSeasonSelect = (season: typeof seasons[0]) => {
        setActiveSeason(season);
        setIsDropdownOpen(false);
        setShowAllEpisodes(false); // Reset to collapsed view on new season
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
                        style={{ backgroundImage: `url('${backdropImg}')` }}
                    />
                </div>

                <div className="z-20 relative mx-auto px-6 md:px-10 lg:px-20 pb-12 w-full max-w-7xl">
                    <div className="space-y-6 max-w-2xl">
                        <div className="space-y-4">
                            <h1 className="font-bold text-slate-100 text-5xl md:text-7xl uppercase tracking-tighter">
                                {series.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 font-medium text-slate-300 text-sm">
                                <span className="bg-primary/20 px-2.5 py-1 border border-primary/30 rounded text-primary">
                                    {series.quality}
                                </span>
                                <span>{series.year}</span>
                                <span className="bg-slate-500 rounded-full w-1.5 h-1.5"></span>
                                <span>{series.seasonsCount} Seasons</span>
                                <span className="bg-slate-500 rounded-full w-1.5 h-1.5"></span>
                                <span className="flex items-center gap-1.5 text-primary">
                                    <Star fill="currentColor" size={16} /> {series.rating}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="flex items-center gap-2 bg-primary px-8 py-3.5 rounded-xl font-bold text-background-dark hover:scale-105 transition-transform">
                                <Play fill="currentColor" size={20} />
                                Play S1 E1
                            </button>
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3.5 rounded-xl font-semibold text-slate-100 transition-all">
                                <Plus size={20} />
                                Watchlist
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
                            {series.synopsis}
                        </p>
                        <div className="flex gap-3 pt-4">
                            {series.genres.map(genre => (
                                <span key={genre} className="bg-surface-dark px-4 py-1.5 border border-white/5 rounded-lg text-slate-300 text-sm">
                                    {genre}
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
                                    {activeSeason.title}
                                    <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="right-0 z-50 absolute bg-surface-dark shadow-2xl shadow-black/50 mt-2 border border-white/10 rounded-lg w-full overflow-hidden"
                                        >
                                            {seasons.map(season => (
                                                <button
                                                    key={season.id}
                                                    onClick={() => handleSeasonSelect(season)}
                                                    className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-white/5 transition-colors ${activeSeason.id === season.id ? 'text-primary bg-primary/5' : 'text-slate-300'}`}
                                                >
                                                    {season.title}
                                                    {activeSeason.id === season.id && <span className="float-right bg-primary mt-1.5 rounded-full w-1.5 h-1.5"></span>}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Episodes List */}
                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {displayEpisodes.map((ep, index) => (
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
                        </div>

                        {/* Load More Button */}
                        {!showAllEpisodes && activeSeason.episodes.length > 3 && (
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
                                    Load All {activeSeason.episodes.length} Episodes
                                </button>
                            </motion.div>
                        )}
                    </section>
                </div>

                {/* Sidebar (4 cols) */}
                <aside className="space-y-10 lg:col-span-4">

                    {/* Cast & Crew */}
                    <section className="space-y-6 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                        <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-slate-100 text-xl">
                            <span className="bg-primary rounded-full w-1 h-5"></span> Series Cast
                        </h3>
                        <div className="space-y-5 pt-2">
                            {cast.map(person => (
                                <div key={person.name} className="group flex items-center gap-4 cursor-pointer">
                                    <div className="rounded-full ring-2 ring-transparent group-hover:ring-primary w-12 h-12 overflow-hidden transition-colors">
                                        <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: `url('${person.image}')` }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-100 group-hover:text-primary text-sm transition-colors">{person.name}</p>
                                        <p className="mt-0.5 text-slate-500 text-xs">{person.role}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Creators */}
                            <div className="mt-2 pt-5 border-white/10 border-t">
                                <p className="mb-3 pl-1 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Creators</p>
                                <div className="group flex items-center gap-4 cursor-pointer">
                                    <div className="rounded-full ring-2 ring-transparent group-hover:ring-primary w-12 h-12 overflow-hidden transition-colors">
                                        <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: `url('${creators.image}')` }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-100 group-hover:text-primary text-sm transition-colors">{creators.name}</p>
                                        <p className="mt-0.5 text-slate-500 text-xs">{creators.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Details Box */}
                    <section className="space-y-5 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                        <h4 className="pb-4 border-white/5 border-b font-bold text-slate-100 text-lg">Series Info</h4>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Status</span>
                                <span className="font-semibold text-primary text-sm">Returning Series</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Network</span>
                                <span className="font-semibold text-slate-200 text-sm">Netflix</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">First Aired</span>
                                <span className="font-semibold text-slate-200 text-sm">Nov 6, 2021</span>
                            </div>
                        </div>
                    </section>

                </aside>

            </div>
        </div>
    );
}
