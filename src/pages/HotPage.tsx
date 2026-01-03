import { useMemo } from 'react';
import { Flame, Trophy, TrendingUp, Sparkles, Award, Star } from 'lucide-react';
import { Section } from '../components/Section';
import { DramaCard } from '../components/DramaCard';
import { Skeleton } from '../components/Skeleton';
import type { Drama } from '../types/drama';

interface HotPageProps {
  allDramas: Drama[];
  isLoading: boolean;
  onDramaClick: (drama: Drama) => void;
}

export function HotPage({ allDramas, isLoading, onDramaClick }: HotPageProps) {
  const sortedByHeat = useMemo(() => {
    return [...allDramas].sort((a, b) => b.heatScore - a.heatScore);
  }, [allDramas]);

  const { mostPopular, hallOfFame, trending, mostWatched, risingStars, favorites } = useMemo(() => {
    const usedIds = new Set<string>();

    const getUniqueDramas = (dramas: Drama[], count: number) => {
      const result: Drama[] = [];
      for (const drama of dramas) {
        if (!usedIds.has(drama.shortPlayId) && result.length < count) {
          usedIds.add(drama.shortPlayId);
          result.push(drama);
        }
      }
      return result;
    };

    const mostPopular = getUniqueDramas(sortedByHeat, 12);
    const hallOfFame = getUniqueDramas(sortedByHeat.filter(d => d.heatScore > 1000000), 12);
    const trending = getUniqueDramas(sortedByHeat, 12);
    const mostWatched = getUniqueDramas(sortedByHeat, 12);
    const risingStars = getUniqueDramas(sortedByHeat, 12);
    const favorites = getUniqueDramas(sortedByHeat, 12);

    return { mostPopular, hallOfFame, trending, mostWatched, risingStars, favorites };
  }, [sortedByHeat]);

  if (isLoading) {
    return (
      <div className="pb-24 pt-4">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <Section title="Drama Terpopuler">
          <Skeleton count={6} />
        </Section>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Drama Hot</h1>
            <p className="text-sm text-zinc-500">Paling banyak ditonton minggu ini</p>
          </div>
        </div>
      </div>

      {mostPopular.length > 0 && (
        <Section
          title="Drama Terpopuler"
          subtitle="Paling banyak ditonton"
        >
          <div className="flex items-center gap-2 mr-4">
            <Flame className="w-5 h-5 text-rose-400" />
          </div>
          {mostPopular.map((drama) => (
            <DramaCard
              key={drama.shortPlayId}
              drama={drama}
              variant="large"
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      )}

      {hallOfFame.length > 0 && (
        <div className="mb-6">
          <div className="px-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Hall of Fame</h2>
            </div>
            <span className="text-xs text-zinc-500">Drama legendaris</span>
          </div>
          <div className="px-4">
            <div className="grid grid-cols-3 gap-3">
              {hallOfFame.map((drama) => (
                <div
                  key={drama.shortPlayId}
                  onClick={() => onDramaClick(drama)}
                  className="relative cursor-pointer group"
                >
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                    <img
                      src={drama.shortPlayCover}
                      alt={drama.shortPlayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 p-1 bg-amber-500/90 rounded-full backdrop-blur-sm">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <h3 className="mt-2 text-xs font-medium text-white line-clamp-2 leading-tight">{drama.shortPlayName}</h3>
                  <p className="text-xs text-amber-400 font-semibold">{drama.heatScoreShow}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {trending.length > 0 && (
        <Section
          title="Trending Hari Ini"
          subtitle="Sedang naik popularitas"
        >
          <div className="flex items-center gap-2 mr-4">
            <TrendingUp className="w-5 h-5 text-rose-400" />
          </div>
          {trending.map((drama) => (
            <DramaCard
              key={drama.shortPlayId}
              drama={drama}
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      )}

      {mostWatched.length > 0 && (
        <Section
          title="Paling Banyak Ditonton"
          subtitle="Favorit penonton"
        >
          <div className="flex items-center gap-2 mr-4">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          {mostWatched.map((drama) => (
            <DramaCard
              key={drama.shortPlayId}
              drama={drama}
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      )}

      {risingStars.length > 0 && (
        <Section
          title="Rising Stars"
          subtitle="Drama yang cepat populer"
        >
          <div className="flex items-center gap-2 mr-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          {risingStars.map((drama) => (
            <DramaCard
              key={drama.shortPlayId}
              drama={drama}
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      )}

      {favorites.length > 0 && (
        <Section
          title="Drama Favorit"
          subtitle="Pilihan terbaik"
        >
          <div className="flex items-center gap-2 mr-4">
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          {favorites.map((drama) => (
            <DramaCard
              key={drama.shortPlayId}
              drama={drama}
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      )}
    </div>
  );
}
