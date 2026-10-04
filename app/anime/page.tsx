"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Tv, Clapperboard } from "lucide-react";
import { ANIME_PRESET, tmdbService, type DiscoverParams, type MediaType } from "@/services/tmdbService";
import { usePreferences, useProviderCatalog } from "@/hooks/useProviders";
import { mediaHref, mediaTitle, regionName } from "@/lib/media";
import { DiscoverView } from "@/components/discover/DiscoverView";
import { MediaRail } from "@/components/media/Rail";
import { TmdbImage } from "@/components/media/TmdbImage";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { ButtonLink, Container, cx, SectionHeader, Skeleton } from "@/components/ui/primitives";

/** Services that carry a lot of anime, in display order. Only those available in the region are shown. */
const ANIME_SERVICES = [283, 430, 1968, 8, 119, 337, 2336, 15, 1899, 232];

/** Vote floor that keeps obscure and adult-leaning titles out of popularity lists. */
const POPULAR_FLOOR = 50;

const isoDay = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
};

/** New series that premiered within ~5 months and have an episode airing around now. */
const SEASONAL: DiscoverParams = { airDateFrom: isoDay(-14), airDateTo: isoDay(7), firstAirDateFrom: isoDay(-150), minVotes: 3 };

function useAnime(key: string, type: MediaType, params: DiscoverParams, enabled = true) {
    return useQuery({
        queryKey: ["anime", key, type, params],
        queryFn: async () =>
            (await tmdbService.discover(type, { ...ANIME_PRESET, ...params, genreIds: [...ANIME_PRESET.genreIds] }))
                .results.filter((r) => r.poster_path),
        staleTime: 1000 * 60 * 30,
        enabled,
    });
}

