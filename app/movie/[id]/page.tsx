import React from 'react';
import { Play, Plus, Share2, Star, ThumbsUp, MessageSquare, Edit3 } from 'lucide-react';

export default function MovieDetailsPage() {
    const movie = {
        title: "Interstellar",
        year: "2014",
        duration: "2h 49m",
        rating: "8.7",
        quality: "4K ULTRA HD",
        backdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJTo66q1_p_HKc-RfCbK3kkdpsZjJ5cYHik4gQmxN-7ARihIuTH2IxYqw1BAfQwqUOOqUiPUuA8onJMo-G9Vo6SofEwz52Oq37OcfP3GvzVytQ_84HkHXOQKf_Tljq4OaroApsP_OzHuebg2TWRm6BgBKK9-Dr9kFgaSNFcO5PsOEY9awz8zPvUXPlR4kTUc3avGaBJ-f8FO10_tJUUfCAVo4KZPcU5pCZ72oUUmbKU1gaWN5pbNT6xSu3XnhnP2OzMIsBOxx31Q",
        synopsis: "In Earth's future, a global crop blight and second Dust Bowl are slowly rendering the planet uninhabitable. Professor Brand, a brilliant NASA physicist, is working on plans to save mankind by transporting Earth's population to a new home via a wormhole. But first, Brand must send Cooper and a team of researchers through the wormhole and across the galaxy to find out which of three planets could be mankind's new home.",
        genres: ["Sci-Fi", "Adventure", "Drama"]
    };

    const cast = [
        {
            name: "Matthew McConaughey",
            role: "Cooper",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxgmnqnz0Yzxq0aRH_chaSnXyIoTTm096KyUeK5T6sL0j4eXNwgN4xa9NZbCF8KJ2y4FgXnUbJBx52oYgeoq4voGPKsQsvd2RTnqQkBiTqeWNJDQJrF1tTJL2xSU1SpCIs7SfVLq7qwBjCPqVJVI3enXULvSEJc2caQIfbonD2mR0Vp8yQPAxW1u0p_sHolcL28tzG8lMKWqjlJSNk_WuLWG9DhQTUpsObxl7o-VaYcuVLqfKHqcvIWhyzkoJkDAbjwOfWyCDUZA"
        },
        {
            name: "Anne Hathaway",
            role: "Brand",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoc_AFBhqCj7FtLi1AscNEkA0n8X-RXrk-eONvUbbGkD8_c91sQOelvNtX8WNHOMO9BFzYVByKdA9ntEdr9GepbXh16e_H2XQkOD6LMytAS2qW76Jk7SdRbUMmTF-nV7r4asyDFxoIfVj5iJZXsehfmF9-9cEU_oer-4SFa8U1TSrozpAgyCSsTCUJR3P2_-6SBTkSyTVIIb5ro_m6GSa_tArN7fuV1D_gRSoFGxBNWRdJqyB7hpMIm2aeRRnnJzrYR6pVDTgVuA"
        },
        {
            name: "Jessica Chastain",
            role: "Murph",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdt7zwPtibX-lY7i2N9AthrAyOEYJi6xyl_kuqvK4W2o6DBLGzehxYenjwcojTBBdURyKssaEvmyEy8YnK15h2-2KwOt4_P2L94j6Vkx2QYUHWq3NYSH0vthX1XUmFRYT1qPiTsxhU29drhnUOdNOC3BOdpmv15k3Yon6Ja-GOvxY4jz0LpSPz0KNnzau1y5rfMVJ9Zp9sibLNckL63ZSmHshTKa5-5LnvwjnlwHmNhY1HdsPFR3FKMzsolkFYVtMnPsnUXlimzA"
        }
    ];

    const director = {
        name: "Christopher Nolan",
        role: "Director, Writer",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcOuoyMHBi-m5xxbB9Y8QCjIkpj2Sk8s180dRJWQ3gZ5T2ryUmfljidMoCn4kW6dIoeNzTlF27cuM-qkqvs43ppvj3X_FJuAn6KmQSlV9eLhsdKvovfibjy_l7YtBkHZvwYZho1sm42lbiQP7a0iIJuImUOwFtDFh8JFoDViIaVkrNIfrAKCM52MkKO2Yv3boKfZlmA09c18yY-r4k1jODvnigd51vmJPrgCANk-dx_--MzDW0Z0-haaVfpwfPbnxHb-_PTvh2PQ"
    };

    return (
        <div className="flex flex-col pb-12 w-full overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative flex items-end w-full min-h-[500px] aspect-[21/9]">
                <div className="z-0 absolute inset-0">
                    <div className="z-10 absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
                    <div className="z-10 absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent"></div>
                    <div
                        className="bg-cover bg-center w-full h-full"
                        style={{ backgroundImage: `url('${movie.backdrop}')` }}
                    />
                </div>

                <div className="z-20 relative mx-auto px-6 md:px-10 lg:px-20 pb-12 w-full max-w-7xl">
                    <div className="space-y-6 max-w-2xl">
                        <div className="space-y-4">
                            <h1 className="font-bold text-slate-100 text-5xl md:text-7xl uppercase tracking-tighter">
                                {movie.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 font-medium text-slate-300 text-sm">
                                <span className="bg-primary/20 px-2.5 py-1 border border-primary/30 rounded text-primary">
                                    {movie.quality}
                                </span>
                                <span>{movie.year}</span>
                                <span className="bg-slate-500 rounded-full w-1.5 h-1.5"></span>
                                <span>{movie.duration}</span>
                                <span className="bg-slate-500 rounded-full w-1.5 h-1.5"></span>
                                <span className="flex items-center gap-1.5 text-primary">
                                    <Star fill="currentColor" size={16} /> {movie.rating}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="flex items-center gap-2 bg-primary px-8 py-3.5 rounded-xl font-bold text-background-dark hover:scale-105 transition-transform">
                                <Play fill="currentColor" size={20} />
                                Play Trailer
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
            <div className="gap-12 grid grid-cols-1 lg:grid-cols-12 mx-auto px-6 md:px-10 lg:px-20 py-12 max-w-7xl">

                {/* Main Content (8 cols) */}
                <div className="space-y-12 lg:col-span-8">

                    {/* Synopsis */}
                    <section className="space-y-4">
                        <h3 className="flex items-center gap-2 mb-6 font-bold text-slate-100 text-2xl">
                            <span className="bg-primary rounded-full w-1 h-6"></span> Synopsis
                        </h3>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            {movie.synopsis}
                        </p>
                        <div className="flex gap-3 pt-4">
                            {movie.genres.map(genre => (
                                <span key={genre} className="bg-surface-dark px-4 py-1.5 border border-white/5 rounded-lg text-slate-300 text-sm">
                                    {genre}
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
                            {/* Review 1 */}
                            <div className="space-y-4 bg-surface-dark p-6 border border-white/5 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="flex justify-center items-center bg-primary/20 rounded-full w-10 h-10 font-bold text-primary">JD</div>
                                        <div>
                                            <p className="font-semibold text-slate-100">Jonathan Doe</p>
                                            <p className="text-slate-500 text-xs">Reviewed 2 days ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md text-primary">
                                        <Star fill="currentColor" size={14} />
                                        <span className="font-bold text-sm">10/10</span>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm italic leading-relaxed">
                                    &quot;A masterpiece of modern cinema. The visual effects and Hans Zimmer&apos;s score create an immersive experience that stays with you long after the credits roll. Truly a journey through time and space.&quot;
                                </p>
                                <div className="flex items-center gap-4 pt-2 text-slate-500 text-xs">
                                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors"><ThumbsUp size={14} /> 1.2k</button>
                                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors"><MessageSquare size={14} /> 24</button>
                                </div>
                            </div>

                            {/* Review 2 */}
                            <div className="space-y-4 bg-surface-dark p-6 border border-white/5 rounded-xl">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="flex justify-center items-center bg-primary/20 rounded-full w-10 h-10 font-bold text-primary">SA</div>
                                        <div>
                                            <p className="font-semibold text-slate-100">Sarah Anderson</p>
                                            <p className="text-slate-500 text-xs">Reviewed 1 week ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md text-primary">
                                        <Star fill="currentColor" size={14} />
                                        <span className="font-bold text-sm">9/10</span>
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm italic leading-relaxed">
                                    &quot;Emotional and scientifically grounded. Matthew McConaughey gives one of his best performances. The ending might be polarising, but the ambition is undeniable.&quot;
                                </p>
                                <div className="flex items-center gap-4 pt-2 text-slate-500 text-xs">
                                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors"><ThumbsUp size={14} /> 856</button>
                                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors"><MessageSquare size={14} /> 12</button>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Sidebar (4 cols) */}
                <aside className="space-y-10 lg:col-span-4">

                    {/* Cast & Crew */}
                    <section className="space-y-6 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                        <h3 className="flex items-center gap-2 pb-4 border-white/5 border-b font-bold text-slate-100 text-xl">
                            <span className="bg-primary rounded-full w-1 h-5"></span> Cast &amp; Crew
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

                            {/* Director */}
                            <div className="mt-2 pt-5 border-white/10 border-t">
                                <p className="mb-3 pl-1 font-bold text-[10px] text-slate-500 uppercase tracking-wider">Director</p>
                                <div className="group flex items-center gap-4 cursor-pointer">
                                    <div className="rounded-full ring-2 ring-transparent group-hover:ring-primary w-12 h-12 overflow-hidden transition-colors">
                                        <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: `url('${director.image}')` }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-100 group-hover:text-primary text-sm transition-colors">{director.name}</p>
                                        <p className="mt-0.5 text-slate-500 text-xs">{director.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Details Box */}
                    <section className="space-y-5 bg-surface-dark p-6 border border-white/5 rounded-2xl">
                        <h4 className="pb-4 border-white/5 border-b font-bold text-slate-100 text-lg">Movie Details</h4>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Status</span>
                                <span className="font-semibold text-slate-200 text-sm">Released</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Release Date</span>
                                <span className="font-semibold text-slate-200 text-sm">Nov 7, 2014</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Budget</span>
                                <span className="font-semibold text-slate-200 text-sm">$165,000,000</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-lg">
                                <span className="font-medium text-slate-400 text-sm">Revenue</span>
                                <span className="font-semibold text-primary text-slate-200 text-sm">$701,729,206</span>
                            </div>
                        </div>
                    </section>

                </aside>

            </div>
        </div>
    );
}
