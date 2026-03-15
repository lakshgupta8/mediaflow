"use client";

import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { MovieCard } from "@/components/MovieCard";
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { tmdbService } from '@/services/tmdbService';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Pick a random page (1–10) once per module load so the top-rated section varies
const randomPage = Math.floor(Math.random() * 10) + 1;

export default function Home() {

  const { data: trendingAll, isLoading: isLoadingAll } = useQuery({
    queryKey: ['trending', 'all', 'day'],
    queryFn: () => tmdbService.getTrending('all', 'day'),
  });

  const { data: trendingMovies, isLoading: isLoadingMovies } = useQuery({
    queryKey: ['trending', 'movie', 'week'],
    queryFn: () => tmdbService.getTrending('movie', 'week'),
  });

  const { data: trendingSeries, isLoading: isLoadingSeries } = useQuery({
    queryKey: ['trending', 'tv', 'week'],
    queryFn: () => tmdbService.getTrending('tv', 'week'),
  });

  const { data: topRated, isLoading: isLoadingTopRated } = useQuery({
    queryKey: ['top_rated', 'movie', randomPage],
    queryFn: () => tmdbService.getTopRated('movie', randomPage),
  });

  const trendingItems = trendingAll?.results || [];
  const topMovies = trendingMovies?.results || [];
  const topSeries = trendingSeries?.results || [];
  const highestRated = useMemo(() => shuffleArray(topRated?.results || []), [topRated]);

  // Find a suitable hero item
  const heroItem = trendingItems.find(item => item.backdrop_path) || trendingItems[0];

  return (
    <>
      <HeroSection heroItem={heroItem} isLoading={isLoadingAll} />

      <div className="z-10 relative flex flex-col gap-12 -mt-10 px-8">
        <MovieRow title="Top Trending Movies">
          {isLoadingMovies ? (
            <div className="flex items-center space-x-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-xl w-[200px] h-[300px]" />
              ))}
            </div>
          ) : topMovies.map((movie) => (
            <MovieCard key={`movie-${movie.id}`} item={movie} />
          ))}
        </MovieRow>

        <MovieRow title="Top Trending Series">
          {isLoadingSeries ? (
            <div className="flex items-center space-x-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-xl w-[200px] h-[300px]" />
              ))}
            </div>
          ) : topSeries.map((series) => (
            <MovieCard key={`tv-${series.id}`} item={series} />
          ))}
        </MovieRow>

        <MovieRow title="All Time Highest Rated Movies/Series">
          {isLoadingTopRated ? (
            <div className="flex items-center space-x-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-xl w-[200px] h-[300px]" />
              ))}
            </div>
          ) : highestRated.map((item) => (
            <MovieCard key={`top-${item.id}`} item={item} />
          ))}
        </MovieRow>
      </div>
    </>
  );
}
