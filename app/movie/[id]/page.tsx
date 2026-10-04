"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Film } from "lucide-react";
import { tmdbService } from "@/services/tmdbService";
import { useUserData } from "@/hooks/useUserData";
import { findTrailer, formatRuntime, mediaTitle, mediaYear } from "@/lib/media";
import { DetailHero } from "@/components/detail/DetailHero";
import { CastRail, DetailSkeleton, FactsCard, formatDate, formatMoney, languageName, Overview } from "@/components/detail/DetailSections";
import { TrailerModal } from "@/components/detail/TrailerModal";
import { WhereToWatch } from "@/components/providers/WhereToWatch";
import { MediaRail } from "@/components/media/Rail";
import { ReviewSection } from "@/components/ReviewSection";
import { ButtonLink, Container, EmptyState } from "@/components/ui/primitives";

export default function MovieDetailsPage() {
    const params = useParams();
    const id = Number(params.id);
    const [trailerOpen, setTrailerOpen] = useState(false);

    const { data: movie, isLoading, isError } = useQuery({
        queryKey: ["movie", id],
        queryFn: () => tmdbService.getDetails("movie", id),
        enabled: Number.isFinite(id) && id > 0,
    });

    const { data: recommendations, isLoading: loadingRecs } = useQuery({
        queryKey: ["recommendations", "movie", id],
        queryFn: () => tmdbService.getRecommendations("movie", id),
        enabled: !!movie,
    });

    const { recentWatches, addToRecent, removeFromRecent } = useUserData();

    if (isError) {
        return (
            <Container>
                <EmptyState
                    icon={<Film size={26} />}
                    title="We couldn't load this movie"
                    description="It may have been removed from TMDB, or the connection dropped. Try again in a moment."
                    action={<ButtonLink href="/browse?type=movie" variant="outline">Browse movies</ButtonLink>}
                />
            </Container>
        );
    }

    if (isLoading || !movie) return <DetailSkeleton />;

    const title = mediaTitle(movie);
    const trailer = findTrailer(movie);
    const director = movie.credits?.crew.find((c) => c.job === "Director");
    const isWatched = recentWatches.some((r) => r.media_id === movie.id && r.media_type === "movie");

    return (
        <>
            <DetailHero
                item={movie}
                type="movie"
                meta={[mediaYear(movie)?.toString(), formatRuntime(movie.runtime), director && `Directed by ${director.name}`]}
                onTrailer={trailer ? () => setTrailerOpen(true) : undefined}
                isWatched={isWatched}
                onToggleWatched={() =>
                    isWatched
                        ? removeFromRecent({ mediaId: movie.id, mediaType: "movie" })
                        : addToRecent({ mediaId: movie.id, mediaType: "movie" })
                }
            />

            <Container className="gap-10 lg:gap-12 grid lg:grid-cols-[minmax(0,1fr)_380px] mt-2">
                <div className="space-y-12 min-w-0">
                    <div className="lg:hidden">
                        <WhereToWatch mediaType="movie" id={movie.id} title={title} />
                    </div>
                    <Overview text={movie.overview} />
                    <CastRail cast={movie.credits?.cast || []} crew={movie.credits?.crew} />
                    <ReviewSection mediaId={movie.id} mediaType="movie" />
                </div>

                <aside className="space-y-6">
                    <div className="hidden lg:block">
                        <WhereToWatch mediaType="movie" id={movie.id} title={title} />
                    </div>
                    <FactsCard
                        title="Details"
                        facts={[
                            { label: "Status", value: movie.status },
                            { label: "Release date", value: formatDate(movie.release_date) },
                            { label: "Runtime", value: formatRuntime(movie.runtime) },
                            { label: "Original language", value: languageName(movie.original_language) },
                            { label: "Budget", value: formatMoney(movie.budget) },
                            { label: "Box office", value: formatMoney(movie.revenue) },
                            { label: "Studios", value: movie.production_companies?.slice(0, 3).map((c) => c.name).join(", ") },
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
