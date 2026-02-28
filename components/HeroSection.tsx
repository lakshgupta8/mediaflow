"use client";

import { Play, Plus } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <div className="relative w-full h-[70vh] min-h-[600px]">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqtYSAwmXkSU2A7X4Puy-8KTnMoPk2XZRMLfPCaLpU6hzs5KjEfJNCjaWiiwThZ_vSQDmULIwxlaQ__mVhCua5dBsJQ1MdqjxyRDNcnWmBykOsnIuHnsEHKqUHoWd5ZwngeERkyvLmGYuwPKS3Tf8IfAKLq5bDyFk1oDF9PXF29iUuMucCXmWsDwnwgcopCejYg25injeMVWQZ8br2AM5x-O8-SF30TmLTSXgWoXdBtSyU1rfVrGk-a_PJGGFTUsXoMXf6lCXOIg')",
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/40 to-transparent"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative flex flex-col justify-end gap-6 p-10 pb-16 max-w-4xl h-full"
            >
                <div className="flex items-center gap-3">
                    <span className="bg-primary px-2 py-1 rounded font-bold text-background-dark text-xs uppercase tracking-wider">
                        New Release
                    </span>
                    <span className="bg-black/40 backdrop-blur-sm px-2 py-1 border border-white/20 rounded font-bold text-slate-300 text-xs uppercase tracking-wider">
                        Sci-Fi
                    </span>
                    <span className="flex items-center gap-1 font-bold text-primary text-sm">
                        <svg
                            className="fill-current w-4 h-4"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        9.8
                    </span>
                </div>
                <h1 className="drop-shadow-2xl font-bold text-white text-5xl md:text-7xl leading-[1.1] tracking-tight">
                    The Cyber <br />{" "}
                    <span className="bg-clip-text bg-gradient-to-r from-white to-slate-400 text-transparent">
                        Resurgence
                    </span>
                </h1>
                <p className="drop-shadow-md max-w-2xl text-slate-300 text-lg line-clamp-3 leading-relaxed">
                    In a future where humanity has merged with the digital realm, a lone
                    hacker uncovers a conspiracy that threatens to reboot civilization
                    itself. Prepare for a visual masterpiece that redefines reality.
                </p>

                <div className="flex items-center gap-4 pt-2">
                    <button className="flex items-center gap-2 bg-primary hover:bg-green-400 shadow-[0_0_20px_rgba(19,236,91,0.4)] px-8 py-3.5 rounded-xl font-bold text-background-dark text-base hover:scale-105 transition-all transform">
                        <Play fill="currentColor" size={20} /> Watch Now
                    </button>
                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3.5 border border-white/10 rounded-xl font-semibold text-white text-base transition-all">
                        <Plus size={20} /> Add to Watchlist
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
