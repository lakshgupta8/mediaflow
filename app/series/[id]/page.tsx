"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Tv } from "lucide-react";
import { tmdbService } from "@/services/tmdbService";
import { useUserData } from "@/hooks/useUserData";
import { findTrailer, formatRuntime, mediaTitle, mediaYear } from "@/lib/media";
import { DetailHero } from "@/components/detail/DetailHero";
import { CastRail, DetailSkeleton, FactsCard, formatDate, languageName, Overview } from "@/components/detail/DetailSections";
import { EpisodeList, SeasonChips, type SeasonSummary } from "@/components/detail/Episodes";
import { TrailerModal } from "@/components/detail/TrailerModal";
import { WhereToWatch } from "@/components/providers/WhereToWatch";
import { MediaRail } from "@/components/media/Rail";
import { ReviewSection } from "@/components/ReviewSection";
import { ButtonLink, Container, EmptyState } from "@/components/ui/primitives";

export default function SeriesDetailsPage() {
    const params = useParams();
    const id = Number(params.id);

    const [browseSeason, setBrowseSeason] = useState<number | null>(null);
    const [trailerOpen, setTrailerOpen] = useState(false);

    const { data: series, isLoading, isError } = useQuery({
        queryKey: ["tv", id],
        queryFn: () => tmdbService.getDetails("tv", id),
        enabled: Number.isFinite(id) && id > 0,
    });

    const seasons: SeasonSummary[] = useMemo(() => {
        const all = (series?.seasons || []).filter((s) => s.episode_count > 0);
        const regular = all.filter((s) => s.season_number > 0);
        return regular.length ? [...regular, ...all.filter((s) => s.season_number === 0)] : all;
    }, [series]);

    const firstSeason = seasons[0]?.season_number ?? 1;
    const activeSeason = browseSeason ?? firstSeason;

    const { data: seasonData, isLoading: loadingSeason } = useQuery({
        queryKey: ["tv_season", id, activeSeason],
        queryFn: () => tmdbService.getTvSeason(id, activeSeason),
        enabled: !!series,
    });

    const { data: recommendations, isLoading: loadingRecs } = useQuery({
        queryKey: ["recommendations", "tv", id],
        queryFn: () => tmdbService.getRecommendations("tv", id),
        enabled: !!series,
    });

    const { recentWatches, addToRecent, removeFromRecent } = useUserData();

    if (isError) {
        return (
            <Container>
                <EmptyState
                    icon={<Tv size={26} />}
                    title="We couldn't load this series"
                    description="It may have been removed from TMDB, or the connection dropped. Try again in a moment."
                    action={<ButtonLink href="/browse?type=tv" variant="outline">Browse series</ButtonLink>}
                />
            </Container>
        );
    }

    if (isLoading || !series) return <DetailSkeleton />;

    const title = mediaTitle(series);
    const trailer = findTrailer(series);
    const isWatched = recentWatches.some((r) => r.media_id === series.id && r.media_type === "tv");
    const runtime = series.episode_run_time?.[0];
    const seasonsLabel = series.number_of_seasons
        ? `${series.number_of_seasons} season${series.number_of_seasons > 1 ? "s" : ""}`
        : null;

    return (
        <>
            <DetailHero
                item={series}
                type="tv"
                meta={[mediaYear(series)?.toString(), seasonsLabel, series.number_of_episodes ? `${series.number_of_episodes} episodes` : null]}
                onTrailer={trailer ? () => setTrailerOpen(true) : undefined}
                isWatched={isWatched}
                onToggleWatched={() =>
                    isWatched
                        ? removeFromRecent({ mediaId: series.id, mediaType: "tv" })
                        : addToRecent({ mediaId: series.id, mediaType: "tv" })
                }
                footer={
                    series.created_by?.length ? (
                        <p className="text-fg-muted text-sm">
                            Created by{" "}
                            {series.created_by.map((c, i) => (
                                <span key={c.id}>
                                    {i > 0 && ", "}
                                    <Link href={`/people/${c.id}`} className="font-medium text-fg hover:text-primary-light">
                                        {c.name}
                                    </Link>
                                </span>
                            ))}
                        </p>
                    ) : null
                }
            />

            <Container className="gap-10 lg:gap-12 grid lg:grid-cols-[minmax(0,1fr)_380px] mt-2">
                <div className="space-y-12 min-w-0">
                    <div className="lg:hidden">
                        <WhereToWatch mediaType="tv" id={series.id} title={title} />
                    </div>

                    <Overview text={series.overview} />

                    <section aria-labelledby="episodes" className="space-y-4">
                        <div className="flex flex-wrap justify-between items-end gap-3">
                            <h2 id="episodes" className="font-display font-bold text-fg text-xl sm:text-2xl">Episodes</h2>
                            {seasonData?.name && <p className="text-fg-subtle text-sm">{seasonData.name} · {seasonData.episodes?.length || 0} episodes</p>}
                        </div>
                        {seasons.length > 1 && <SeasonChips seasons={seasons} active={activeSeason} onSelect={setBrowseSeason} />}
                        <EpisodeList season={seasonData} isLoading={loadingSeason} fallbackStill={series.backdrop_path} />
                    </section>

                    <CastRail cast={series.credits?.cast || []} crew={series.credits?.crew} />
                    <ReviewSection mediaId={series.id} mediaType="tv" />
                </div>

                <aside className="space-y-6">
                    <div className="hidden lg:block">
                        <WhereToWatch mediaType="tv" id={series.id} title={title} />
                    </div>
                    <FactsCard
                        title="Series info"
                        facts={[
                            { label: "Status", value: series.status },
                            { label: "First aired", value: formatDate(series.first_air_date) },
                            { label: "Seasons", value: series.number_of_seasons },
                            { label: "Episodes", value: series.number_of_episodes },
                            { label: "Episode length", value: formatRuntime(runtime) },
                            { label: "Original language", value: languageName(series.original_language) },
                            { label: "Network", value: series.networks?.slice(0, 2).map((n) => n.name).join(", ") },
                        ]}
                    />
                </aside>
            </Container>

            <Container className="mt-14">
                <MediaRail title="More like this" items={recommendations?.results} isLoading={loadingRecs} />
            </Container>

            {trailer && <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer.key} title={title} />}
        </>
    );
}
