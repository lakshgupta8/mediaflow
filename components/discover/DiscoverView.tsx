"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowDownWideNarrow, Check, ChevronDown, Layers, Loader2, SearchX, Sparkles, X } from "lucide-react";
import { tmdbService, type DiscoverSort, type MediaType, type Monetization } from "@/services/tmdbService";
import { useGenres, usePreferences, useProviderCatalog } from "@/hooks/useProviders";
import { useClickOutside } from "@/hooks/useClickOutside";
import { regionName } from "@/lib/media";
import { MediaCard, MediaCardSkeleton } from "@/components/media/MediaCard";
import { gridClass } from "@/components/media/MediaGrid";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Button, Chip, cx, EmptyState } from "@/components/ui/primitives";

export type Availability = "any" | "stream" | "free" | "rent" | "buy";

const AVAILABILITY: { value: Availability; label: string; types?: Monetization[] }[] = [
    { value: "any", label: "Any" },
    { value: "stream", label: "Stream", types: ["flatrate"] },
    { value: "free", label: "Free", types: ["free", "ads"] },
    { value: "rent", label: "Rent", types: ["rent"] },
    { value: "buy", label: "Buy", types: ["buy"] },
];

const SORTS: { value: DiscoverSort; label: string }[] = [
    { value: "popularity.desc", label: "Most popular" },
    { value: "primary_release_date.desc", label: "Newest" },
    { value: "vote_average.desc", label: "Highest rated" },
];

const parseIds = (value: string | null) =>
    (value || "").split(",").map(Number).filter((n) => Number.isFinite(n) && n > 0);

