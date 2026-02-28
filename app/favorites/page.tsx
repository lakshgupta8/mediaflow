import React from 'react';
import { Heart, Trash2, Play } from 'lucide-react';

export default function FavoritesPage() {
    const movies = [
        {
            title: "Interstellar",
            year: "2014",
            genre: "Sci-Fi",
            rating: "8.7",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJTo66q1_p_HKc-RfCbK3kkdpsZjJ5cYHik4gQmxN-7ARihIuTH2IxYqw1BAfQwqUOOqUiPUuA8onJMo-G9Vo6SofEwz52Oq37OcfP3GvzVytQ_84HkHXOQKf_Tljq4OaroApsP_OzHuebg2TWRm6BgBKK9-Dr9kFgaSNFcO5PsOEY9awz8zPvUXPlR4kTUc3avGaBJ-f8FO10_tJUUfCAVo4KZPcU5pCZ72oUUmbKU1gaWN5pbNT6xSu3XnhnP2OzMIsBOxx31Q"
        },
        {
            title: "The Dark Knight",
            year: "2008",
            genre: "Action",
            rating: "9.0",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcGQkUsPAgdQF8N895m6lZlqZ_sSDzePMadiTTqTwMEntcHG8t_PA-uyr69juXWbpl1Iqy5t4bHPVDYZo0E3nvn6y1Z1rZuLKYuwz6kdJFYfCAxzy1A5S8dIGcOeXR4_M0d-K_r-9F45ZNAwnmeMVEmuyThNNiT3HycvIk8haSkOzYhvaMKVDakDc1fv--gfeiNzPfHZ0HyLQ6scyEls-Rf5Rh99r1uJfpdzT-3B3b_5KcVh_29iLnsRtn2kvzUfNhIXLL9_l1Q"
        },
        {
            title: "Inception",
            year: "2010",
            genre: "Action",
            rating: "8.8",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFJMRhOkpJ8qyuceHDGJUz_oIG9Lisw1Ik44mpjOWhAja5lqKZMxP2fIOaS2T56A0NcTHEqRxWFZ3zSLvvuUko7EMrOXuxpSK0fDqgaV-0Tj3V8ijbPEvEb508byHVqAOBKl_eu3PUXKHulGI9F3i_UV9mXyQl_k98KdfVw6pXhI-R2CX4VdOqMl1Yf-en0p4Tl-2AX_6Jbc8JLULSo3-TDzuQABBSKj8-mfRVjWXXYyRwx4zp_-rexCW-6AP2dos-1tCQyJhpMQ"
        },
        {
            title: "Star Wars: ANH",
            year: "1977",
            genre: "Adventure",
            rating: "8.6",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBulQic7dLA9CD3aE8u1X7adUgQq4BpRKzJZiRRpKnQ4CJgkXKx0DlKzKgEwx6r3SM-0-zb1FUVjknxhDXlr7PicKB0FBUY4mi_4SrGv9m2p3kmOamcsJg2We9Q5fhepUTJKZWze45dixLa37clTHbDYqgjjR-1F6mIZDg6ACTRUpcdFVldN1-V5FFn5bEy2GafoUck_PfXX1_0UTFeGV1ZZjsZC8XR1OYZbUOP9d8EQ0qo1mzKDtejDMzPQcQZFlmxtgxKLx4dow"
        }
    ];

    return (
        <div className="flex flex-col gap-8 mx-auto mt-16 px-6 lg:px-10 py-8 pb-20 w-full max-w-[1400px]">

            {/* Header Section */}
            <div className="flex md:flex-row flex-col justify-between md:items-end gap-6 pb-4 border-white/5 border-b">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center bg-primary/20 shadow-inner rounded-xl ring-1 ring-primary/30 w-12 h-12 text-primary">
                            <Heart className="fill-current" size={24} />
                        </div>
                        <h1 className="font-black text-white text-4xl md:text-5xl leading-tight tracking-tight">
                            Favorites
                        </h1>
                    </div>
                    <p className="pt-1 pl-1 max-w-xl font-medium text-slate-400 text-lg">
                        Your personal hall of fame. Movies and series you truly love.
                    </p>
                </div>

                {/* Count Badge */}
                <div className="flex items-center gap-2 bg-surface-dark px-4 py-2 rounded-xl ring-1 ring-white/5">
                    <Heart size={16} className="fill-primary text-primary" />
                    <span className="font-bold text-white">{movies.length}</span>
                    <span className="font-medium text-slate-400 text-sm">Titles saved</span>
                </div>
            </div>

            {/* Grid */}
            <div className="gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movies.map((movie) => (
                    <div key={movie.title} className="group relative flex flex-col gap-3">
                        <div className="relative bg-surface-dark shadow-lg group-hover:shadow-[0_10px_30px_-10px_rgba(19,236,91,0.3)] rounded-xl ring-1 ring-white/5 group-hover:ring-primary/50 w-full aspect-2/3 overflow-hidden transition-all group-hover:-translate-y-1 duration-300 cursor-pointer">
                            <div
                                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: `url('${movie.image}')` }}
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 p-4 transition-opacity duration-300">
                                <div className="flex items-center gap-2">
                                    <button className="flex flex-1 justify-center items-center gap-1 bg-primary hover:bg-primary/90 shadow-lg py-2 rounded-lg font-bold text-background-dark text-sm transition-colors">
                                        <Play size={16} className="fill-current" /> Play
                                    </button>
                                    <button className="flex justify-center items-center bg-white/10 hover:bg-red-500/90 backdrop-blur-md rounded-lg w-9 h-9 text-white transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="top-2 right-2 absolute bg-black/60 backdrop-blur-md p-1.5 border border-primary/30 rounded-full text-primary">
                                <Heart size={14} className="fill-current" />
                            </div>

                            <div className="top-2 left-2 absolute flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 border border-white/10 rounded font-bold text-primary text-xs">
                                ★ {movie.rating}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-white group-hover:text-primary text-base truncate transition-colors cursor-pointer">
                                {movie.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 font-medium text-primary/80 text-xs">
                                <span>{movie.year}</span>
                                <span className="bg-current rounded-full w-1 h-1"></span>
                                <span className="text-slate-400">{movie.genre}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
