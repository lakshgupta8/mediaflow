"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CornerDownLeft, Film, Loader2, Search, TrendingUp, Tv, User, X } from "lucide-react";
import { tmdbService, type MediaItem } from "@/services/tmdbService";
import { mediaHref, mediaTitle, mediaYear, tmdbImage } from "@/lib/media";
import { cx } from "@/components/ui/primitives";

const RECENT_KEY = "mediaflow:recent-searches";

function readRecent(): string[] {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") as string[];
    } catch {
        return [];
    }
}

function saveRecent(query: string) {
    try {
        const next = [query, ...readRecent().filter((q) => q.toLowerCase() !== query.toLowerCase())].slice(0, 6);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
        // ignore storage failures
    }
}

function useDebounced<T>(value: T, delay = 250) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

const itemHref = (item: MediaItem) => (item.media_type === "person" ? `/people/${item.id}` : mediaHref(item));

interface SearchCommandProps {
    open: boolean;
    onClose: () => void;
}

/** Spotlight-style search: live results, keyboard navigation, recent searches. */
export function SearchCommand({ open, onClose }: SearchCommandProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const [recent, setRecent] = useState<string[]>([]);
    const debounced = useDebounced(query.trim());

    const { data, isFetching } = useQuery({
        queryKey: ["search-command", debounced],
        queryFn: () => tmdbService.searchMulti(debounced),
        enabled: open && debounced.length > 1,
        staleTime: 1000 * 60 * 5,
    });

    const { data: trending } = useQuery({
        queryKey: ["trending", "all", "day"],
        queryFn: () => tmdbService.getTrending("all", "day"),
        enabled: open,
    });

    const results = useMemo(
        () => (debounced.length > 1 ? (data?.results || []).filter((r) => r.media_type !== "person" || r.profile_path).slice(0, 8) : []),
        [data, debounced],
    );
    const suggestions = useMemo(() => (trending?.results || []).slice(0, 5), [trending]);
    const list = debounced.length > 1 ? results : suggestions;

    useEffect(() => {
        if (!open) return;
        setRecent(readRecent());
        setQuery("");
        setActive(0);
        const t = setTimeout(() => inputRef.current?.focus(), 10);
        document.body.style.overflow = "hidden";
        return () => {
            clearTimeout(t);
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => setActive(0), [debounced]);

    if (!open) return null;

    const go = (href: string) => {
        if (query.trim()) saveRecent(query.trim());
        onClose();
        router.push(href);
    };

    const submitFullSearch = (q = query.trim()) => {
        if (!q) return;
        saveRecent(q);
        onClose();
        router.push(`/search?q=${encodeURIComponent(q)}`);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, list.length));
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        }
        if (e.key === "Enter") {
            e.preventDefault();
            const item = list[active];
            if (item && active < list.length) go(itemHref(item));
            else submitFullSearch();
        }
    };

    return (
        <div className="z-100 fixed inset-0 flex justify-center items-start px-3 pt-[10vh] sm:pt-[14vh]" role="dialog" aria-modal aria-label="Search">
            <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

            <div className="relative bg-surface-dark shadow-2xl shadow-black/70 border border-line-strong rounded-2xl w-full max-w-2xl overflow-hidden animate-fade-in" onKeyDown={onKeyDown}>
                <div className="flex items-center gap-3 px-4 border-line border-b">
                    {isFetching ? <Loader2 size={18} className="text-primary animate-spin" /> : <Search size={18} className="text-fg-subtle" />}
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search movies, series and people"
                        className="bg-transparent py-4 outline-none w-full text-fg placeholder:text-fg-subtle text-base"
                        aria-autocomplete="list"
                        aria-controls="search-command-list"
                    />
                    {query ? (
                        <button type="button" onClick={() => setQuery("")} aria-label="Clear" className="text-fg-subtle hover:text-fg">
                            <X size={16} />
                        </button>
                    ) : (
                        <kbd className="hidden sm:inline px-1.5 py-0.5 border border-line rounded font-sans text-[11px] text-fg-subtle">ESC</kbd>
                    )}
                </div>

                <div id="search-command-list" className="py-2 max-h-[60vh] overflow-y-auto">
                    {debounced.length <= 1 && recent.length > 0 && (
                        <div className="px-2 pb-2">
                            <p className="px-3 py-2 font-semibold text-[11px] text-fg-subtle uppercase tracking-wider">Recent</p>
                            <div className="flex flex-wrap gap-2 px-3">
                                {recent.map((q) => (
                                    <button
                                        key={q}
                                        type="button"
                                        onClick={() => setQuery(q)}
                                        className="bg-white/5 hover:bg-white/10 px-3 py-1.5 border border-line rounded-lg text-fg-muted hover:text-fg text-sm transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="flex items-center gap-1.5 px-5 py-2 font-semibold text-[11px] text-fg-subtle uppercase tracking-wider">
                        {debounced.length > 1 ? "Top results" : <><TrendingUp size={12} /> Trending today</>}
                    </p>

                    {debounced.length > 1 && !isFetching && results.length === 0 && (
                        <p className="px-5 py-8 text-fg-subtle text-sm text-center">No matches for “{debounced}”.</p>
                    )}

                    <ul role="listbox" className="px-2">
                        {list.map((item, i) => {
                            const isPerson = item.media_type === "person";
                            const img = tmdbImage(isPerson ? item.profile_path : item.poster_path, "w92");
                            const Icon = isPerson ? User : item.media_type === "tv" ? Tv : Film;
                            return (
                                <li key={`${item.media_type}-${item.id}`} role="option" aria-selected={active === i}>
                                    <button
                                        type="button"
                                        onMouseEnter={() => setActive(i)}
                                        onClick={() => go(itemHref(item))}
                                        className={cx(
                                            "flex items-center gap-3 px-3 py-2 rounded-xl w-full text-left transition-colors",
                                            active === i ? "bg-white/8" : "hover:bg-white/5",
                                        )}
                                    >
                                        <span
                                            className="bg-surface-raised bg-cover bg-center rounded-md w-9 h-13 shrink-0"
                                            style={img ? { backgroundImage: `url('${img}')` } : undefined}
                                        />
                                        <span className="flex-1 min-w-0">
                                            <span className="block font-medium text-fg text-sm truncate">{mediaTitle(item)}</span>
                                            <span className="flex items-center gap-1.5 mt-0.5 text-fg-subtle text-xs">
                                                <Icon size={12} />
                                                {isPerson ? item.known_for_department || "Person" : item.media_type === "tv" ? "Series" : "Movie"}
                                                {!isPerson && mediaYear(item) && <> · {mediaYear(item)}</>}
                                            </span>
                                        </span>
                                        {active === i && <CornerDownLeft size={14} className="text-fg-subtle" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {debounced.length > 1 && (
                        <div className="px-2 pt-1">
                            <button
                                type="button"
                                onMouseEnter={() => setActive(list.length)}
                                onClick={() => submitFullSearch()}
                                className={cx(
                                    "flex justify-between items-center px-3 py-3 rounded-xl w-full text-primary-light text-sm transition-colors",
                                    active === list.length ? "bg-primary/10" : "hover:bg-white/5",
                                )}
                            >
                                <span>See all results for “{debounced}”</span>
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex items-center gap-4 bg-white/2 px-4 py-2.5 border-line border-t text-[11px] text-fg-subtle">
                    <span><kbd className="font-sans">↑↓</kbd> to navigate</span>
                    <span><kbd className="font-sans">↵</kbd> to open</span>
                    <span><kbd className="font-sans">esc</kbd> to close</span>
                </div>
            </div>
        </div>
    );
}
