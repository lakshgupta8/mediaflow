export default function WatchlistPage() {
    const movies = [
        {
            title: "Dune: Part Two",
            year: "2024",
            genre: "Sci-Fi",
            duration: "2h 46m",
            rating: "8.8",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDib0fZNUmZzE_DvIiM8VmD6vAYR5VdXrriN5sC88T2jVi6msbacII9285TWv8BR8Prvx2zVTmHhZ9bA1ao95wgpBNXxpEw_Y356SywEjAkzLMt7VBIAQCgRqtSZNPK9PsQoRbuhJf1Ggt8TCWgbvQjLRYcTpzeypOP_d_9b_ntMFkfQvMUwav5ydakeyglU_V_Mja5QmukcLiWwqqF4SmnMgz8fNywkRYnNhxjIu6Ho2zNQsy4vcwqFHkV8s1DbRHJ073rCVVNYg"
        },
        {
            title: "Oppenheimer",
            year: "2023",
            genre: "Biography",
            duration: "3h 00m",
            rating: "9.2",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaCCi0Py-MfgBWBA0S-NWeUtK2n-GpXuYQ2Omux0yFykCk3mb6APYMESJx6_zuuXwlqCpAEKFCSmBKbTU18875WRtfuyzJsb2PfAyzFVpdU6pcmIpIM992kPgPx8uYFykISe0aLldSITq7CGKzzvyrZwD54sR8Evgzw7B8BkwIF9Ir5F0LeMwyhUbBuLoHFhwa27BJBMBqfEG8h-vU9HqVo9ffPh2mNC9xApSpM2diavk7f9HRT4403xMzDWvRgpE6TwgF1HqD8A"
        },
        {
            title: "The Bear",
            year: "2023",
            genre: "Series",
            duration: "2 Seasons",
            rating: "8.7",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHAdRlGo90tB2Xnq3_60q4vzRttGBZ4z3tOO5KMp2q7NhR3a1OKcNX-SWnLqHZFGi3lfqdV_krX6g4sujB9ZE-L2w-e9E7ONVMSN6dna0YL2PKac9Igx3G5o-nEOyI5r3JGE528_HuzcG6ooFcVW0H0qBzakJynibaopu2q27fc7pGd9pwzVruS4HD4oSxaWU-UZ7HnJkUMOSnJD5Rx7RLH1KNlgeKMfgf0O3eO6KrKd_2-XRrJJjZpUj9KW1mjTRkKr4bPpczTA"
        },
        {
            title: "Spider-Man: Across the...",
            year: "2023",
            genre: "Animation",
            duration: "2h 20m",
            rating: "9.0",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBzgFQdQgGXHd_Rlr57hxEoTzgno1XMZ3xppJH56KJCTT9rIrj2RyKxAM-8yYgtDuS0ovQp267VFL6_zB3doTjWgvAWKTBkgyiET-DowFAx_Qq47hfm1q0fA03GECrrHDfeolrKfRpdQmrgELAC0wi3XL2grhuYx7WDxxbmuVQyFf9e9S4psqxQI9d_LIvGuwrCbouUvyuA5FABpAB5BsYb_meaeZEHYJIh3zahLsct6GeFcXjOgm-bwJXzSaeFjaR0_7SUF1tBA"
        },
        {
            title: "Blade Runner 2049",
            year: "2017",
            genre: "Sci-Fi",
            duration: "2h 44m",
            rating: "7.9",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZJ1d6PsgHcnpSzEBjplSar1nC9kK1xL06vvzebNq9tc9nHpbBfZrghQiS0V3YWc8y0OrxtWf2GZbuCbmb4hHTHR2Bjy2Z6Oq4ElapJxFa-21efPmznvJAhbLjdh4DB682aGzRynEI01e6XLVckejGXBdeJPHmIGHqeAxAOjXSBhKs9BAj6bjnwJkalS2elgSsv8hW9NwoC-soKC00t6FLA0-fiiwzDEUkCeyXXmo35HRoUlQMLi7fqwoQVFGSFyV6EMr4kN-yDA"
        },
        {
            title: "The Batman",
            year: "2022",
            genre: "Action",
            duration: "2h 56m",
            rating: "8.1",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoZ6CRZY9V6UrGJbIbfrux6MkSHvqk_bmFZKd6IUlv1e_-3EEMYNLK7YLH_TlUoOIO_PZr9VbQj_t9pYm4rjCxvCLyggjNpMF5kW2IhEYXQQjhB6x38T5jT7mSMEySI-Qp9ZgciXJeTi_2eEyC-B18uU3AGrZt4nviYMIX1bS1grHn9-5ahRNE8x0X5H010EuaWDVbMK4LswBBUi4RNFt_S1mwnd2zclC9rZWVwFK83AR8vDDwi6Eu2HSeX0zW2rTE_v8aq_1QzA"
        },
        {
            title: "The Creator",
            year: "2023",
            genre: "Sci-Fi",
            duration: "2h 13m",
            rating: "7.5",
            isNew: true,
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlL1kHV8ike_MFxhglym5aqT3TIwR-chZzyZ2E3V0HpIvQm7D6jYmXYMfg7yyszf_NIE2PZkdbUw5QGl-J9TfCXxIZ5dq1F9q0Gu58Y7b_Jfd8O6tN1WG2fGb5joVNW6ZVWzBWv6cXPk071dbdQYUYxglHBO9E2jyXo9PFQDmdnjUCdAOLKM9tiFZYgN_nFpUCI7fpnjT4XWBrEkFiafwPdLhShfBVAkxLtyqhOKYW8nFkWyN4Mw34iOcCrzJeoYMDvJej2z9qfA"
        }
    ];

    return (
        <div className="flex flex-col gap-8 mx-auto mt-16 px-6 lg:px-10 py-8 w-full max-w-[1400px]">
            {/* Header Section */}
            <div className="flex md:flex-row flex-col justify-between md:items-end gap-6 pb-2 border-white/5 border-b">
                <div className="flex flex-col gap-2">
                    <h1 className="font-black text-white text-4xl leading-tight tracking-[-0.033em]">
                        My Watchlist
                    </h1>
                    <p className="max-w-xl font-normal text-primary text-base">
                        Keep track of movies and TV shows you want to watch.{" "}
                        <span className="text-slate-400">Manage your personal collection.</span>
                    </p>
                </div>

                {/* Stats Summary */}
                <div className="flex gap-6">
                    <div className="text-center">
                        <p className="font-bold text-white text-3xl">12</p>
                        <p className="font-semibold text-primary text-xs uppercase tracking-wider">
                            To Watch
                        </p>
                    </div>
                    <div className="bg-white/10 w-px"></div>
                    <div className="text-center">
                        <p className="font-bold text-slate-400 text-3xl">45</p>
                        <p className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                            Seen
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-6">
                <div className="flex bg-surface-dark p-1 rounded-lg">
                    <button className="flex items-center gap-2 bg-primary shadow-sm px-6 py-2 rounded font-bold text-background-dark text-sm transition-all">
                        To Watch
                    </button>
                    <button className="flex items-center gap-2 hover:bg-white/5 px-6 py-2 rounded font-medium text-slate-400 hover:text-white text-sm transition-all">
                        Already Seen
                    </button>
                </div>
            </div>

            <div className="gap-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pb-12">
                {movies.map((movie) => (
                    <div key={movie.title} className="group relative flex flex-col gap-3">
                        <div className="relative bg-surface-dark shadow-lg group-hover:shadow-primary/20 group-hover:shadow-xl rounded-xl ring-1 ring-white/5 w-full aspect-[2/3] overflow-hidden transition-all group-hover:-translate-y-1 duration-300">
                            <div
                                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                                style={{ backgroundImage: `url('${movie.image}')` }}
                            ></div>
                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 p-4 transition-opacity duration-300">
                                <div className="flex justify-center items-center gap-3 pb-6">
                                    <button
                                        className="flex justify-center items-center bg-white/10 hover:bg-primary backdrop-blur-sm rounded-full w-10 h-10 text-white hover:text-black transition-colors"
                                        title="Mark as Watched"
                                    >
                                        ✓
                                    </button>
                                    <button
                                        className="flex justify-center items-center bg-white/10 hover:bg-red-500 backdrop-blur-sm rounded-full w-10 h-10 text-white hover:text-white transition-colors"
                                        title="Remove from Watchlist"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {movie.isNew && (
                                <div className="top-2 left-2 absolute bg-primary shadow-lg shadow-primary/20 px-1.5 py-0.5 rounded font-bold text-black text-xs">
                                    New
                                </div>
                            )}

                            <div className="top-2 right-2 absolute flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 border border-white/10 rounded font-bold text-primary text-xs">
                                ★ {movie.rating}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white group-hover:text-primary text-base truncate transition-colors">
                                {movie.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-primary text-xs">
                                <span>{movie.year}</span>
                                <span className="bg-current rounded-full w-1 h-1"></span>
                                <span className="text-slate-400">{movie.genre}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <button className="group flex flex-col gap-3 text-left cursor-pointer">
                    <div className="relative flex flex-col justify-center items-center gap-3 bg-white/5 group-hover:bg-primary/5 border-2 border-white/10 group-hover:border-primary border-dashed rounded-xl w-full aspect-[2/3] overflow-hidden text-slate-400 group-hover:text-primary transition-all duration-300">
                        <div className="bg-white/5 group-hover:bg-primary p-3 rounded-full group-hover:text-black transition-colors">
                            +
                        </div>
                        <span className="font-bold text-sm">Add to Watchlist</span>
                    </div>
                    <div>
                        <div className="bg-surface-dark mb-1 rounded-md w-3/4 h-4"></div>
                        <div className="bg-surface-dark rounded-md w-1/2 h-3"></div>
                    </div>
                </button>
            </div>
        </div>
    );
}
