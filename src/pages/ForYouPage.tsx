import { useState, useEffect, useMemo, useRef } from 'react';
import { Sparkles, Heart, Loader2, TrendingUp, Star, Flame, Zap } from 'lucide-react';
import { Section } from '../components/Section';
import { DramaCard } from '../components/DramaCard';
import { Skeleton } from '../components/Skeleton';
import { fetchForYou } from '../services/api';
import type { Drama, ContentGroup } from '../types/drama';

interface ForYouPageProps {
  onDramaClick: (drama: Drama) => void;
}

export function ForYouPage({ onDramaClick }: ForYouPageProps) {
  const [contentGroups, setContentGroups] = useState<ContentGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const currentPageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isLoadingRef = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadForYou = async (page: number, append: boolean = false) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    try {
      if (append) {
        setIsLoadingMore(true);
      }
      const data = await fetchForYou(page);
      const groups = Array.isArray(data) ? data : [];

      if (groups.length === 0 || (groups[0]?.contentInfos?.length || 0) === 0) {
        hasMoreRef.current = false;
      } else {
        setContentGroups((prev) => append ? [...prev, ...groups] : groups);
      }
    } catch (error) {
      console.error('Failed to fetch for you:', error);
      hasMoreRef.current = false;
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    loadForYou(1, false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
          currentPageRef.current += 1;
          loadForYou(currentPageRef.current, true);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  const allDramas = useMemo(() => {
    if (!Array.isArray(contentGroups)) return [];
    return contentGroups.flatMap((group) => group.contentInfos || []);
  }, [contentGroups]);

  const featured = useMemo(() => allDramas.slice(0, 1)[0], [allDramas]);
  const trending = useMemo(() => allDramas.slice(1, 10), [allDramas]);
  const popular = useMemo(() => allDramas.slice(10, 20), [allDramas]);
  const recommended = useMemo(() => allDramas.slice(20, 30), [allDramas]);
  const newReleases = useMemo(() => allDramas.slice(30, 38), [allDramas]);

  if (isLoading) {
    return (
      <div className="pb-24 pt-4">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-3 w-40 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-full h-72 rounded-2xl bg-zinc-800 animate-pulse mb-6" />
        </div>
        <div className="mb-6">
          <div className="px-4 mb-4">
            <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="px-4">
            <div className="grid grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-[2/3] rounded-xl bg-zinc-800 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <Section title="Populer Minggu Ini">
          <Skeleton variant="card" count={5} />
        </Section>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">For You</h1>
            <p className="text-sm text-zinc-500">Rekomendasi khusus untukmu</p>
          </div>
        </div>

        {featured && (
          <div
            onClick={() => onDramaClick(featured)}
            className="relative w-full h-72 rounded-2xl overflow-hidden cursor-pointer group mb-6"
          >
            <img
              src={featured.shortPlayCover}
              alt={featured.shortPlayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
              <Flame className="w-3.5 h-3.5" />
              HOT PICK
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="text-2xl font-bold text-white mb-3">{featured.shortPlayName}</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {featured.labelArray?.slice(0, 3).map((label) => (
                  <span key={label} className="px-2.5 py-1 text-xs bg-white/20 text-white rounded-lg backdrop-blur-sm font-medium">
                    {label}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {featured.heatScoreShow}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4" />
                  {featured.scriptName}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {trending.length > 0 && (
        <div className="mb-6">
          <div className="px-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Trending Sekarang</h2>
            </div>
            <span className="text-xs text-zinc-500">{trending.length} drama</span>
          </div>
          <div className="px-4">
            <div className="grid grid-cols-3 gap-3">
              {trending.map((drama, idx) => (
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {idx < 3 && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-xs font-medium text-white line-clamp-2 leading-tight">{drama.shortPlayName}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{drama.heatScoreShow}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {popular.length > 0 && (
        <div className="mb-6">
          <div className="px-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-bold text-white">Populer Minggu Ini</h2>
            </div>
            <span className="text-xs text-zinc-500">{popular.length} drama</span>
          </div>
          <div className="px-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              {popular.slice(0, 4).map((drama, idx) => (
                <div
                  key={drama.shortPlayId}
                  onClick={() => onDramaClick(drama)}
                  className="relative cursor-pointer group"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                    <img
                      src={drama.shortPlayCover}
                      alt={drama.shortPlayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {idx + 1}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">{drama.shortPlayName}</h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {drama.labelArray?.slice(0, 2).map((label) => (
                          <span key={label} className="px-1.5 py-0.5 text-xs bg-white/20 text-white rounded backdrop-blur-sm">
                            {label}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {drama.heatScoreShow}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {popular.slice(4, 10).map((drama) => (
                <div
                  key={drama.shortPlayId}
                  onClick={() => onDramaClick(drama)}
                  className="relative cursor-pointer group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={drama.shortPlayCover}
                      alt={drama.shortPlayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>
                  <h3 className="mt-1.5 text-xs font-medium text-white line-clamp-2 leading-tight">{drama.shortPlayName}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <Section
          title="Rekomendasi Spesial"
          subtitle={`${recommended.length} drama pilihan`}
        >
          <div className="flex items-center gap-2 mr-4">
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          {recommended.map((drama) => (
            <DramaCard
              key={drama.shortPlayId}
              drama={drama}
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      )}

      {newReleases.length > 0 && (
        <Section
          title="Rilis Terbaru"
          subtitle={`${newReleases.length} drama baru`}
        >
          <div className="flex items-center gap-2 mr-4">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          {newReleases.map((drama) => (
            <DramaCard
              key={drama.shortPlayId}
              drama={drama}
              variant="large"
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      )}

      {contentGroups.map((group, groupIndex) => (
        <Section
          key={`${group.groupId}-${groupIndex}`}
          title={group.contentName}
          subtitle={`${group.contentInfos?.length || 0} drama`}
        >
          <div className="flex items-center gap-2 mr-4">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          {group.contentInfos?.map((drama) => (
            <DramaCard
              key={`${drama.shortPlayId}-${groupIndex}`}
              drama={drama}
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      ))}

      <div ref={observerTarget} className="h-4" />

      {isLoadingMore && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
        </div>
      )}

      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-rose-500/20 to-amber-500/20 rounded-2xl p-4 border border-rose-500/20">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-white">Tips</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Semakin banyak drama yang kamu tonton, semakin akurat rekomendasi yang kami berikan!
          </p>
        </div>
      </div>
    </div>
  );
}
