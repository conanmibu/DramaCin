import { X, Play, BookmarkPlus, BookmarkCheck, Share2, TrendingUp, Flame } from 'lucide-react';
import type { Drama } from '../types/drama';

interface DramaDetailProps {
  drama: Drama;
  isInLibrary: boolean;
  onClose: () => void;
  onWatch: () => void;
  onToggleLibrary: () => void;
}

export function DramaDetail({ drama, isInLibrary, onClose, onWatch, onToggleLibrary }: DramaDetailProps) {
  const tags = drama.labelArray || [];
  const isHot = drama.heatScore > 500000;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-t-3xl overflow-hidden animate-slide-up">
        <div className="relative h-72">
          <img
            src={drama.shortPlayCover}
            alt={drama.shortPlayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex gap-2 mb-2">
              {drama.isNewLabel && (
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full">
                  BARU
                </span>
              )}
              {isHot && (
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-white" />
                  HOT
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{drama.shortPlayName}</h2>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {drama.heatScoreShow}
              </span>
              <span>{drama.scriptName}</span>
            </div>
          </div>
        </div>

        <div className="p-5 max-h-[50vh] overflow-y-auto">
          <div className="flex gap-2 mb-4 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Popularitas</p>
                <p className="text-lg font-bold text-white">{drama.heatScoreShow}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Reservasi</p>
                <p className="text-lg font-bold text-white">{drama.totalReserveNum}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Kategori</p>
                <p className="text-lg font-bold text-white">{drama.scriptName}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onWatch}
              className="flex-1 h-12 rounded-xl bg-rose-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-rose-400 transition-colors"
            >
              <Play className="w-5 h-5 fill-white" />
              Tonton Sekarang
            </button>
            <button
              onClick={onToggleLibrary}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isInLibrary
                  ? 'bg-sky-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {isInLibrary ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <BookmarkPlus className="w-5 h-5" />
              )}
            </button>
            <button className="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
