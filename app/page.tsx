"use client";

import { HeroSection } from "@/components/HeroSection";
import { MovieRow } from "@/components/MovieRow";
import { MovieCard } from "@/components/MovieCard";
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';

export default function Home() {
  const { data: trendingAll, isLoading: isLoadingAll } = useQuery({
    queryKey: ['trending', 'all', 'day'],
    queryFn: () => tmdbService.getTrending('all', 'day'),
  });

  const { data: trendingMovies, isLoading: isLoadingMovies } = useQuery({
    queryKey: ['trending', 'movie', 'week'],
    queryFn: () => tmdbService.getTrending('movie', 'week'),
  });

  const trendingItems = trendingAll?.results || [];
  const recommendedItems = trendingMovies?.results || [];

  // Find a suitable hero item
  const heroItem = trendingItems.find(item => item.backdrop_path) || trendingItems[0];

  return (
    <>
      <HeroSection heroItem={heroItem} isLoading={isLoadingAll} />

      <div className="z-10 relative flex flex-col gap-12 -mt-10 px-8">
        <MovieRow title="Trending Now" viewAllLink="#">
          {isLoadingAll ? (
            <div className="flex items-center space-x-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-xl w-[200px] h-[300px]" />
              ))}
            </div>
          ) : trendingItems.map((movie) => (
            <MovieCard key={movie.id} item={movie} />
          ))}
        </MovieRow>

        <MovieRow title="Top Recommendations">
          {isLoadingMovies ? (
            <div className="flex items-center space-x-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-xl w-[320px] aspect-video" />
              ))}
            </div>
          ) : recommendedItems.map((movie) => (
            <MovieCard key={movie.id} item={movie} isRec={true} />
          ))}
        </MovieRow>
      </div>
    </>
  );
}