function AnimeHero() {
    const { region, hydrated } = usePreferences();
    const { data: catalog = [], isLoading: loadingCatalog } = useProviderCatalog();
    const airing = useAnime("airing", "tv", SEASONAL);

    const featured = airing.data?.find((a) => a.backdrop_path);
    const services = useMemo(
        () =>
            ANIME_SERVICES.map((id) => catalog.find((p) => p.provider_id === id)).filter(
                (p): p is NonNullable<typeof p> => p !== undefined,
            ),
        [catalog],
    );

    return (
        <section className="relative -mt-16 pt-16 overflow-hidden">
            <div className="absolute inset-0">
                {featured ? (
                    <TmdbImage path={featured.backdrop_path} size="w1280" alt="" priority className="object-[center_25%]" />
                ) : (
                    <div className="absolute inset-0 skeleton" />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-background-dark via-background-dark/85 to-background-dark/30" />
                <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-black/50" />
            </div>

            <Container className="relative pt-20 sm:pt-28 pb-10">
                <div className="max-w-2xl">
                    <p className="flex items-center gap-2 mb-3 font-semibold text-[11px] text-primary uppercase tracking-[0.14em]">
                        <Sparkles size={13} /> Anime
                    </p>
                    <h1 className="font-display font-extrabold text-fg text-4xl sm:text-6xl text-balance leading-[0.98] tracking-tight">
                        Simulcasts, classics and films. <span className="text-gradient">All in one place.</span>
                    </h1>
                    <p className="mt-4 max-w-xl text-fg-muted text-base sm:text-lg">
                        Track what&apos;s airing this season and see which service streams it in {regionName(region)}.
                    </p>
                    {featured && (
                        <Link href={mediaHref(featured)} className="inline-flex items-center gap-2 mt-5 font-medium text-fg-muted hover:text-primary text-sm transition-colors">
                            <span className="bg-primary rounded-full size-1.5 animate-pulse" />
                            Now airing: <span className="font-semibold text-fg">{mediaTitle(featured)}</span>
                        </Link>
                    )}
                </div>

                <div className="mt-10">
                    <p className="mb-3 font-medium text-fg-subtle text-xs uppercase tracking-wider">Where anime streams in {regionName(region)}</p>
                    <div className="flex gap-3 -mx-1 px-1 pb-1 overflow-x-auto no-scrollbar">
                        {!hydrated || loadingCatalog
                            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="rounded-2xl w-40 h-14 shrink-0" />)
                            : services.map((p) => (
                                <Link
                                    key={p.provider_id}
                                    href={`/anime?type=tv&providers=${p.provider_id}#catalogue`}
                                    scroll={false}
                                    onClick={() => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" })}
                                    className="flex items-center gap-3 bg-black/40 hover:bg-black/60 backdrop-blur-md py-2 pr-4 pl-2 border border-line hover:border-primary/40 rounded-2xl transition-colors shrink-0"
                                >
                                    <ProviderLogo name={p.provider_name} logoPath={p.logo_path} size={36} />
                                    <span className="font-medium text-fg text-sm whitespace-nowrap">{p.provider_name}</span>
                                </Link>
                            ))}
                        {hydrated && !loadingCatalog && services.length === 0 && (
                            <p className="text-fg-muted text-sm">No dedicated anime services listed here. Use the source filter below.</p>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}

function CatalogueHeader({ type, setType }: { type: MediaType; setType: (t: MediaType) => void }) {
    return (
        <div id="catalogue" className="flex flex-wrap justify-between items-end gap-4 mb-5 pt-4 scroll-mt-20">
            <SectionHeader title="Browse all anime" subtitle="Filter by service, availability and genre." />
            <div role="tablist" aria-label="Anime type" className="flex bg-white/5 mb-4 p-1 border border-line rounded-xl">
                {([
                    { value: "tv", label: "Series", icon: Tv },
                    { value: "movie", label: "Films", icon: Clapperboard },
                ] as const).map(({ value, label, icon: Icon }) => (
                    <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={type === value}
                        onClick={() => setType(value)}
                        className={cx(
                            "flex items-center gap-2 px-4 rounded-lg h-9 font-semibold text-sm transition-colors",
                            type === value ? "bg-surface-hover text-fg" : "text-fg-muted hover:text-fg",
                        )}
                    >
                        <Icon size={15} /> {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function AnimePage() {
    const { region, hydrated, myProviders } = usePreferences();
    const { data: catalog = [] } = useProviderCatalog();
    const crunchyroll = catalog.find((p) => p.provider_id === 283);

    const airing = useAnime("airing", "tv", SEASONAL);
    const popular = useAnime("popular", "tv", { minVotes: POPULAR_FLOOR });
    const films = useAnime("films", "movie", { minVotes: POPULAR_FLOOR });
    const topSeries = useAnime("top-series", "tv", { sortBy: "vote_average.desc" });
    const topFilms = useAnime("top-films", "movie", { sortBy: "vote_average.desc" });
    const onCrunchyroll = useAnime("crunchyroll", "tv", { providerIds: [283], region, minVotes: 20 }, hydrated && !!crunchyroll);
    const onMine = useAnime("mine", "tv", { providerIds: myProviders, region, monetization: ["flatrate", "free", "ads"], minVotes: 20 }, hydrated && myProviders.length > 0);

    return (
        <>
            <AnimeHero />

            <Container className="space-y-12 sm:space-y-14 mt-4">
                <MediaRail title="New this season" eyebrow="Simulcast" subtitle="Series that premiered recently and are airing now" items={airing.data} isLoading={airing.isLoading} />

                {myProviders.length > 0 && (
                    <MediaRail title="Anime on your services" items={onMine.data} isLoading={onMine.isLoading} emptyText="None of your services carry anime right now." />
                )}

                <MediaRail title="Most popular series" items={popular.data} isLoading={popular.isLoading} ranked />

                {crunchyroll && (
                    <MediaRail
                        title={
                            <span className="flex items-center gap-2.5">
                                <ProviderLogo name={crunchyroll.provider_name} logoPath={crunchyroll.logo_path} size={28} />
                                Popular on {crunchyroll.provider_name}
                            </span>
                        }
                        items={onCrunchyroll.data}
                        isLoading={onCrunchyroll.isLoading}
                        seeAllHref="/sources/283?type=tv"
                    />
                )}

                <MediaRail title="Anime films" subtitle="From blockbuster sequels to festival favourites" items={films.data} isLoading={films.isLoading} />
                <MediaRail title="Highest rated series" items={topSeries.data} isLoading={topSeries.isLoading} />
                <MediaRail title="Highest rated films" items={topFilms.data} isLoading={topFilms.isLoading} />

                <Suspense fallback={<Skeleton className="rounded-2xl h-40" />}>
                    <DiscoverView
                        defaultType="tv"
                        preset={{ ...ANIME_PRESET, minVotes: POPULAR_FLOOR }}
                        header={(type, setType) => <CatalogueHeader type={type} setType={setType} />}
                    />
                </Suspense>

                <div className="flex justify-center">
                    <ButtonLink href="/browse?type=tv" variant="outline">Browse all series instead</ButtonLink>
                </div>
            </Container>
        </>
    );
}
