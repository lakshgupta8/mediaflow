"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { Bookmark, ChevronDown, Compass, Heart, History, Search, SearchX, X } from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { useUserData } from "@/hooks/useUserData";
import { tmdbService, type MediaItem, type MediaType } from "@/services/tmdbService";
import { mediaTitle } from "@/lib/media";
import { MediaCard, MediaCardSkeleton } from "@/components/media/MediaCard";
import { gridClass } from "@/components/media/MediaGrid";
import { Button, ButtonLink, Chip, Container, EmptyState, PageHeader, cx } from "@/components/ui/primitives";

export type LibraryKind = "watchlist" | "favorites" | "recent";

type TypeFilter = "all" | MediaType;
type SortKey = "added" | "watched" | "title" | "rating";

interface StoredItem {
    media_id: number;
    media_type: MediaType;
    added_at: string;
    last_watched_at?: string;
}

interface LibraryEntry {
    stored: StoredItem;
    media: MediaItem;
}

const KIND_CONFIG: Record<
    LibraryKind,
    {
        label: string;
        href: string;
        icon: (size: number) => ReactNode;
        description: string;
        guardTitle: string;
        guardDescription: string;
        emptyTitle: string;
        emptyDescription: string;
    }
> = {
    watchlist: {
        label: "Watchlist",
        href: "/watchlist",
        icon: (size) => <Bookmark size={size} />,
        description: "Everything you plan to watch, with where to stream, rent or buy it in your region.",
        guardTitle: "Your watchlist, everywhere",
        guardDescription: "Sign in to save movies and series from every service into one list that follows you across devices.",
        emptyTitle: "Your watchlist is empty",
        emptyDescription: "Save titles from any service with the bookmark button and they will land here, ready when you are.",
    },
    favorites: {
        label: "Favorites",
        href: "/favorites",
        icon: (size) => <Heart size={size} />,
        description: "The movies and series you love most, all in one place.",
        guardTitle: "Keep the ones you love",
        guardDescription: "Sign in to collect your favorite movies and series and get better picks across every source.",
        emptyTitle: "No favorites yet",
        emptyDescription: "Tap the heart on any title to add it to your favorites.",
    },
    recent: {
        label: "History",
        href: "/recent",
        icon: (size) => <History size={size} />,
        description: "Everything you've marked as watched, newest first.",
        guardTitle: "Keep a log of what you've seen",
        guardDescription: "Sign in to mark movies and series as watched and keep your history across devices.",
        emptyTitle: "Nothing marked as watched",
        emptyDescription: "Use \"Mark watched\" on any title page and it will show up here.",
    },
};

const TABS: LibraryKind[] = ["watchlist", "favorites", "recent"];

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movies" },
    { value: "tv", label: "Series" },
];

const sortOptionsFor = (kind: LibraryKind): { value: SortKey; label: string }[] => [
    kind === "recent" ? { value: "watched", label: "Last watched" } : { value: "added", label: "Recently added" },
    { value: "title", label: "Title A-Z" },
    { value: "rating", label: "Rating" },
];

const timeOf = (value?: string) => (value ? new Date(value).getTime() || 0 : 0);

export function LibraryView({ kind }: { kind: LibraryKind }) {
    const config = KIND_CONFIG[kind];
    return (
        <AuthGuard title={config.guardTitle} description={config.guardDescription}>
            <LibraryContent kind={kind} />
        </AuthGuard>
    );
}

