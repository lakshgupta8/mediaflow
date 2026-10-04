"use client";

import { X } from "lucide-react";
import { Overlay } from "./Overlay";

export function TrailerModal({ videoKey, title, open, onClose }: { videoKey: string; title: string; open: boolean; onClose: () => void }) {
    return (
        <Overlay open={open} onClose={onClose} label={`${title} trailer`}>
            <button type="button" aria-label="Close trailer" onClick={onClose} className="absolute inset-0 bg-black/85 backdrop-blur-md" />
            <div className="relative flex flex-col justify-center items-center mx-auto px-4 w-full max-w-6xl h-full pointer-events-none">
                <div className="flex justify-between items-center mb-3 w-full pointer-events-auto">
                    <p className="font-display font-semibold text-fg truncate">{title} · Trailer</p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close trailer"
                        className="flex justify-center items-center bg-white/10 hover:bg-white/20 rounded-full size-10 text-white transition"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="bg-black shadow-2xl rounded-2xl ring-1 ring-white/10 w-full aspect-video overflow-hidden pointer-events-auto">
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
                        title={`${title} trailer`}
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        className="border-0 w-full h-full"
                    />
                </div>
            </div>
        </Overlay>
    );
}
