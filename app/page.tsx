"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ANIME_PRESET, tmdbService, type MediaItem } from "@/services/tmdbService";
import { useGenres, usePreferences, useProviderCatalog } from "@/hooks/useProviders";
import { useMixedDiscover } from "@/hooks/useMixedDiscover";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ServicesStrip } from "@/components/home/ServicesStrip";
import { MediaRail } from "@/components/media/Rail";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import { Container } from "@/components/ui/primitives";
import { regionName } from "@/lib/media";

function ProviderRail({ providerId, name, logoPath, region }: { providerId: number; name: string; logoPath: string; region: string }) {
  const { data, isLoading } = useMixedDiscover(`provider-${providerId}`, { providerIds: [providerId], region, monetization: ["flatrate", "free", "ads"] });
  return (
    <MediaRail
      title={
        <span className="flex items-center gap-2.5">
          <ProviderLogo name={name} logoPath={logoPath} size={28} />
          Popular on {name}
        </span>
      }
      items={data}
      isLoading={isLoading}
      seeAllHref={`/sources/${providerId}`}
    />
  );
}

function GenreChips() {
  const { data } = useGenres("movie");
  const genres = data?.genres || [];
  if (!genres.length) return null;
  return (
    <section aria-labelledby="genre-chips">
      <h2 id="genre-chips" className="mb-4 font-display font-bold text-fg text-xl sm:text-2xl">Browse by mood</h2>
      <div className="flex flex-wrap gap-2">
        {genres.map((g) => (
          <Link
            key={g.id}
            href={`/browse?type=movie&genre=${g.id}`}
            className="bg-white/4 hover:bg-primary/12 px-4 py-2 border border-line hover:border-primary/40 rounded-full font-medium text-fg-muted hover:text-fg text-sm transition-colors"
          >
            {g.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { region, myProviders, hydrated } = usePreferences();
  const { data: catalog = [] } = useProviderCatalog();

  const { data: trendingAll, isLoading: loadingTrending } = useQuery({
    queryKey: ["trending", "all", "day"],
    queryFn: () => tmdbService.getTrending("all", "day"),
  });
  const { data: trendingSeries, isLoading: loadingSeries } = useQuery({
    queryKey: ["trending", "tv", "week"],
    queryFn: () => tmdbService.getTrending("tv", "week"),
  });
  const { data: topRated, isLoading: loadingTopRated } = useQuery({
    queryKey: ["list", "movie", "top_rated", 1],
    queryFn: () => tmdbService.getTopRated("movie", 1),
  });
  const { data: upcoming, isLoading: loadingUpcoming } = useQuery({
    queryKey: ["list", "movie", "upcoming", region],
    queryFn: () => tmdbService.getList("movie", "upcoming", 1, region),
    enabled: hydrated,
  });

  const trending = useMemo(
    () => (trendingAll?.results || []).filter((i): i is MediaItem => i.media_type !== "person" && !!i.backdrop_path),
    [trendingAll],
  );

  // Rails follow the user's services, or the region's biggest ones when none are picked.
  const featuredProviders = useMemo(() => {
    const mine = catalog.filter((p) => myProviders.includes(p.provider_id));
    return (mine.length ? mine : catalog).slice(0, 4);
  }, [catalog, myProviders]);

  const onMyServices = useMixedDiscover(
    "my-services-new",
    { providerIds: myProviders, region, monetization: ["flatrate", "free", "ads"], sortBy: "primary_release_date.desc", minVotes: 30 },
    hydrated && myProviders.length > 0,
  );
  const anime = useMixedDiscover("anime", { ...ANIME_PRESET, genreIds: [...ANIME_PRESET.genreIds], minVotes: 50 });
  const freeToWatch = useMixedDiscover("free", { region, monetization: ["free", "ads"], minVotes: 50 }, hydrated);

  return (
    <>
      <HeroCarousel items={trending.slice(0, 6)} isLoading={loadingTrending} />

      <Container className="z-10 relative space-y-12 sm:space-y-14 mt-2 sm:-mt-6">
        <ServicesStrip />

        <MediaRail
          title="Top 10 today"
          eyebrow="Trending"
          items={trending.slice(0, 10)}
          isLoading={loadingTrending}
          ranked
        />

        {myProviders.length > 0 && (
          <MediaRail
            title="New on your services"
            subtitle="Latest arrivals across everything you subscribe to"
            items={onMyServices.data}
            isLoading={onMyServices.isLoading}
            seeAllHref={`/browse?type=movie&providers=${myProviders.join(",")}&sort=primary_release_date.desc`}
          />
        )}

        {featuredProviders.slice(0, 2).map((p) => (
          <ProviderRail key={p.provider_id} providerId={p.provider_id} name={p.provider_name} logoPath={p.logo_path} region={region} />
        ))}

        <MediaRail
          title="Series everyone is watching"
          items={trendingSeries?.results}
          isLoading={loadingSeries}
          seeAllHref="/browse?type=tv"
        />

        <MediaRail
          title="Popular anime"
          eyebrow="Anime"
          subtitle="Series and films from Japan"
          items={anime.data}
          isLoading={anime.isLoading}
          seeAllHref="/anime"
        />

        <MediaRail
          title="Free to watch"
          subtitle={`No subscription needed in ${regionName(region)}`}
          items={freeToWatch.data}
          isLoading={freeToWatch.isLoading || !hydrated}
          seeAllHref="/browse?type=movie&avail=free"
        />

        {featuredProviders.slice(2, 4).map((p) => (
          <ProviderRail key={p.provider_id} providerId={p.provider_id} name={p.provider_name} logoPath={p.logo_path} region={region} />
        ))}

        <MediaRail
          title="Coming to cinemas"
          items={upcoming?.results}
          isLoading={loadingUpcoming || !hydrated}
        />

        <MediaRail
          title="All-time greats"
          subtitle="The highest rated films on TMDB"
          items={topRated?.results}
          isLoading={loadingTopRated}
          seeAllHref="/browse?type=movie&sort=vote_average.desc"
        />

        <GenreChips />
      </Container>
    </>
  );
}
