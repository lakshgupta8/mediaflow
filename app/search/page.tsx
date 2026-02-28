export default function SearchPage() {
    const genres = ["Action", "Comedy", "Sci-Fi", "Drama", "Thriller", "Horror", "Adventure"];
    const movies = [
        {
            title: "Inception",
            year: "2010",
            rating: "8.8",
            genre: "Sci-Fi, Action, Adventure",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFJMRhOkpJ8qyuceHDGJUz_oIG9Lisw1Ik44mpjOWhAja5lqKZMxP2fIOaS2T56A0NcTHEqRxWFZ3zSLvvuUko7EMrOXuxpSK0fDqgaV-0Tj3V8ijbPEvEb508byHVqAOBKl_eu3PUXKHulGI9F3i_UV9mXyQl_k98KdfVw6pXhI-R2CX4VdOqMl1Yf-en0p4Tl-2AX_6Jbc8JLULSo3-TDzuQABBSKj8-mfRVjWXXYyRwx4zp_-rexCW-6AP2dos-1tCQyJhpMQ",
        },
        {
            title: "Interstellar",
            year: "2014",
            rating: "8.6",
            genre: "Adventure, Drama, Sci-Fi",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDgBwrXdyaPYrbJSZTaJ8XTPMwwKQyr1EvrpoUXYzG-tkomW7UWd569SSzpUYPSah3MrpPBZhDlCQ7_jVcMfKBZD4riCiFHSrmX2EiUmpfWJOXkvp3TQN_S0sJ4iUOPGUOq_TU-tmZE3k4Iak3RHtfHwJtCAGjio6HMtcPQVyeOwxIs1NwQ1TgcML3F094R46133SSXubuU2YGjye58LAovJMgeU5eLPhgJ-fZ2snrO6gaE29auOszpHDnFQ7rkiK-8-UcH4ZV0w",
        },
        {
            title: "The Matrix",
            year: "1999",
            rating: "8.7",
            genre: "Action, Sci-Fi",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAakgaTE6uAQ6_xYffWlm4NSYU9S82U84fhDvl7c8D91yrLQrOVihcVlvNkROE4QY9iu8IMM8xO9AIAIIUCJvNDwy3jgFOIml5aO-cENUvniGDmF4mPkDqEmf2QvekvTLR_aTXk7VEyn3WMUc46wdw_YPw_zpwtM-z55iQWnfg7R-WhccSH27twmVo5PQ4PNq0FFKM7TITMFVUOvOT7dMkcEYhn88F6FLV4KQR9Jko1jC5qYoGPxqprYdWRfrnKfqueO2IXhpqwdw",
        },
        {
            title: "Blade Runner 2049",
            year: "2017",
            rating: "7.9",
            genre: "Action, Drama, Sci-Fi",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8z8AHOnbqW8E9-weSdfbY_imRjmVRVzT4cC03q-HIPY8JGiz9lcP27DDBkkXO6r4P05C8bzONErjvn4bgU9qP2dFd0XKMy4NlR8uuE43e3M02aC-3CFRqcLh4xnXjAxulhEts6ZHOY5TxMSoMkoYEfxWFq_w1ewBok0XcM7jy0Zr8_qpGZaB_7DyAvl5Spw3s6EMM6PfFee31Wnzkyk0EFGkN6tNw_B8ijxWcxQo1wer07nAbo6GOsLS5ixwtiH7e-rMzWjYMGw",
        },
        {
            title: "Spider-Man: NWH",
            year: "2021",
            rating: "8.2",
            genre: "Action, Adventure, Fantasy",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRcsQzLbHOP1G_S09WuHze7gvdvhqUWJpJAIKXAC-3ESaXcDUSH7ZIZpI5JqoSBGAO6ItxITR9e2xw-HsDbr84puzmGG5PsncJUaUjqDLct0jNG751-cItC2Bc5apY8tVZ4fijoHu7_v4ESqoaBHUE-KX0DTWx0skUAMEG3g0YMiYMJEwd_X7NDlNKGrCKNqZGIJu_Aup60PxoguvwRwTmAGwzJBC2hGX0KISAeoi1S0C-GcPFI5toJhynnfJaL2rqVIELznAHNw",
        },
        {
            title: "Dune",
            year: "2021",
            rating: "8.0",
            genre: "Action, Adventure, Drama",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQM5hpb9SnAstJ6IjhP50CEKUeVBgIK8h-hGWNHlTc_yMX624UI8DFIYhqh2WT2199j_wGGw9NqQGOMdr5-ck9wK8ttyQulvQ7ttr3Ei2WHWr2tZB1zEgIfbblKocBaT0pr78FCkE_DNWFdgQBiSMk8mugDO0id4kO2oNoUO5eAREhhuoxLZDbareU3wkeq1QyevMesrzrFGt5LoBt7f-gXSW4N0u40DgsWJVfNX1K-dllTjyTEnxRZz5z_MEqcQ3W4n4r5cyElg",
        },
        {
            title: "Star Wars: ANH",
            year: "1977",
            rating: "8.6",
            genre: "Action, Adventure, Fantasy",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBulQic7dLA9CD3aE8u1X7adUgQq4BpRKzJZiRRpKnQ4CJgkXKx0DlKzKgEwx6r3SM-0-zb1FUVjknxhDXlr7PicKB0FBUY4mi_4SrGv9m2p3kmOamcsJg2We9Q5fhepUTJKZWze45dixLa37clTHbDYqgjjR-1F6mIZDg6ACTRUpcdFVldN1-V5FFn5bEy2GafoUck_PfXX1_0UTFeGV1ZZjsZC8XR1OYZbUOP9d8EQ0qo1mzKDtejDMzPQcQZFlmxtgxKLx4dow"
        },
        {
            title: "The Dark Knight",
            year: "2008",
            rating: "9.0",
            genre: "Action, Crime, Drama",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcGQkUsPAgdQF8N895m6lZlqZ_sSDzePMadiTTqTwMEntcHG8t_PA-uyr69juXWbpl1Iqy5t4bHPVDYZo0E3nvn6y1Z1rZuLKYuwz6kdJFYfCAxzy1A5S8dIGcOeXR4_M0d-K_r-9F45ZNAwnmeMVEmuyThNNiT3HycvIk8haSkOzYhvaMKVDakDc1fv--gfeiNzPfHZ0HyLQ6scyEls-Rf5Rh99r1uJfpdzT-3B3b_5KcVh_29iLnsRtn2kvzUfNhIXLL9_l1Q"
        }
    ];

    return (
        <div className="flex flex-1 gap-8 mx-auto mt-16 px-6 lg:px-8 py-8 w-full max-w-[1600px]">
            {/* Sidebar Filters */}
            <aside className="hidden top-28 sticky lg:flex flex-col gap-8 pr-2 pb-10 w-72 h-[calc(100vh-8rem)] overflow-y-auto shrink-0">
                <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                        Discover
                    </h3>
                    <div className="flex bg-surface-dark p-1 rounded-xl ring-1 ring-white/5 w-full">
                        <button className="flex-1 bg-primary shadow-lg py-2 rounded-lg font-bold text-black text-sm transition-all">
                            Movies
                        </button>
                        <button className="flex-1 py-2 rounded-lg font-medium text-slate-400 hover:text-white text-sm transition-colors">
                            Series
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                            Genres
                        </h3>
                        <button className="text-primary text-xs hover:underline">
                            Reset
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {genres.map((g, i) => (
                            <label key={g} className="group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    defaultChecked={i === 0 || i === 2}
                                />
                                <span className="inline-flex items-center bg-surface-dark peer-checked:bg-primary/10 px-3 py-1.5 border border-white/10 group-hover:border-primary/50 peer-checked:border-primary rounded-lg font-medium text-slate-300 peer-checked:text-primary text-xs transition-all">
                                    {g}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                                IMDb Rating
                            </h3>
                            <span className="font-bold text-primary text-xs">7.0+</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            defaultValue="7"
                            className="bg-surface-dark rounded-lg w-full h-1 appearance-none cursor-pointer"
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1">
                <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4 mb-6">
                    <h2 className="font-semibold text-white text-xl">
                        Found <span className="text-primary">1,204</span> titles
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-sm">Sort by:</span>
                        <select className="bg-surface-dark shadow-sm py-2 pr-10 pl-4 border border-white/10 focus:border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary font-medium text-white text-sm appearance-none">
                            <option>Popularity</option>
                            <option>Newest Releases</option>
                            <option>Top Rated</option>
                            <option>Title (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 xl:grid-cols-4">
                    {movies.map((movie) => (
                        <div
                            key={movie.title}
                            className="group relative flex flex-col bg-surface-dark hover:shadow-[0_0_20px_rgba(19,236,91,0.15)] rounded-xl ring-1 ring-white/5 hover:ring-primary/50 overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
                        >
                            <div className="bg-surface-dark w-full aspect-[2/3] overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                    style={{ backgroundImage: `url('${movie.image}')` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                <div className="bottom-3 left-3 absolute flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md font-bold text-primary text-xs">
                                    ★ {movie.rating}
                                </div>
                            </div>
                            <div className="flex flex-col p-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-white group-hover:text-primary text-base truncate transition-colors">
                                        {movie.title}
                                    </h3>
                                    <span className="font-medium text-slate-400 text-xs">
                                        {movie.year}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-xs truncate">
                                    {movie.genre}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
