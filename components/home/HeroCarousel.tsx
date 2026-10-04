"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Info, Star } from "lucide-react";
import type { MediaItem } from "@/services/tmdbService";
import { formatRating, mediaHref, mediaTitle, mediaTypeOf, mediaYear } from "@/lib/media";
import { useLibraryActions } from "@/hooks/useLibraryActions";
import { useWatchProviders } from "@/hooks/useProviders";
import { TmdbImage } from "@/components/media/TmdbImage";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Badge, Button, ButtonLink, cx } from "@/components/ui/primitives";

const INTERVAL = 8000;

function HeroAvailability({ item }: { item: MediaItem }) {
    const type = mediaTypeOf(item);
    const { availability, isLoading } = useWatchProviders(type, item.id);
    const streaming = [...(availability?.flatrate || []), ...(availability?.free || []), ...(availability?.ads || [])]
        .filter((p, i, arr) => arr.findIndex((q) => q.provider_id === p.provider_id) === i)
        .slice(0, 4);

    if (isLoading) return <div className="rounded-lg w-40 h-8 skeleton" />;
    if (!streaming.length) {
        const transactional = (availability?.rent?.length || 0) + (availability?.buy?.length || 0);
        return transactional ? <p className="text-fg-muted text-sm">Available to rent or buy</p> : null;
    }

    return (
        <div className="flex items-center gap-3">
            <span className="font-medium text-fg-muted text-xs uppercase tracking-wider">Streaming on</span>
            <div className="flex -space-x-1.5">
                {streaming.map((p) => (
                    <ProviderLogo key={p.provider_id} name={p.provider_name} logoPath={p.logo_path} size={30} className="ring-2 ring-background-dark" />
                ))}
            </div>
        </div>
    );
}

export function HeroCarousel({ items, isLoading }: { items: MediaItem[]; isLoading?: boolean }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const { isInWatchlist, toggleWatchlist } = useLibraryActions();

    const count = items.length;
    const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

    useEffect(() => {
        if (paused || count < 2) return;
        const t = setTimeout(() => go(index + 1), INTERVAL);
        return () => clearTimeout(t);
    }, [index, paused, count, go]);

    if (isLoading || !count) {
        return (
            <section className="relative -mt-16 h-[78vh] min-h-[560px] max-h-[860px]">
                <div className="absolute inset-0 rounded-none skeleton" />
                <div className="bottom-20 left-4 sm:left-6 lg:left-10 absolute space-y-4 w-full max-w-xl">
                    <div className="rounded-lg w-32 h-6 skeleton" />
                    <div className="rounded-xl w-3/4 h-14 skeleton" />
                    <div className="rounded-lg w-full h-16 skeleton" />
                </div>
            </section>
        );
    }

    const item = items[index];
    const type = mediaTypeOf(item);
    const title = mediaTitle(item);
    const rating = formatRating(item.vote_average);
    const saved = isInWatchlist(item.id, type);

    return (
        <section
            aria-roledescription="carousel"
            aria-label="Featured titles"
            className="group/hero relative -mt-16 h-[78vh] min-h-[560px] max-h-[860px] overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            {/* Every backdrop stays mounted and cross-fades with CSS, so slides switch instantly and smoothly. */}
            {items.map((it, i) => (
                <div
                    key={it.id}
                    aria-hidden={i !== index}
                    className={cx(
                        "absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-out-expo",
                        i === index ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]",
                    )}
                >
                    <TmdbImage path={it.backdrop_path} size="w1280" alt="" priority={i === 0} className="object-[center_20%]" />
                </div>
            ))}

            {/* Legibility layers */}
            <div className="absolute inset-0 bg-linear-to-r from-background-dark via-background-dark/70 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/20 to-black/40" />

            <div className="relative flex items-end mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20 max-w-[1600px] h-full">
                {/* Keyed so each slide's copy animates in; no exit phase, so text is never left hidden. */}
                <div key={item.id} className="space-y-5 max-w-2xl animate-fade-in">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="accent">#{index + 1} Trending today</Badge>
                            <Badge>{type === "tv" ? "Series" : "Movie"}</Badge>
                            {mediaYear(item) && <span className="text-fg-muted text-sm">{mediaYear(item)}</span>}
                            {rating && (
                                <span className="flex items-center gap-1 font-semibold text-fg text-sm">
                                    <Star size={14} className="fill-warning text-warning" /> {rating}
                                </span>
                            )}
                        </div>

                        <h1 className="drop-shadow-xl font-display font-extrabold text-fg text-4xl sm:text-6xl lg:text-7xl text-balance leading-[0.95] tracking-tight">
                            {title}
                        </h1>

                        <p className="max-w-xl text-fg-muted text-base sm:text-lg line-clamp-3 leading-relaxed">{item.overview}</p>

                        <HeroAvailability item={item} />

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <ButtonLink href={mediaHref(item)} size="lg">
                                <Info size={18} /> Where to watch
                            </ButtonLink>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => toggleWatchlist(item.id, type)}
                                aria-pressed={saved}
                            >
                                {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                                {saved ? "In watchlist" : "Watchlist"}
                            </Button>
                        </div>
                </div>
            </div>

            {count > 1 && (
                <>
                    {/* Slide picker */}
                    <div className="right-4 sm:right-6 lg:right-10 bottom-6 sm:bottom-8 absolute flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => go(index - 1)}
                            aria-label="Previous title"
                            className="hidden sm:flex justify-center items-center bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/15 rounded-full size-10 text-white transition"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1.5 px-2">
                            {items.map((it, i) => (
                                <button
                                    key={it.id}
                                    type="button"
                                    onClick={() => go(i)}
                                    aria-label={`Show ${mediaTitle(it)}`}
                                    aria-current={i === index}
                                    className={cx(
                                        "relative bg-white/25 hover:bg-white/50 rounded-full h-1.5 overflow-hidden transition-all",
                                        i === index ? "w-10" : "w-3",
                                    )}
                                >
                                    {i === index && (
                                        <span
                                            key={`${index}-${paused}`}
                                            className="absolute inset-y-0 left-0 bg-white rounded-full"
                                            style={{
                                                width: paused ? "100%" : undefined,
                                                animation: paused ? undefined : `hero-progress ${INTERVAL}ms linear forwards`,
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => go(index + 1)}
                            aria-label="Next title"
                            className="hidden sm:flex justify-center items-center bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/15 rounded-full size-10 text-white transition"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Up next thumbnails (desktop) */}
                    <div className="hidden xl:flex right-10 bottom-24 absolute gap-3">
                        {[1, 2, 3].map((offset) => {
                            const next = items[(index + offset) % count];
                            return (
                                <Link
                                    key={next.id}
                                    href={mediaHref(next)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        go(index + offset);
                                    }}
                                    className="group/thumb relative rounded-xl ring-1 ring-white/15 hover:ring-primary/60 w-44 aspect-video overflow-hidden transition"
                                >
                                    <TmdbImage path={next.backdrop_path} size="w300" alt={mediaTitle(next)} className="group-hover/thumb:scale-105 transition-transform duration-500" />
                                    <span className="absolute inset-0 bg-linear-to-t from-black/90 to-transparent" />
                                    <span className="right-2.5 bottom-2 left-2.5 absolute font-medium text-white text-xs text-left truncate">{mediaTitle(next)}</span>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}

            <style>{`@keyframes hero-progress { from { width: 0% } to { width: 100% } }`}</style>
        </section>
    );
}
