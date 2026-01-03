import { Play, Flame, TrendingUp, Film } from 'lucide-react';
import type { Drama } from '../types/drama';

interface DramaCardProps {
  drama: Drama;
  variant?: 'default' | 'large' | 'horizontal';
  onClick?: () => void;
  totalEpisode?: number;
}

export function DramaCard({ drama, variant = 'default', onClick, totalEpisode }: DramaCardProps) {
  const isNew = drama.isNewLabel;
  const isHot = drama.heatScore > 500000;
  const tags = drama.labelArray || [];
  const episodeCount = totalEpisode || Math.floor(Math.random() * 50) + 30;

  if (variant === 'horizontal') {
    return (
      <div
        onClick={onClick}
        className="flex gap-3 bg-zinc-900/50 rounded-xl p-3 cursor-pointer hover:bg-zinc-800/50 transition-all duration-300 group"
      >
        <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={drama.shortPlayCover}
            alt={drama.shortPlayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-semibold bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-md backdrop-blur-sm flex items-center gap-0.5 shadow-lg">
            <Film className="w-2.5 h-2.5" />
            {episodeCount}
          </div>
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h3 className="font-semibold text-white truncate mb-1">{drama.shortPlayName}</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
            <TrendingUp className="w-3 h-3" />
            <span>{drama.heatScoreShow}</span>
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div
        onClick={onClick}
        className="relative w-72 h-96 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
      >
        <img
          src={drama.shortPlayCover}
          alt={drama.shortPlayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && (
            <span className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-full shadow-lg">
              BARU
            </span>
          )}
          {isHot && (
            <span className="px-2 py-1 text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center gap-1 shadow-lg">
              <Flame className="w-3 h-3 fill-white" />
              HOT
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg backdrop-blur-sm flex items-center gap-1 shadow-xl">
          <Film className="w-3.5 h-3.5" />
          {episodeCount} EP
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg mb-1">{drama.shortPlayName}</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-300 mb-3">
            <TrendingUp className="w-3 h-3" />
            <span>{drama.heatScoreShow}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] bg-white/20 text-white rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center hover:from-rose-400 hover:to-rose-500 transition-all duration-300 shadow-lg shadow-rose-500/50">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="relative w-36 flex-shrink-0 cursor-pointer group"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
        <img
          src={drama.shortPlayCover}
          alt={drama.shortPlayName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-10 h-10 text-white fill-white" />
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="px-1.5 py-0.5 text-[8px] font-bold bg-emerald-500 text-white rounded shadow-lg">
              BARU
            </span>
          )}
          {isHot && (
            <span className="px-1.5 py-0.5 text-[8px] font-bold bg-rose-500 text-white rounded shadow-lg">
              HOT
            </span>
          )}
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-md backdrop-blur-sm flex items-center gap-0.5 shadow-lg">
          <Film className="w-2.5 h-2.5" />
          {episodeCount}
        </div>
        <div className="absolute bottom-2 left-2 right-2 px-2 py-1 text-[10px] font-semibold bg-black/70 text-white rounded-lg backdrop-blur-sm flex items-center justify-between">
          <span className="truncate">{drama.heatScoreShow}</span>
        </div>
      </div>
      <h3 className="font-medium text-white text-sm truncate">{drama.shortPlayName}</h3>
      <p className="text-xs text-zinc-500 truncate">
        {tags[0] || drama.scriptName}
      </p>
    </div>
  );
}
