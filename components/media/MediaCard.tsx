"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, Heart, Star } from "lucide-react";
import type { MediaItem } from "@/services/tmdbService";
import { formatRating, mediaHref, mediaTitle, mediaTypeOf, mediaYear } from "@/lib/media";
import { useLibraryActions } from "@/hooks/useLibraryActions";
import { TmdbImage } from "./TmdbImage";
import { cx } from "@/components/ui/primitives";

interface MediaCardProps {
    item: MediaItem;
    /** Big outlined number for "Top 10" style rails. */
    rank?: number;
    className?: string;
    priority?: boolean;
}

export function MediaCard({ item, rank, className, priority }: MediaCardProps) {
    const type = mediaTypeOf(item);
    const title = mediaTitle(item);
    const year = mediaYear(item);
    const rating = formatRating(item.vote_average);
    const { isInWatchlist, isFavorite, toggleWatchlist, toggleFavorite } = useLibraryActions();

    const saved = isInWatchlist(item.id, type);
    const loved = isFavorite(item.id, type);

    return (
        <div className={cx("group/card relative flex flex-col gap-2.5 animate-fade-in", rank && (rank > 9 ? "pl-16" : "pl-10"), className)}>
            {rank && (
                <span
                    aria-hidden
                    className="bottom-11 left-0 z-0 absolute font-display font-extrabold text-[6.5rem] text-transparent tracking-tighter leading-[0.8] select-none"
                    style={{ WebkitTextStroke: "2px rgb(255 255 255 / 0.35)" }}
                >
                    {rank}
                </span>
            )}

            <div className="relative z-10 bg-surface-raised shadow-black/40 shadow-lg rounded-xl ring-1 ring-line group-hover/card:ring-primary/50 aspect-2/3 overflow-hidden transition-all group-hover/card:-translate-y-1 duration-300 ease-out-expo">
                <Link href={mediaHref(item)} aria-label={`${title}${year ? ` (${year})` : ""}`} className="absolute inset-0">
                    <TmdbImage
                        path={item.poster_path || item.backdrop_path}
                        size="w342"
                        alt={title}
                        priority={priority}
                        className="group-hover/card:scale-[1.04] transition-transform duration-500 ease-out-expo"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                </Link>

                {rating && (
                    <div className="top-2 left-2 absolute flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md font-semibold text-[11px] text-white pointer-events-none">
                        <Star size={10} className="fill-warning text-warning" />
                        {rating}
                    </div>
                )}

                <div className="right-2 bottom-2 left-2 absolute flex justify-end gap-1.5 opacity-0 group-hover/card:opacity-100 focus-within:opacity-100 transition-all translate-y-1 group-hover/card:translate-y-0 duration-300">
                    <button
                        type="button"
                        onClick={() => toggleFavorite(item.id, type)}
                        aria-label={loved ? "Remove from favorites" : "Add to favorites"}
                        aria-pressed={loved}
                        className={cx(
                            "flex justify-center items-center backdrop-blur-md rounded-lg size-8 transition-colors",
                            loved ? "bg-accent-pink text-white" : "bg-black/60 text-white hover:bg-black/80",
                        )}
                    >
                        <Heart size={15} fill={loved ? "currentColor" : "none"} />
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleWatchlist(item.id, type)}
                        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                        aria-pressed={saved}
                        className={cx(
                            "flex justify-center items-center backdrop-blur-md rounded-lg size-8 transition-colors",
                            saved ? "bg-primary text-primary-ink" : "bg-black/60 text-white hover:bg-black/80",
                        )}
                    >
                        {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                    </button>
                </div>

                {saved && (
                    <div className="top-2 right-2 absolute flex justify-center items-center bg-primary rounded-md size-6 text-primary-ink group-hover/card:opacity-0 transition-opacity pointer-events-none">
                        <BookmarkCheck size={13} />
                    </div>
                )}

            </div>

            <Link href={mediaHref(item)} className="z-10 relative min-w-0" tabIndex={-1}>
                <h3 className="font-medium text-fg group-hover/card:text-primary-light text-sm truncate transition-colors">{title}</h3>
                <p className="mt-0.5 text-fg-subtle text-xs">
                    {[year, type === "tv" ? "Series" : "Movie"].filter(Boolean).join(" · ")}
                </p>
            </Link>
        </div>
    );
}

export function MediaCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cx("flex flex-col gap-2.5", className)}>
            <div className="rounded-xl aspect-2/3 skeleton" />
            <div className="rounded w-3/4 h-3.5 skeleton" />
            <div className="rounded w-1/3 h-3 skeleton" />
        </div>
    );
}
