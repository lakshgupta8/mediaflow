"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronLeft, ChevronRight, Compass, Search, SearchX, X } from "lucide-react";
import { tmdbService, type MediaItem } from "@/services/tmdbService";
import { mediaTitle } from "@/lib/media";
import { MediaCard, MediaCardSkeleton } from "@/components/media/MediaCard";
import { gridClass } from "@/components/media/MediaGrid";
import { MediaRail } from "@/components/media/Rail";
import { PersonCard } from "@/components/media/PersonCard";
import { Button, ButtonLink, Chip, Container, EmptyState, Skeleton, cx } from "@/components/ui/primitives";

type ResultFilter = "all" | "movie" | "tv" | "person";
type SortKey = "relevance" | "rating" | "newest";

const MAX_PAGES = 500;

const FILTERS: { value: ResultFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movies" },
    { value: "tv", label: "Series" },
    { value: "person", label: "People" },
];

const SORTS: { value: SortKey; label: string }[] = [
    { value: "relevance", label: "Relevance" },
    { value: "rating", label: "Rating" },
    { value: "newest", label: "Newest" },
];

const SUPPORTED = new Set(["movie", "tv", "person"]);
const dateOf = (item: MediaItem) => item.release_date || item.first_air_date || "";

const searchHref = (q: string, page = 1) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
};

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchFallback />}>
            <SearchContent />
        </Suspense>
    );
}

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = (searchParams.get("q") || "").trim();
    const page = Math.min(Math.max(Number(searchParams.get("page")) || 1, 1), MAX_PAGES);

    const [filter, setFilter] = useState<ResultFilter>("all");
    const [sort, setSort] = useState<SortKey>("relevance");

    const { data, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ["search", q, page],
        queryFn: () => tmdbService.searchMulti(q, page),
        enabled: q.length > 0,
        // Keep the previous page on screen while paging through the same query.
        placeholderData: (previous, previousQuery) => (previousQuery?.queryKey[1] === q ? previous : undefined),
        staleTime: 1000 * 60 * 5,
    });

    const { data: trending, isLoading: isLoadingTrending } = useQuery({
        queryKey: ["trending", "all", "day"],
        queryFn: () => tmdbService.getTrending("all", "day"),
        enabled: q.length === 0,
        staleTime: 1000 * 60 * 30,
    });

    const results = (data?.results || []).filter((item) => SUPPORTED.has(item.media_type || ""));
    const counts: Record<ResultFilter, number> = {
        all: results.length,
        movie: results.filter((r) => r.media_type === "movie").length,
        tv: results.filter((r) => r.media_type === "tv").length,
        person: results.filter((r) => r.media_type === "person").length,
    };

    const visible = results
        .filter((item) => filter === "all" || item.media_type === filter)
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
            if (sort === "rating") {
                // People have no rating; rank them by popularity after rated titles.
                const ra = a.item.media_type === "person" ? -1 : a.item.vote_average || 0;
                const rb = b.item.media_type === "person" ? -1 : b.item.vote_average || 0;
                return rb - ra || (b.item.popularity || 0) - (a.item.popularity || 0);
            }
            if (sort === "newest") return dateOf(b.item).localeCompare(dateOf(a.item)) || a.index - b.index;
            return a.index - b.index;
        })
        .map(({ item }) => item);

    const totalPages = Math.min(data?.total_pages || 0, MAX_PAGES);
    const totalResults = data?.total_results || 0;

    const goToPage = (next: number) => {
        router.push(searchHref(q, next), { scroll: false });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div>
            {/* Search header */}
            <section className="relative -mt-16 pt-16 border-line border-b overflow-hidden isolate">
                <div aria-hidden className="-z-10 absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgb(19_236_91/0.16),transparent_70%)]" />
                <Container className="pt-10 sm:pt-16 pb-8 sm:pb-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-2 font-semibold text-[11px] text-primary uppercase tracking-[0.14em]">Search</div>
                        <h1 className="font-display font-extrabold text-fg text-4xl sm:text-5xl tracking-tight">
                            {q ? (
                                <>
                                    Results for <span className="text-gradient">&ldquo;{q}&rdquo;</span>
                                </>
                            ) : (
                                <>
                                    Find it on <span className="text-gradient">any service</span>
                                </>
                            )}
                        </h1>
                        <p className="mt-3 text-fg-muted">Movies, series and people, with where to stream, rent or buy in your region.</p>
                        <SearchForm key={q} initial={q} onSubmit={(value) => router.replace(searchHref(value))} />
                    </div>
                </Container>
            </section>

            <Container className="pt-6">
                {!q ? (
                    <div className="flex flex-col gap-10 pt-4">
                        <MediaRail
                            eyebrow="Today"
                            title="Trending now"
                            subtitle="What everyone is searching for"
                            items={trending?.results.filter((r) => r.media_type === "movie" || r.media_type === "tv")}
                            isLoading={isLoadingTrending}
                        />
                    </div>
                ) : isError ? (
                    <EmptyState
                        icon={<SearchX size={28} />}
                        title="Search is unavailable"
                        description="We couldn't reach the catalogue right now. Check your connection and try again."
                        action={<Button onClick={() => refetch()}>Try again</Button>}
                    />
                ) : !isLoading && results.length === 0 ? (
                    <EmptyState
                        icon={<SearchX size={28} />}
                        title={`No results for “${q}”`}
                        description="Check the spelling, try a shorter title, or search for an actor or director instead."
                        action={
                            <ButtonLink href="/browse?type=movie">
                                <Compass size={16} />
                                Browse movies
                            </ButtonLink>
                        }
                    />
                ) : (
                    <>
                        {/* Toolbar */}
                        <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-3 mb-6">
                            <div role="group" aria-label="Filter results" className="flex gap-2 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto no-scrollbar">
                                {FILTERS.map((f) => (
                                    <Chip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
                                        {f.label}
                                        {!isLoading && <span className="opacity-60 tabular-nums">{counts[f.value]}</span>}
                                    </Chip>
                                ))}
                            </div>
                            <div className="flex justify-between md:justify-end items-center gap-3">
                                <p className="text-fg-subtle text-sm tabular-nums" aria-live="polite">
                                    {isLoading
                                        ? "Searching..."
                                        : `${totalResults.toLocaleString()} ${totalResults === 1 ? "result" : "results"}${totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}`}
                                </p>
                                <div className="relative shrink-0">
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value as SortKey)}
                                        aria-label="Sort results"
                                        className="bg-white/6 hover:bg-white/10 pr-9 pl-3.5 border border-line focus:border-primary/50 rounded-full outline-none h-9 font-medium text-fg text-sm transition-colors appearance-none cursor-pointer"
                                    >
                                        {SORTS.map((s) => (
                                            <option key={s.value} value={s.value} className="bg-surface-raised text-fg">
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={15} aria-hidden className="top-1/2 right-3 absolute text-fg-muted -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        {isLoading ? (
                            <div className={gridClass}>
                                {Array.from({ length: 14 }).map((_, i) => (
                                    <MediaCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : visible.length === 0 ? (
                            <EmptyState
                                icon={<SearchX size={28} />}
                                title={`No ${FILTERS.find((f) => f.value === filter)?.label.toLowerCase()} on this page`}
                                description="Try another filter, or check the next page of results."
                                action={<Button variant="outline" onClick={() => setFilter("all")}>Show all results</Button>}
                            />
                        ) : (
                            <div className={cx(gridClass, "transition-opacity", isFetching && "opacity-60")} aria-busy={isFetching}>
                                {visible.map((item) =>
                                    item.media_type === "person" ? (
                                        <PersonCard
                                            key={`person-${item.id}`}
                                            item={item}
                                            subtitle={personSubtitle(item)}
                                        />
                                    ) : (
                                        <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
                                    ),
                                )}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <Pagination page={page} totalPages={totalPages} onChange={goToPage} disabled={isFetching} />
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}

/** People results carry a known_for list; show their department plus a famous title. */
function personSubtitle(item: MediaItem) {
    const knownFor = (item as MediaItem & { known_for?: MediaItem[] }).known_for?.[0];
    return [item.known_for_department, knownFor ? mediaTitle(knownFor) : null].filter(Boolean).join(" · ") || "Person";
}

function SearchForm({ initial, onSubmit }: { initial: string; onSubmit: (value: string) => void }) {
    const [value, setValue] = useState(initial);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(value.trim());
    };

    return (
        <form role="search" onSubmit={submit} className="relative mt-8">
            <label htmlFor="search-input" className="sr-only">
                Search movies, series and people
            </label>
            <Search size={20} aria-hidden className="top-1/2 left-5 z-10 absolute text-fg-subtle -translate-y-1/2 pointer-events-none" />
            <input
                id="search-input"
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search movies, series, people..."
                autoComplete="off"
                autoFocus={!initial}
                enterKeyHint="search"
                className="bg-surface-dark/80 focus:bg-surface-raised shadow-2xl shadow-black/40 backdrop-blur-md pr-32 sm:pr-36 pl-13 border border-line-strong focus:border-primary/60 rounded-2xl outline-none focus:ring-4 focus:ring-primary/15 w-full h-14 sm:h-16 text-fg placeholder:text-fg-subtle text-base sm:text-lg transition-all [&::-webkit-search-cancel-button]:hidden"
            />
            <div className="top-1/2 right-2 absolute flex items-center gap-1 -translate-y-1/2">
                {value && (
                    <button
                        type="button"
                        onClick={() => setValue("")}
                        aria-label="Clear search"
                        className="flex justify-center items-center hover:bg-white/10 rounded-lg size-9 text-fg-muted hover:text-fg transition-colors"
                    >
                        <X size={17} />
                    </button>
                )}
                <Button type="submit" size="sm" className="sm:px-5 sm:h-11">
                    Search
                </Button>
            </div>
        </form>
    );
}

/** Page list with first/last anchors and a sliding window around the current page. */
function pageWindow(page: number, total: number): Array<number | "gap"> {
    const pages = new Set([1, total, page - 1, page, page + 1]);
    if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p));
    if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));
    const sorted = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const out: Array<number | "gap"> = [];
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) out.push("gap");
        out.push(p);
    });
    return out;
}