function LibraryContent({ kind }: { kind: LibraryKind }) {
    const config = KIND_CONFIG[kind];
    const {
        watchlist,
        favorites,
        recentWatches,
        isLoadingWatchlist,
        isLoadingFavorites,
        isLoadingRecent,
        removeFromRecent,
    } = useUserData();

    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
    const [sort, setSort] = useState<SortKey>(kind === "recent" ? "watched" : "added");

    const lists: Record<LibraryKind, { items: StoredItem[]; loading: boolean }> = {
        watchlist: { items: watchlist, loading: isLoadingWatchlist },
        favorites: { items: favorites, loading: isLoadingFavorites },
        recent: { items: recentWatches, loading: isLoadingRecent },
    };
    const { items: stored, loading: isLoadingList } = lists[kind];

    const results = useQueries({
        queries: stored.map((item) => ({
            queryKey: ["media", item.media_type, item.media_id],
            queryFn: () => tmdbService.getDetails(item.media_type, item.media_id),
            staleTime: 1000 * 60 * 30,
        })),
    });

    const isLoadingDetails = results.some((r) => r.isLoading);
    const entries: LibraryEntry[] = stored.flatMap((item, i) => {
        const media = results[i]?.data;
        return media ? [{ stored: item, media }] : [];
    });

    const typeCounts = {
        all: entries.length,
        movie: entries.filter((e) => e.stored.media_type === "movie").length,
        tv: entries.filter((e) => e.stored.media_type === "tv").length,
    };

    const needle = query.trim().toLowerCase();
    const visible = entries
        .filter((e) => typeFilter === "all" || e.stored.media_type === typeFilter)
        .filter((e) => !needle || mediaTitle(e.media).toLowerCase().includes(needle))
        .sort((a, b) => {
            switch (sort) {
                case "title":
                    return mediaTitle(a.media).localeCompare(mediaTitle(b.media));
                case "rating":
                    return (b.media.vote_average || 0) - (a.media.vote_average || 0);
                case "watched":
                    return timeOf(b.stored.last_watched_at) - timeOf(a.stored.last_watched_at);
                default:
                    return timeOf(b.stored.added_at) - timeOf(a.stored.added_at);
            }
        });

    const showSkeleton = isLoadingList || (isLoadingDetails && entries.length === 0);
    const filtersActive = needle !== "" || typeFilter !== "all";
    const resetFilters = () => {
        setQuery("");
        setTypeFilter("all");
    };

    const remove = (e: LibraryEntry) => removeFromRecent({ mediaId: e.stored.media_id, mediaType: e.stored.media_type });

    const summary = isLoadingList
        ? "Loading your library"
        : `${stored.length} ${stored.length === 1 ? "title" : "titles"}${typeCounts.movie || typeCounts.tv ? ` · ${typeCounts.movie} movies · ${typeCounts.tv} series` : ""}`;

    return (
        <Container className="pb-10">
            <PageHeader
                eyebrow="Library"
                title={config.label === "History" ? "Recently watched" : `Your ${config.label.toLowerCase()}`}
                description={config.description}
                icon={config.icon(22)}
                actions={<p className="text-fg-subtle text-sm tabular-nums">{summary}</p>}
            />

            {/* Library tabs */}
            <nav aria-label="Library sections" className="flex gap-1 -mx-4 sm:mx-0 px-4 sm:px-0 border-line border-b overflow-x-auto no-scrollbar">
                {TABS.map((tab) => {
                    const tabConfig = KIND_CONFIG[tab];
                    const active = tab === kind;
                    const count = lists[tab].loading ? null : lists[tab].items.length;
                    return (
                        <Link
                            key={tab}
                            href={tabConfig.href}
                            aria-current={active ? "page" : undefined}
                            className={cx(
                                "relative flex items-center gap-2 px-4 py-3 font-semibold text-sm whitespace-nowrap transition-colors",
                                active ? "text-fg" : "text-fg-muted hover:text-fg",
                            )}
                        >
                            {tabConfig.icon(16)}
                            {tabConfig.label}
                            {count !== null && (
                                <span
                                    className={cx(
                                        "px-1.5 py-0.5 rounded-md min-w-6 text-[11px] text-center tabular-nums",
                                        active ? "bg-primary/20 text-primary-light" : "bg-white/6 text-fg-subtle",
                                    )}
                                >
                                    {count}
                                </span>
                            )}
                            {active && <span aria-hidden className="right-3 -bottom-px left-3 absolute bg-primary rounded-full h-0.5" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Toolbar */}
            {(showSkeleton || entries.length > 0) && (
                <div className="flex lg:flex-row flex-col lg:items-center gap-3 py-5">
                    <div className="relative lg:w-80">
                        <Search size={16} aria-hidden className="top-1/2 left-3.5 absolute text-fg-subtle -translate-y-1/2 pointer-events-none" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Filter ${config.label.toLowerCase()}`}
                            aria-label={`Filter ${config.label.toLowerCase()} by title`}
                            className="bg-white/6 focus:bg-white/8 pr-9 pl-10 border border-line focus:border-primary/50 rounded-full outline-none w-full h-9 text-fg placeholder:text-fg-subtle text-sm transition-colors [&::-webkit-search-cancel-button]:hidden"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear filter"
                                className="top-1/2 right-2 absolute flex justify-center items-center hover:bg-white/10 rounded-full size-6 text-fg-muted hover:text-fg -translate-y-1/2"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-1 justify-between items-center gap-3">
                        <div role="group" aria-label="Filter by type" className="flex gap-2 overflow-x-auto no-scrollbar">
                            {TYPE_FILTERS.map((f) => (
                                <Chip key={f.value} active={typeFilter === f.value} onClick={() => setTypeFilter(f.value)}>
                                    {f.label}
                                    {!showSkeleton && <span className="opacity-60 tabular-nums">{typeCounts[f.value]}</span>}
                                </Chip>
                            ))}
                        </div>
                        <SortSelect value={sort} onChange={setSort} options={sortOptionsFor(kind)} />
                    </div>
                </div>
            )}

            {showSkeleton ? (
                <div className={cx(gridClass, "pt-1")}>
                    {Array.from({ length: Math.max(Math.min(stored.length, 14), 7) }).map((_, i) => (
                        <MediaCardSkeleton key={i} />
                    ))}
                </div>
            ) : entries.length === 0 ? (
                <EmptyState
                    icon={config.icon(28)}
                    title={config.emptyTitle}
                    description={config.emptyDescription}
                    action={
                        <ButtonLink href="/browse?type=movie">
                            <Compass size={16} />
                            Browse titles
                        </ButtonLink>
                    }
                />
            ) : visible.length === 0 ? (
                <EmptyState
                    icon={<SearchX size={28} />}
                    title="No matches"
                    description={
                        needle
                            ? <>Nothing in your {config.label.toLowerCase()} matches &ldquo;{query.trim()}&rdquo;{typeFilter !== "all" ? " with the current type filter" : ""}.</>
                            : <>No {typeFilter === "tv" ? "series" : "movies"} in your {config.label.toLowerCase()} yet.</>
                    }
                    action={filtersActive && <Button variant="outline" onClick={resetFilters}>Clear filters</Button>}
                />
            ) : (
                <section aria-label={kind === "recent" ? "Watch history" : config.label}>
                    <div className={gridClass}>
                        {visible.map((entry) =>
                            kind === "recent" ? (
                                <div key={`${entry.stored.media_type}-${entry.stored.media_id}`} className="flex flex-col gap-1.5">
                                    <MediaCard item={entry.media} />
                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-fg-subtle text-xs truncate">
                                            {entry.stored.last_watched_at ? `Watched ${formatShortDate(entry.stored.last_watched_at)}` : "Watched"}
                                        </span>
                                        <RemoveButton title={mediaTitle(entry.media)} onClick={() => remove(entry)} />
                                    </div>
                                </div>
                            ) : (
                                <MediaCard key={`${entry.stored.media_type}-${entry.stored.media_id}`} item={entry.media} />
                            ),
                        )}
                        {isLoadingDetails && <MediaCardSkeleton />}
                    </div>
                </section>
            )}
        </Container>
    );
}

const formatShortDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

function SortSelect({
    value,
    onChange,
    options,
}: {
    value: SortKey;
    onChange: (value: SortKey) => void;
    options: { value: SortKey; label: string }[];
}) {
    return (
        <div className="relative shrink-0">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as SortKey)}
                aria-label="Sort by"
                className="bg-white/6 hover:bg-white/10 pr-9 pl-3.5 border border-line focus:border-primary/50 rounded-full outline-none h-9 font-medium text-fg text-sm transition-colors appearance-none cursor-pointer"
            >
                {options.map((o) => (
                    <option key={o.value} value={o.value} className="bg-surface-raised text-fg">
                        {o.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={15} aria-hidden className="top-1/2 right-3 absolute text-fg-muted -translate-y-1/2 pointer-events-none" />
        </div>
    );
}

function RemoveButton({ title, onClick }: { title: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Remove ${title} from history`}
            title="Remove from history"
            className="flex justify-center items-center hover:bg-danger/15 rounded-md size-7 text-fg-subtle hover:text-danger transition-colors shrink-0"
        >
            <X size={15} />
        </button>
    );
}
