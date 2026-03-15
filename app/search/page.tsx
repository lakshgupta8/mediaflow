"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { MovieCard } from '@/components/MovieCard';
import { Search, LayoutGrid, List, ChevronLeft, ChevronRight, SlidersHorizontal, TrendingUp, X, User } from 'lucide-react';
import { Suspense, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { PersonCard } from '@/components/PersonCard';

type FilterType = 'all' | 'movie' | 'tv' | 'person';
type SortType = 'relevance' | 'rating' | 'year';
type ViewMode = 'grid' | 'list';

const FILTERS: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Movies', value: 'movie' },
    { label: 'TV Shows', value: 'tv' },
    { label: 'People', value: 'person' },
];

const SORT_OPTIONS: { label: string; value: SortType }[] = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Rating', value: 'rating' },
    { label: 'Year', value: 'year' },
];

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q') || '';

    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortType>('relevance');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const { data: searchResults, isLoading } = useQuery({
        queryKey: ['search', query, currentPage],
        queryFn: () => tmdbService.searchMulti(query, currentPage),
        enabled: !!query,
    });

    const totalPages = searchResults?.total_pages
        ? Math.min(searchResults.total_pages, 500)
        : 1;
    const totalResults = searchResults?.total_results || 0;

    // Filter results by media type
    const filteredResults = useMemo(() => {
        const results = searchResults?.results || [];
        if (activeFilter === 'all') return results;
        return results.filter(item => item.media_type === activeFilter);
    }, [searchResults, activeFilter]);

    // Sort results
    const sortedResults = useMemo(() => {
        const items = [...filteredResults];
        switch (sortBy) {
            case 'rating':
                return items.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
            case 'year': {
                const getYear = (item: typeof items[0]) => {
                    const d = item.release_date || item.first_air_date || '';
                    return d ? new Date(d).getFullYear() : 0;
                };
                return items.sort((a, b) => getYear(b) - getYear(a));
            }
            default:
                return items;
        }
    }, [filteredResults, sortBy]);

    const handleFilterChange = useCallback((filter: FilterType) => {
        setActiveFilter(filter);
    }, []);

    const handleSortChange = useCallback((sort: SortType) => {
        setSortBy(sort);
        setShowSortDropdown(false);
    }, []);

    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [totalPages]);

    // Build visible page numbers
    const pageNumbers = useMemo(() => {
        const pages: (number | 'ellipsis')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('ellipsis');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('ellipsis');
            pages.push(totalPages);
        }
        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="flex flex-col gap-0 px-8 pt-24 pb-8 w-full min-h-[80vh]">
            {/* Search hero section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex justify-center items-center bg-primary/10 rounded-xl w-10 h-10">
                        <Search size={20} className="text-primary" />
                    </div>
                    <div>
                        {query ? (
                            <>
                                <h1 className="font-bold text-white text-2xl">
                                    Results for <span className="text-primary">&quot;{query}&quot;</span>
                                </h1>
                                <p className="text-slate-400 text-sm">
                                    {isLoading ? 'Searching...' : `${totalResults.toLocaleString()} results found`}
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="font-bold text-white text-2xl">Search</h1>
                                <p className="text-slate-400 text-sm">Discover movies, TV shows, and more</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters & Controls bar */}
            {query && (
                <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 bg-surface-dark/60 backdrop-blur-md mb-6 px-4 py-3 border border-white/5 rounded-2xl">
                    {/* Filter pills */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => handleFilterChange(f.value)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                    activeFilter === f.value
                                        ? 'bg-primary text-background-dark shadow-[0_0_12px_rgba(19,236,91,0.3)]'
                                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Right-side controls */}
                    <div className="flex items-center gap-3">
                        {/* Sort dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-slate-300 text-sm transition-colors"
                            >
                                <SlidersHorizontal size={14} />
                                <span className="hidden sm:inline">{SORT_OPTIONS.find(s => s.value === sortBy)?.label}</span>
                            </button>
                            {showSortDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                                    <div className="right-0 z-50 absolute bg-surface-dark shadow-2xl mt-2 py-1 border border-white/10 rounded-xl min-w-[160px] overflow-hidden">
                                        {SORT_OPTIONS.map(s => (
                                            <button
                                                key={s.value}
                                                onClick={() => handleSortChange(s.value)}
                                                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                                                    sortBy === s.value
                                                        ? 'text-primary bg-primary/10'
                                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="bg-white/10 w-px h-6" />

                        {/* View toggle */}
                        <div className="flex items-center bg-white/5 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 transition-colors ${
                                    viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white'
                                }`}
                                title="Grid view"
                            >
                                <LayoutGrid size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 transition-colors ${
                                    viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:text-white'
                                }`}
                                title="List view"
                            >
                                <List size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content area */}
            {isLoading ? (
                /* Loading skeleton */
                <div className="gap-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-pulse">
                    {[...Array(18)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="bg-white/5 rounded-xl w-full aspect-2/3" />
                            <div className="bg-white/5 rounded w-3/4 h-3" />
                            <div className="bg-white/5 rounded w-1/2 h-3" />
                        </div>
                    ))}
                </div>
            ) : sortedResults.length > 0 ? (
                <>
                    {/* Grid View */}
                    {viewMode === 'grid' ? (
                        <div className="gap-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {sortedResults.map((item) => (
                                item.media_type === 'person' ? (
                                    <PersonCard key={`person-${item.id}`} item={item} />
                                ) : (
                                    <MovieCard key={`${item.media_type}-${item.id}`} item={item} fillWidth />
                                )
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div className="flex flex-col gap-3">
                            {sortedResults.map((item) => {
                                const title = item.title || item.name || 'Unknown';
                                const releaseDate = item.release_date || item.first_air_date || '';
                                const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
                                const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
                                const isPerson = item.media_type === 'person';
                                const href = isPerson 
                                    ? `/people/${item.id}` 
                                    : `/${item.media_type === 'tv' ? 'series' : 'movie'}/${item.id}`;
                                const displayImage = isPerson 
                                    ? (item.profile_path ? `${TMDB_IMAGE_BASE}${item.profile_path}` : '')
                                    : (item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : '');

                                return (
                                    <Link
                                        key={`list-${item.media_type}-${item.id}`}
                                        href={href}
                                        className="group flex gap-4 bg-surface-dark/40 hover:bg-surface-dark/70 p-3 border border-white/5 hover:border-primary/30 rounded-xl transition-all duration-200"
                                    >
                                        {/* Poster/Profile */}
                                        <div
                                            className="shrink-0 bg-white/5 bg-cover bg-center rounded-lg w-16 h-24"
                                            style={displayImage ? { backgroundImage: `url('${displayImage}')` } : {}}
                                        >
                                            {!displayImage && isPerson && (
                                                <div className="flex justify-center items-center w-full h-full">
                                                    <User size={24} className="text-slate-600" />
                                                </div>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="flex flex-col flex-1 justify-center gap-1 min-w-0">
                                            <h3 className="font-semibold text-white group-hover:text-primary truncate transition-colors">
                                                {title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-slate-400 text-xs">
                                                <span className="bg-white/10 px-2 py-0.5 rounded text-xs uppercase">
                                                    {item.media_type === 'tv' ? 'TV' : item.media_type === 'person' ? 'Person' : 'Movie'}
                                                </span>
                                                {year && <span>{year}</span>}
                                                {rating && (
                                                    <span className="flex items-center gap-1 text-yellow-400">
                                                        ★ {rating}
                                                    </span>
                                                )}
                                            </div>
                                            {item.overview && (
                                                <p className="text-slate-500 text-xs line-clamp-2">
                                                    {item.overview}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 px-3 py-2 rounded-lg text-slate-300 text-sm disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>

                            {pageNumbers.map((p, i) =>
                                p === 'ellipsis' ? (
                                    <span key={`e-${i}`} className="px-2 text-slate-500">…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                                            currentPage === p
                                                ? 'bg-primary text-background-dark shadow-[0_0_12px_rgba(19,236,91,0.3)]'
                                                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 px-3 py-2 rounded-lg text-slate-300 text-sm disabled:cursor-not-allowed transition-colors"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            ) : query ? (
                /* Empty state */
                <div className="flex flex-col flex-1 justify-center items-center py-20 min-h-[50vh]">
                    <div className="flex justify-center items-center bg-white/5 mb-6 rounded-full w-24 h-24">
                        <Search size={40} className="text-slate-500" />
                    </div>
                    <h2 className="mb-2 font-bold text-white text-2xl">No results found</h2>
                    <p className="mb-8 max-w-md text-center text-slate-400">
                        We couldn&apos;t find anything matching &quot;{query}&quot;. Try adjusting your search or explore what&apos;s trending.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl text-slate-300 text-sm transition-colors"
                        >
                            <X size={16} /> Clear Filters
                        </button>
                        <Link
                            href="/"
                            className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(19,236,91,0.25)] px-5 py-2.5 rounded-xl font-semibold text-background-dark text-sm transition-all"
                        >
                            <TrendingUp size={16} /> Browse Trending
                        </Link>
                    </div>
                </div>
            ) : (
                /* No query — initial state */
                <div className="flex flex-col flex-1 justify-center items-center py-20 min-h-[50vh]">
                    <div className="flex justify-center items-center bg-primary/10 mb-6 rounded-full w-24 h-24">
                        <Search size={40} className="text-primary/50" />
                    </div>
                    <h2 className="mb-2 font-bold text-white text-2xl">Start searching</h2>
                    <p className="max-w-md text-center text-slate-400">
                        Use the search bar above to find your favorite movies, TV shows, and more.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col gap-4 px-8 pt-24 pb-8 animate-pulse">
                <div className="bg-white/5 rounded-xl w-64 h-8" />
                <div className="bg-white/5 rounded-xl w-48 h-4" />
                <div className="gap-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-8">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-white/5 rounded-xl w-full aspect-2/3" />
                    ))}
                </div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