function Pagination({
    page,
    totalPages,
    onChange,
    disabled,
}: {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    disabled?: boolean;
}) {
    const itemClass = "flex justify-center items-center rounded-lg min-w-10 h-10 px-2 text-sm font-semibold tabular-nums transition-colors";

    return (
        <nav aria-label="Search results pages" className="flex justify-center items-center gap-1.5 mt-12">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1 || disabled}
                aria-label="Previous page"
                className="h-10"
            >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Prev</span>
            </Button>

            <ol className="flex items-center gap-1">
                {pageWindow(page, totalPages).map((p, i) =>
                    p === "gap" ? (
                        <li key={`gap-${i}`} aria-hidden className="px-1 text-fg-subtle">
                            &hellip;
                        </li>
                    ) : (
                        <li key={p} className={cx(Math.abs(p - page) > 1 && p !== 1 && p !== totalPages && "hidden sm:block")}>
                            <button
                                type="button"
                                onClick={() => onChange(p)}
                                disabled={disabled && p !== page}
                                aria-label={`Page ${p}`}
                                aria-current={p === page ? "page" : undefined}
                                className={cx(
                                    itemClass,
                                    p === page ? "bg-primary text-primary-ink" : "text-fg-muted hover:bg-white/8 hover:text-fg",
                                )}
                            >
                                {p}
                            </button>
                        </li>
                    ),
                )}
            </ol>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages || disabled}
                aria-label="Next page"
                className="h-10"
            >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
            </Button>
        </nav>
    );
}

function SearchFallback() {
    return (
        <Container className="pt-10 sm:pt-16">
            <div className="flex flex-col items-center gap-4 mx-auto max-w-3xl">
                <Skeleton className="rounded-md w-16 h-3" />
                <Skeleton className="w-2/3 h-12" />
                <Skeleton className="mt-6 rounded-2xl w-full h-16" />
            </div>
        </Container>
    );
}
