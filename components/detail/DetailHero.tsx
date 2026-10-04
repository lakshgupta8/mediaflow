"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Bookmark, BookmarkCheck, Check, Eye, Heart, MonitorPlay, Star } from "lucide-react";
import type { MediaItem, MediaType } from "@/services/tmdbService";
import { formatRating, mediaTitle } from "@/lib/media";
import { useLibraryActions } from "@/hooks/useLibraryActions";
import { usePreferences, useWatchProviders } from "@/hooks/useProviders";
import { TmdbImage } from "@/components/media/TmdbImage";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { myServicesStreaming } from "@/components/providers/WhereToWatch";
import { Badge, Button, buttonClass, Container, cx } from "@/components/ui/primitives";

interface DetailHeroProps {
    item: MediaItem;
    type: MediaType;
    /** Short facts after the title, e.g. year, runtime, seasons. */
    meta: (string | null | undefined | false)[];
    onTrailer?: () => void;
    isWatched: boolean;
    onToggleWatched: () => void;
    /** Extra content under the actions (e.g. creator line). */
    footer?: ReactNode;
}

/** Primary call-to-action: open the best legal source in the user's region. */
function SourceCta({ type, id }: { type: MediaType; id: number }) {
    const { myProviders } = usePreferences();
    const { availability, isLoading } = useWatchProviders(type, id);

    if (isLoading) return <span className="rounded-xl w-48 h-13 skeleton" />;

    const mine = myServicesStreaming(availability, myProviders);
    const pool = [...(availability?.flatrate || []), ...(availability?.free || []), ...(availability?.ads || [])];
    // Add-on "channels" (e.g. "HBO Max Amazon Channel") are a worse first pick than the service itself.
    const streaming = pool.find((p) => !/channel/i.test(p.provider_name)) || pool[0];
    const best = mine.find((p) => !/channel/i.test(p.provider_name)) || mine[0] || streaming;

    if (best && availability) {
        return (
            <a href={availability.link} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "lg", "pl-2.5")}>
                <ProviderLogo name={best.provider_name} logoPath={best.logo_path} size={32} className="ring-0" />
                <span className="flex flex-col items-start leading-tight">
                    <span className="opacity-70 font-medium text-[11px]">{mine.length ? "On your service" : "Stream on"}</span>
                    <span>{best.provider_name}</span>
                </span>
                <ArrowUpRight size={16} />
            </a>
        );
    }

    return (
        <a href="#where-to-watch" className={buttonClass("primary", "lg")}>
            <MonitorPlay size={18} /> Where to watch
        </a>
    );
}

export function DetailHero({ item, type, meta, onTrailer, isWatched, onToggleWatched, footer }: DetailHeroProps) {
    const title = mediaTitle(item);
    const rating = formatRating(item.vote_average);
    const { isInWatchlist, isFavorite, toggleWatchlist, toggleFavorite } = useLibraryActions();
    const saved = isInWatchlist(item.id, type);
    const loved = isFavorite(item.id, type);

    return (
        <section className="relative -mt-16 pt-16 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 h-[88%]">
                <TmdbImage path={item.backdrop_path} size="original" alt="" priority className="object-[center_25%]" />
                <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/75 to-background-dark/30" />
                <div className="absolute inset-0 bg-linear-to-r from-background-dark/95 via-background-dark/50 to-transparent" />
            </div>

            <Container className="relative pt-16 sm:pt-28 lg:pt-36 pb-10">
                <div className="flex md:flex-row flex-col md:items-end gap-8 lg:gap-12">
                    {/* Poster */}
                    <div className="hidden md:block relative shadow-2xl shadow-black/70 rounded-2xl ring-1 ring-white/10 w-56 lg:w-72 aspect-2/3 overflow-hidden shrink-0">
                        <TmdbImage path={item.poster_path} size="w500" alt={`${title} poster`} priority />
                    </div>

                    <div className="flex-1 space-y-5 min-w-0 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-fg-muted text-sm">
                            <Badge tone="accent">{type === "tv" ? "Series" : "Movie"}</Badge>
                            {meta.filter(Boolean).map((m, i) => (
                                <span key={i} className="flex items-center gap-3">
                                    {i > 0 && <span className="bg-fg-subtle rounded-full size-1" />}
                                    {m}
                                </span>
                            ))}
                        </div>

                        <div>
                            <h1 className="font-display font-extrabold text-fg text-4xl sm:text-5xl lg:text-6xl text-balance leading-[0.98] tracking-tight">
                                {title}
                            </h1>
                            {item.tagline && <p className="mt-3 text-fg-muted text-lg italic">“{item.tagline}”</p>}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {rating && (
                                <span className="flex items-center gap-1.5 bg-warning/12 mr-1 px-2.5 py-1 border border-warning/25 rounded-lg font-semibold text-sm text-warning">
                                    <Star size={14} className="fill-warning" /> {rating}
                                    {item.vote_count ? <span className="font-normal text-warning/70 text-xs">({item.vote_count.toLocaleString()})</span> : null}
                                </span>
                            )}
                            {item.genres?.map((g) => (
                                <a
                                    key={g.id}
                                    href={`/browse?type=${type}&genre=${g.id}`}
                                    className="bg-white/6 hover:bg-white/12 px-3 py-1 border border-line rounded-lg text-fg-muted hover:text-fg text-sm transition-colors"
                                >
                                    {g.name}
                                </a>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            <SourceCta type={type} id={item.id} />
                            {onTrailer && (
                                <Button variant="secondary" size="lg" onClick={onTrailer}>
                                    <MonitorPlay size={18} /> Trailer
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleWatchlist(item.id, type)}
                                aria-pressed={saved}
                                className={cx(saved && "border-primary/50 text-primary-light")}
                            >
                                {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                                {saved ? "In watchlist" : "Watchlist"}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleFavorite(item.id, type)}
                                aria-pressed={loved}
                                className={cx(loved && "border-accent-pink/50 text-accent-pink")}
                            >
                                <Heart size={15} fill={loved ? "currentColor" : "none"} />
                                {loved ? "Favorited" : "Favorite"}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onToggleWatched}
                                aria-pressed={isWatched}
                                className={cx(isWatched && "border-success/50 text-success")}
                            >
                                {isWatched ? <Check size={15} /> : <Eye size={15} />}
                                {isWatched ? "Watched" : "Mark watched"}
                            </Button>
                        </div>

                        {footer}
                    </div>
                </div>
            </Container>
        </section>
    );
}
