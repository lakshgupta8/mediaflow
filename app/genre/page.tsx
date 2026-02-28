import React from 'react';
import { Film } from 'lucide-react';

export default function GenrePage() {
    const genres = [
        { name: "Action", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcGQkUsPAgdQF8N895m6lZlqZ_sSDzePMadiTTqTwMEntcHG8t_PA-uyr69juXWbpl1Iqy5t4bHPVDYZo0E3nvn6y1Z1rZuLKYuwz6kdJFYfCAxzy1A5S8dIGcOeXR4_M0d-K_r-9F45ZNAwnmeMVEmuyThNNiT3HycvIk8haSkOzYhvaMKVDakDc1fv--gfeiNzPfHZ0HyLQ6scyEls-Rf5Rh99r1uJfpdzT-3B3b_5KcVh_29iLnsRtn2kvzUfNhIXLL9_l1Q" },
        { name: "Sci-Fi", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJTo66q1_p_HKc-RfCbK3kkdpsZjJ5cYHik4gQmxN-7ARihIuTH2IxYqw1BAfQwqUOOqUiPUuA8onJMo-G9Vo6SofEwz52Oq37OcfP3GvzVytQ_84HkHXOQKf_Tljq4OaroApsP_OzHuebg2TWRm6BgBKK9-Dr9kFgaSNFcO5PsOEY9awz8zPvUXPlR4kTUc3avGaBJ-f8FO10_tJUUfCAVo4KZPcU5pCZ72oUUmbKU1gaWN5pbNT6xSu3XnhnP2OzMIsBOxx31Q" },
        { name: "Drama", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaCCi0Py-MfgBWBA0S-NWeUtK2n-GpXuYQ2Omux0yFykCk3mb6APYMESJx6_zuuXwlqCpAEKFCSmBKbTU18875WRtfuyzJsb2PfAyzFVpdU6pcmIpIM992kPgPx8uYFykISe0aLldSITq7CGKzzvyrZwD54sR8Evgzw7B8BkwIF9Ir5F0LeMwyhUbBuLoHFhwa27BJBMBqfEG8h-vU9HqVo9ffPh2mNC9xApSpM2diavk7f9HRT4403xMzDWvRgpE6TwgF1HqD8A" },
        { name: "Comedy", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHAdRlGo90tB2Xnq3_60q4vzRttGBZ4z3tOO5KMp2q7NhR3a1OKcNX-SWnLqHZFGi3lfqdV_krX6g4sujB9ZE-L2w-e9E7ONVMSN6dna0YL2PKac9Igx3G5o-nEOyI5r3JGE528_HuzcG6ooFcVW0H0qBzakJynibaopu2q27fc7pGd9pwzVruS4HD4oSxaWU-UZ7HnJkUMOSnJD5Rx7RLH1KNlgeKMfgf0O3eO6KrKd_2-XRrJJjZpUj9KW1mjTRkKr4bPpczTA" },
        { name: "Animation", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBzgFQdQgGXHd_Rlr57hxEoTzgno1XMZ3xppJH56KJCTT9rIrj2RyKxAM-8yYgtDuS0ovQp267VFL6_zB3doTjWgvAWKTBkgyiET-DowFAx_Qq47hfm1q0fA03GECrrHDfeolrKfRpdQmrgELAC0wi3XL2grhuYx7WDxxbmuVQyFf9e9S4psqxQI9d_LIvGuwrCbouUvyuA5FABpAB5BsYb_meaeZEHYJIh3zahLsct6GeFcXjOgm-bwJXzSaeFjaR0_7SUF1tBA" },
        { name: "Thriller", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3gBN4UJZ1vNGijFaS_MvBK0anyKN2zTvE2QGW86OkgtcggSJJ18nSSkkpXhJM_ZCGXqxeHM9TajUv3kBGsmyJP6qiIsh8tuBcaiGmFdQghJosk32LNByEZR__bQSYdE6L5w7tufVkwxZ7klxpQOBSaRm1v8kbNZ6QhWhv3Hn4Lq3xX4cpfP8CfRKm53Cp1o9Rb1DFJVdiTp74V4dhE7ZwZYSH2uehwW1cqAyWG69NmlxmUfX58CN6MvBCtOcnp_QMWUJUT6oU9Q" },
        { name: "Horror", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBulQic7dLA9CD3aE8u1X7adUgQq4BpRKzJZiRRpKnQ4CJgkXKx0DlKzKgEwx6r3SM-0-zb1FUVjknxhDXlr7PicKB0FBUY4mi_4SrGv9m2p3kmOamcsJg2We9Q5fhepUTJKZWze45dixLa37clTHbDYqgjjR-1F6mIZDg6ACTRUpcdFVldN1-V5FFn5bEy2GafoUck_PfXX1_0UTFeGV1ZZjsZC8XR1OYZbUOP9d8EQ0qo1mzKDtejDMzPQcQZFlmxtgxKLx4dow" },
        { name: "Adventure", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDgBwrXdyaPYrbJSZTaJ8XTPMwwKQyr1EvrpoUXYzG-tkomW7UWd569SSzpUYPSah3MrpPBZhDlCQ7_jVcMfKBZD4riCiFHSrmX2EiUmpfWJOXkvp3TQN_S0sJ4iUOPGUOq_TU-tmZE3k4Iak3RHtfHwJtCAGjio6HMtcPQVyeOwxIs1NwQ1TgcML3F094R46133SSXubuU2YGjye58LAovJMgeU5eLPhgJ-fZ2snrO6gaE29auOszpHDnFQ7rkiK-8-UcH4ZV0w" }
    ];

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
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {genres.map((genre) => (
                    <div
                        key={genre.name}
                        className="group relative bg-surface-dark hover:shadow-[0_10px_40px_-10px_rgba(19,236,91,0.3)] rounded-2xl ring-1 ring-white/10 hover:ring-primary w-full aspect-video overflow-hidden transition-all hover:-translate-y-2 duration-500 cursor-pointer"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                            style={{ backgroundImage: `url('${genre.image}')` }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-white group-hover:text-primary text-2xl transition-colors">
                                    {genre.name}
                                </h3>
                                <div className="flex justify-center items-center bg-white/10 opacity-0 group-hover:opacity-100 backdrop-blur-md rounded-full w-10 h-10 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                                    <Film size={20} className="text-white group-hover:text-primary" />
                                </div>
                            </div>
                            <p className="opacity-0 group-hover:opacity-100 mt-2 font-medium text-slate-400 text-sm transition-opacity duration-500 delay-100">
                                Explore popular {genre.name.toLowerCase()} titles ↗
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
