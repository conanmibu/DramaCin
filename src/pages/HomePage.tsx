import { useMemo } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { Section } from '../components/Section';
import { DramaCard } from '../components/DramaCard';
import { Skeleton } from '../components/Skeleton';
import type { Drama, ContentGroup } from '../types/drama';

interface HomePageProps {
  contentGroups: ContentGroup[];
  allDramas: Drama[];
  isLoading: boolean;
  onDramaClick: (drama: Drama) => void;
  onSeeAll: (group: ContentGroup) => void;
}

export function HomePage({ contentGroups, allDramas, isLoading, onDramaClick, onSeeAll }: HomePageProps) {
  const featuredDrama = useMemo(() => {
    const hotDramas = allDramas.filter((d) => d.heatScore > 1000000);
    return hotDramas[0] || allDramas[0];
  }, [allDramas]);

  const editorsPicks = useMemo(() => {
    const shuffled = [...allDramas].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [allDramas]);

  if (isLoading) {
    return (
      <div className="pb-24">
        <div className="px-4 mb-8">
          <div className="w-full h-64 rounded-2xl bg-zinc-800 animate-pulse" />
        </div>
        <Section title="Drama Viral">
          <Skeleton variant="card" count={5} />
        </Section>
        <Section title="Drama Terbaru">
          <Skeleton variant="card" count={5} />
        </Section>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {featuredDrama && (
        <div className="px-4 mb-8 pt-4">
          <div
            onClick={() => onDramaClick(featuredDrama)}
            className="relative w-full h-80 rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
          >
            <img
              src={featuredDrama.shortPlayCover}
              alt={featuredDrama.shortPlayName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-transparent to-amber-500/20 mix-blend-overlay" />
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-rose-500 opacity-60 animate-pulse" />
                <div className="relative px-3 py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-black rounded-full flex items-center gap-1 shadow-2xl border border-rose-400/50">
                  <TrendingUp className="w-3.5 h-3.5" />
                  FEATURED
                </div>
              </div>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-100 mb-3 tracking-tight leading-tight">{featuredDrama.shortPlayName}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredDrama.labelArray?.slice(0, 3).map((label) => (
                  <span key={label} className="px-3 py-1 text-xs font-semibold bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10">
                    {label}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 rounded-full backdrop-blur-sm">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-semibold text-rose-300">{featuredDrama.heatScoreShow}</span>
                </span>
                <span className="font-medium">{featuredDrama.scriptName}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {contentGroups.map((group) => (
        <Section
          key={group.groupId}
          title={group.contentName}
          subtitle={`${group.contentInfos?.length || 0} drama tersedia`}
          onSeeAll={() => onSeeAll(group)}
        >
          <div className="flex items-center gap-2 mr-4">
            <TrendingUp className="w-5 h-5 text-rose-400" />
          </div>
          {group.contentInfos?.slice(0, 8).map((drama) => (
            <DramaCard
              key={drama.shortPlayId}
              drama={drama}
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      ))}

      {editorsPicks.length > 0 && (
        <Section
          title="Pilihan Editor"
          subtitle="Rekomendasi spesial untuk kamu"
        >
          <div className="flex items-center gap-2 mr-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          {editorsPicks.map((drama) => (
            <DramaCard
              key={`pick-${drama.shortPlayId}`}
              drama={drama}
              variant="large"
              onClick={() => onDramaClick(drama)}
            />
          ))}
        </Section>
      )}
    </div>
  );
}
