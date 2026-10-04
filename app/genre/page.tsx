"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Shapes } from "lucide-react";
import { tmdbService, type MediaType, type TMDBGenre } from "@/services/tmdbService";
import { useGenres } from "@/hooks/useProviders";
import { TmdbImage } from "@/components/media/TmdbImage";
import { Container, cx, PageHeader, Skeleton } from "@/components/ui/primitives";

// Changes on every page load so covers feel fresh.
const seed = Date.now();

function GenreTile({ genre, type, featured }: { genre: TMDBGenre; type: MediaType; featured?: boolean }) {
    const { data: covers } = useQuery({
        queryKey: ["genreCover", type, genre.id],
        queryFn: async () => (await tmdbService.discover(type, { genreIds: [genre.id], minVotes: type === "tv" ? 200 : 1000 })).results,
        staleTime: 1000 * 60 * 60 * 24,
    });

    const cover = useMemo(() => {
        const withArt = (covers || []).filter((c) => c.backdrop_path);
        return withArt.length ? withArt[(genre.id + seed) % withArt.length] : null;
    }, [covers, genre.id]);

    return (
        <Link
            href={`/browse?type=${type}&genre=${genre.id}`}
            className={cx(
                "group/genre relative bg-surface-raised rounded-2xl ring-1 ring-line hover:ring-primary/50 overflow-hidden transition-all hover:-translate-y-0.5",
                featured ? "sm:col-span-2 sm:row-span-2 aspect-video sm:aspect-auto min-h-40" : "aspect-video",
            )}
        >
            {cover ? (
                <TmdbImage path={cover.backdrop_path} size="w780" alt="" className="group-hover/genre:scale-105 transition-transform duration-700 ease-out-expo" />
            ) : (
                <div className="absolute inset-0 skeleton" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/5" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between items-end gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                    <h3 className={cx("font-display font-bold text-white", featured ? "text-2xl sm:text-4xl" : "text-lg sm:text-xl")}>{genre.name}</h3>
                    {cover && <p className="mt-0.5 text-white/60 text-xs truncate">Featuring {cover.title || cover.name}</p>}
                </div>
                <span className="flex justify-center items-center bg-white/15 group-hover/genre:bg-primary backdrop-blur-md rounded-full size-9 text-white group-hover/genre:text-primary-ink transition-colors shrink-0">
                    <ArrowUpRight size={16} />
                </span>
            </div>
        </Link>
    );
}

export default function GenresPage() {
    const [type, setType] = useState<MediaType>("movie");
    const { data, isLoading } = useGenres(type);
    const genres = data?.genres || [];

    return (
        <Container>
            <PageHeader
                eyebrow="Explore"
                icon={<Shapes size={22} />}
                title="Genres"
                description="Jump into a mood. Every genre opens the full catalogue, filterable by the services you use."
                actions={
                    <div role="tablist" aria-label="Media type" className="flex bg-white/5 p-1 border border-line rounded-xl">
                        {(["movie", "tv"] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                role="tab"
                                aria-selected={type === t}
                                onClick={() => setType(t)}
                                className={cx(
                                    "px-4 rounded-lg h-9 font-semibold text-sm transition-colors",
                                    type === t ? "bg-surface-hover text-fg" : "text-fg-muted hover:text-fg",
                                )}
                            >
                                {t === "movie" ? "Movies" : "Series"}
                            </button>
                        ))}
                    </div>
                }
            />

            <div className="gap-3 sm:gap-4 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 grid-flow-dense">
                {isLoading
                    ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="rounded-2xl aspect-video" />)
                    : genres.map((g, i) => <GenreTile key={`${type}-${g.id}`} genre={g} type={type} featured={i === 0 || i === 7} />)}
            </div>
        </Container>
    );
}
