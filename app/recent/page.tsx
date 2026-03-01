"use client";

import React from 'react';
import { Clock, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function RecentPage() {
    const movies = [
        {
            title: "Dune: Part Two",
            added: "Watched 2 hours ago",
            genre: "Sci-Fi",
            rating: "8.8",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDib0fZNUmZzE_DvIiM8VmD6vAYR5VdXrriN5sC88T2jVi6msbacII9285TWv8BR8Prvx2zVTmHhZ9bA1ao95wgpBNXxpEw_Y356SywEjAkzLMt7VBIAQCgRqtSZNPK9PsQoRbuhJf1Ggt8TCWgbvQjLRYcTpzeypOP_d_9b_ntMFkfQvMUwav5ydakeyglU_V_Mja5QmukcLiWwqqF4SmnMgz8fNywkRYnNhxjIu6Ho2zNQsy4vcwqFHkV8s1DbRHJ073rCVVNYg"
        },
        {
            title: "The Creator",
            added: "Watched 5 hours ago",
            genre: "Sci-Fi",
            rating: "7.5",
            isNew: true,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlL1kHV8ike_MFxhglym5aqT3TIwR-chZzyZ2E3V0HpIvQm7D6jYmXYMfg7yyszf_NIE2PZkdbUw5QGl-J9TfCXxIZ5dq1F9q0Gu58Y7b_Jfd8O6tN1WG2fGb5joVNW6ZVWzBWv6cXPk071dbdQYUYxglHBO9E2jyXo9PFQDmdnjUCdAOLKM9tiFZYgN_nFpUCI7fpnjT4XWBrEkFiafwPdLhShfBVAkxLtyqhOKYW8nFkWyN4Mw34iOcCrzJeoYMDvJej2z9qfA"
        },
        {
            title: "Oppenheimer",
            added: "Watched yesterday",
            genre: "Biography",
            rating: "9.2",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaCCi0Py-MfgBWBA0S-NWeUtK2n-GpXuYQ2Omux0yFykCk3mb6APYMESJx6_zuuXwlqCpAEKFCSmBKbTU18875WRtfuyzJsb2PfAyzFVpdU6pcmIpIM992kPgPx8uYFykISe0aLldSITq7CGKzzvyrZwD54sR8Evgzw7B8BkwIF9Ir5F0LeMwyhUbBuLoHFhwa27BJBMBqfEG8h-vU9HqVo9ffPh2mNC9xApSpM2diavk7f9HRT4403xMzDWvRgpE6TwgF1HqD8A"
        },
        {
            title: "Spider-Man: Across the...",
            added: "Watched yesterday",
            genre: "Animation",
            rating: "9.0",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBzgFQdQgGXHd_Rlr57hxEoTzgno1XMZ3xppJH56KJCTT9rIrj2RyKxAM-8yYgtDuS0ovQp267VFL6_zB3doTjWgvAWKTBkgyiET-DowFAx_Qq47hfm1q0fA03GECrrHDfeolrKfRpdQmrgELAC0wi3XL2grhuYx7WDxxbmuVQyFf9e9S4psqxQI9d_LIvGuwrCbouUvyuA5FABpAB5BsYb_meaeZEHYJIh3zahLsct6GeFcXjOgm-bwJXzSaeFjaR0_7SUF1tBA"
        },
        {
            title: "The Batman",
            added: "Watched 2 days ago",
            genre: "Action",
            rating: "8.1",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoZ6CRZY9V6UrGJbIbfrux6MkSHvqk_bmFZKd6IUlv1e_-3EEMYNLK7YLH_TlUoOIO_PZr9VbQj_t9pYm4rjCxvCLyggjNpMF5kW2IhEYXQQjhB6x38T5jT7mSMEySI-Qp9ZgciXJeTi_2eEyC-B18uU3AGrZt4nviYMIX1bS1grHn9-5ahRNE8x0X5H010EuaWDVbMK4LswBBUi4RNFt_S1mwnd2zclC9rZWVwFK83AR8vDDwi6Eu2HSeX0zW2rTE_v8aq_1QzA"
        },
        {
            title: "The Bear",
            added: "Watched 1 week ago",
            genre: "Series",
            rating: "8.7",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHAdRlGo90tB2Xnq3_60q4vzRttGBZ4z3tOO5KMp2q7NhR3a1OKcNX-SWnLqHZFGi3lfqdV_krX6g4sujB9ZE-L2w-e9E7ONVMSN6dna0YL2PKac9Igx3G5o-nEOyI5r3JGE528_HuzcG6ooFcVW0H0qBzakJynibaopu2q27fc7pGd9pwzVruS4HD4oSxaWU-UZ7HnJkUMOSnJD5Rx7RLH1KNlgeKMfgf0O3eO6KrKd_2-XRrJJjZpUj9KW1mjTRkKr4bPpczTA"
        },
        {
            title: "Blade Runner 2049",
            added: "Watched 1 week ago",
            genre: "Sci-Fi",
            rating: "7.9",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZJ1d6PsgHcnpSzEBjplSar1nC9kK1xL06vvzebNq9tc9nHpbBfZrghQiS0V3YWc8y0OrxtWf2GZbuCbmb4hHTHR2Bjy2Z6Oq4ElapJxFa-21efPmznvJAhbLjdh4DB682aGzRynEI01e6XLVckejGXBdeJPHmIGHqeAxAOjXSBhKs9BAj6bjnwJkalS2elgSsv8hW9NwoC-soKC00t6FLA0-fiiwzDEUkCeyXXmo35HRoUlQMLi7fqwoQVFGSFyV6EMr4kN-yDA"
        }
    ];

    const searchQuery = useSelector((state: RootState) => state.search.query).toLowerCase();
    const filteredMovies = movies.filter(movie => {
        if (!searchQuery) return true;
        return movie.title.toLowerCase().includes(searchQuery);
    });

    return (
        <div className="flex flex-col gap-8 mx-auto mt-16 px-6 lg:px-10 py-8 pb-20 w-full max-w-[1400px]">

            {/* Header Section */}
            <div className="flex md:flex-row flex-col justify-between md:items-end gap-6 pb-4 border-white/5 border-b">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="flex justify-center items-center bg-primary/10 rounded-full w-10 h-10 text-primary">
                            <Clock size={20} />
                        </span>
                        <h1 className="font-black text-white text-4xl leading-tight tracking-tight">
                            Recently Watched
                        </h1>
                    </div>
                    <p className="pl-1 max-w-xl font-medium text-slate-400 text-base">
                        Jump back into the movies and TV shows you&apos;ve been watching on CineScope.
                    </p>
                </div>
            </div>

            {/* Grid */}
            {filteredMovies.length > 0 ? (
                <div className="gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {filteredMovies.map((movie) => (
                        <div key={movie.title} className="group relative flex flex-col gap-3">
                            <div className="relative bg-surface-dark shadow-lg group-hover:shadow-primary/20 group-hover:shadow-xl rounded-xl ring-1 ring-white/5 group-hover:ring-primary/50 w-full aspect-2/3 overflow-hidden transition-all group-hover:-translate-y-1 duration-300 cursor-pointer">
                                <div
                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                    style={{ backgroundImage: `url('${movie.image}')` }}
                                />
                                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 p-4 transition-opacity duration-300">
                                    <button className="bg-primary hover:bg-white shadow-lg py-2 rounded-lg w-full font-bold text-background-dark text-sm transition-colors">
                                        Play Now
                                    </button>
                                </div>

                                {movie.isNew && (
                                    <div className="top-2 left-2 absolute bg-primary shadow-lg shadow-primary/20 px-2 py-0.5 rounded font-bold text-black text-xs">
                                        New Episode
                                    </div>
                                )}

                                <div className="top-2 right-2 absolute flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 border border-white/10 rounded font-bold text-primary text-xs">
                                    ★ {movie.rating}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-white group-hover:text-primary text-base truncate transition-colors cursor-pointer">
                                    {movie.title}
                                </h3>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-slate-500">{movie.added}</span>
                                    <span className="font-semibold text-primary/80">{movie.genre}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col flex-1 justify-center items-center opacity-50 py-20 min-h-[40vh]">
                    <Search size={64} className="mb-4 text-slate-500" />
                    <h2 className="font-semibold text-slate-400 text-2xl">No recent watches found</h2>
                    <p className="mt-2 text-slate-500 text-sm">
                        {searchQuery ? `No matches for "${searchQuery}" in your history.` : "You haven't watched anything recently."}
                    </p>
                </div>
            )}
        </div>
    );
}