function SourcesFilter({ selected, onChange }: { selected: number[]; onChange: (ids: number[]) => void }) {
    const { myProviders } = usePreferences();
    const { data: catalog = [] } = useProviderCatalog();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, () => setOpen(false), open);

    const chosen = catalog.filter((p) => selected.includes(p.provider_id));
    const list = catalog.filter((p) => p.provider_name.toLowerCase().includes(query.trim().toLowerCase()));
    const onlyMine = myProviders.length > 0 && selected.length === myProviders.length && myProviders.every((id) => selected.includes(id));

    const toggle = (id: number) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className={cx(
                    "inline-flex items-center gap-2 px-3.5 border rounded-full h-9 font-medium text-sm transition-colors",
                    selected.length ? "bg-primary/12 border-primary/40 text-fg" : "bg-white/6 border-line text-fg-muted hover:text-fg",
                )}
            >
                {chosen.length ? (
                    <span className="flex -space-x-1.5">
                        {chosen.slice(0, 3).map((p) => (
                            <ProviderLogo key={p.provider_id} name={p.provider_name} logoPath={p.logo_path} size={20} className="ring-2 ring-surface-dark" />
                        ))}
                    </span>
                ) : (
                    <Layers size={15} />
                )}
                {selected.length ? `${selected.length} source${selected.length > 1 ? "s" : ""}` : "All sources"}
                <ChevronDown size={14} className={cx("transition-transform", open && "rotate-180")} />
            </button>

            {open && (
                <div className="left-0 z-40 absolute bg-surface-dark shadow-2xl shadow-black/60 mt-2 border border-line-strong rounded-2xl w-[min(92vw,340px)] overflow-hidden animate-fade-in">
                    <div className="space-y-2 p-3 border-line border-b">
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Filter services"
                            aria-label="Filter services"
                            className="bg-surface-raised px-3 border border-line focus:border-primary/50 rounded-lg outline-none w-full h-9 text-fg placeholder:text-fg-subtle text-sm"
                        />
                        <div className="flex gap-2">
                            {myProviders.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => onChange(onlyMine ? [] : myProviders)}
                                    className={cx(
                                        "flex flex-1 justify-center items-center gap-1.5 border rounded-lg h-8 font-semibold text-xs transition-colors",
                                        onlyMine ? "bg-primary text-primary-ink border-primary" : "border-line text-fg-muted hover:text-fg",
                                    )}
                                >
                                    <Sparkles size={12} /> My services
                                </button>
                            )}
                            {selected.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => onChange([])}
                                    className="flex flex-1 justify-center items-center gap-1.5 border border-line rounded-lg h-8 font-semibold text-fg-muted hover:text-fg text-xs"
                                >
                                    <X size={12} /> Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <ul className="p-1.5 max-h-72 overflow-y-auto">
                        {list.map((p) => {
                            const on = selected.includes(p.provider_id);
                            return (
                                <li key={p.provider_id}>
                                    <button
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => toggle(p.provider_id)}
                                        className="flex items-center gap-3 hover:bg-white/5 px-2.5 py-2 rounded-xl w-full text-left transition-colors"
                                    >
                                        <ProviderLogo name={p.provider_name} logoPath={p.logo_path} size={28} />
                                        <span className="flex-1 text-fg text-sm truncate">{p.provider_name}</span>
                                        <span className={cx("flex justify-center items-center border rounded-md size-5", on ? "bg-primary border-primary text-primary-ink" : "border-line-strong")}>
                                            {on && <Check size={12} strokeWidth={3} />}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

interface DiscoverViewProps {
    /** Locks results to one provider (source pages). */
    fixedProviderId?: number;
    /** Hide the Movies/Series switch and use this type. */
    defaultType?: MediaType;
    /** Rendered above the filter bar; receives the active type. */
    header?: (type: MediaType, setType: (t: MediaType) => void) => React.ReactNode;
    /** Always-on filters for a curated section (e.g. anime), invisible to the user's filter chips. */
    preset?: {
        genreIds?: readonly number[];
        originalLanguage?: string;
        withoutKeywords?: readonly number[];
        /** Vote floor for the default popularity sort, to keep obscure or adult-leaning titles out. */
        minVotes?: number;
    };
}

/**
 * Filterable, infinitely scrolling catalogue. All filters live in the URL
 * (`type`, `genre`, `providers`, `avail`, `sort`) so views are shareable.
 */
export function DiscoverView({ fixedProviderId, defaultType = "movie", header, preset }: DiscoverViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const { region, hydrated } = usePreferences();

    const type: MediaType = params.get("type") === "tv" ? "tv" : params.get("type") === "movie" ? "movie" : defaultType;
    const genreIds = parseIds(params.get("genre"));
    const providerIds = fixedProviderId ? [fixedProviderId] : parseIds(params.get("providers"));
    const avail = (AVAILABILITY.find((a) => a.value === params.get("avail"))?.value || "any") as Availability;
    const sort = (SORTS.find((s) => s.value === params.get("sort"))?.value || "popularity.desc") as DiscoverSort;
    const monetization = AVAILABILITY.find((a) => a.value === avail)?.types;

    const { data: genreData } = useGenres(type);
    const presetGenres = preset?.genreIds || [];
    const genres = (genreData?.genres || []).filter((g) => !presetGenres.includes(g.id));
    const queryGenres = [...presetGenres, ...genreIds];
    const minVotes = preset?.minVotes && sort === "popularity.desc" ? preset.minVotes : undefined;

    const update = (patch: Record<string, string | null>) => {
        const next = new URLSearchParams(params.toString());
        Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    };

    const setType = (t: MediaType) => update({ type: t, genre: null });

    const query = useInfiniteQuery({
        queryKey: ["discover", type, { genreIds: queryGenres, providerIds, monetization, sort, region, lang: preset?.originalLanguage, without: preset?.withoutKeywords, minVotes }],
        queryFn: ({ pageParam }) =>
            tmdbService.discover(type, {
                page: pageParam,
                genreIds: queryGenres,
                providerIds,
                monetization,
                sortBy: sort,
                region,
                originalLanguage: preset?.originalLanguage,
                withoutKeywords: preset?.withoutKeywords,
                minVotes,
            }),
        initialPageParam: 1,
        getNextPageParam: (last) => (last.page < Math.min(last.total_pages, 500) ? last.page + 1 : undefined),
        enabled: hydrated,
    });

    const items = useMemo(() => {
        const seen = new Set<number>();
        return (query.data?.pages.flatMap((p) => p.results) || []).filter((item) => {
            if (seen.has(item.id) || !item.poster_path) return false;
            seen.add(item.id);
            return true;
        });
    }, [query.data]);

    const total = query.data?.pages[0]?.total_results ?? 0;

    // Auto-load the next page when the sentinel scrolls into view.
    const sentinel = useRef<HTMLDivElement>(null);
    const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
    useEffect(() => {
        const el = sentinel.current;
        if (!el || !hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingNextPage) fetchNextPage();
            },
            { rootMargin: "800px 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const hasFilters = genreIds.length > 0 || (!fixedProviderId && providerIds.length > 0) || avail !== "any" || sort !== "popularity.desc";
    const loading = !hydrated || query.isLoading;

    return (
        <div>
            {header?.(type, setType)}

            {/* Filter bar */}
            <div className="top-16 z-30 sticky -mx-4 sm:-mx-6 lg:-mx-10 mb-6 px-4 sm:px-6 lg:px-10 py-3 glass border-line border-b">
                <div className="flex flex-wrap items-center gap-2">
                    {!fixedProviderId && (
                        <SourcesFilter
                            selected={providerIds}
                            onChange={(ids) => update({ providers: ids.length ? ids.join(",") : null })}
                        />
                    )}

                    <div role="group" aria-label="Availability" className="flex items-center gap-1 bg-white/4 p-1 border border-line rounded-full">
                        {AVAILABILITY.map((a) => (
                            <button
                                key={a.value}
                                type="button"
                                aria-pressed={avail === a.value}
                                onClick={() => update({ avail: a.value === "any" ? null : a.value })}
                                className={cx(
                                    "px-3 rounded-full h-7 font-medium text-xs transition-colors",
                                    avail === a.value ? "bg-fg text-background-dark" : "text-fg-muted hover:text-fg",
                                )}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>

                    <label className="relative flex items-center">
                        <span className="sr-only">Sort by</span>
                        <ArrowDownWideNarrow size={15} className="left-3 absolute text-fg-muted pointer-events-none" />
                        <select
                            value={sort}
                            onChange={(e) => update({ sort: e.target.value === "popularity.desc" ? null : e.target.value })}
                            className="bg-white/6 hover:bg-white/10 pr-8 pl-9 border border-line rounded-full h-9 font-medium text-fg text-sm transition-colors appearance-none cursor-pointer"
                        >
                            {SORTS.map((s) => (
                                <option key={s.value} value={s.value} className="bg-surface-dark">
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="right-3 absolute text-fg-muted pointer-events-none" />
                    </label>

                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full"
                            onClick={() => update({ genre: null, providers: null, avail: null, sort: null })}
                        >
                            <X size={14} /> Reset
                        </Button>
                    )}

                    <p className="hidden sm:block ml-auto text-fg-subtle text-xs">
                        {loading ? "Loading…" : `${total.toLocaleString()} titles`}
                        {(providerIds.length > 0 || avail !== "any") && ` · ${regionName(region)}`}
                    </p>
                </div>

                {genres.length > 0 && (
                    <div className="flex gap-2 mt-3 -mx-1 px-1 overflow-x-auto no-scrollbar">
                        <Chip active={genreIds.length === 0} onClick={() => update({ genre: null })}>
                            All genres
                        </Chip>
                        {genres.map((g) => {
                            const on = genreIds.includes(g.id);
                            return (
                                <Chip
                                    key={g.id}
                                    active={on}
                                    onClick={() => {
                                        const next = on ? genreIds.filter((id) => id !== g.id) : [...genreIds, g.id];
                                        update({ genre: next.length ? next.join(",") : null });
                                    }}
                                >
                                    {g.name}
                                </Chip>
                            );
                        })}
                    </div>
                )}
            </div>

            {loading ? (
                <div className={gridClass}>
                    {Array.from({ length: 21 }).map((_, i) => <MediaCardSkeleton key={i} />)}
                </div>
            ) : items.length === 0 ? (
                <EmptyState
                    icon={<SearchX size={26} />}
                    title="Nothing matches these filters"
                    description={`Try another source, availability or genre. Availability is for ${regionName(region)}.`}
                    action={
                        hasFilters ? (
                            <Button variant="outline" onClick={() => update({ genre: null, providers: null, avail: null, sort: null })}>
                                Reset filters
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                <>
                    <div className={gridClass}>
                        {items.map((item) => (
                            <MediaCard key={item.id} item={item} />
                        ))}
                        {isFetchingNextPage && Array.from({ length: 7 }).map((_, i) => <MediaCardSkeleton key={`more-${i}`} />)}
                    </div>
                    <div ref={sentinel} className="flex justify-center py-10">
                        {hasNextPage ? (
                            <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                                {isFetchingNextPage ? <Loader2 size={16} className="animate-spin" /> : null}
                                {isFetchingNextPage ? "Loading" : "Load more"}
                            </Button>
                        ) : (
                            <p className="text-fg-subtle text-sm">You&apos;ve reached the end.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
