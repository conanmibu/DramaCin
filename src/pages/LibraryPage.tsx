import { BookMarked, Trash2, Play, TrendingUp } from 'lucide-react';
import type { Drama } from '../types/drama';

interface LibraryPageProps {
  library: Drama[];
  onDramaClick: (drama: Drama) => void;
  onRemove: (shortPlayId: string) => void;
}

export function LibraryPage({ library, onDramaClick, onRemove }: LibraryPageProps) {
  if (library.length === 0) {
    return (
      <div className="pb-24 pt-4 px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Library</h1>
            <p className="text-sm text-zinc-500">Drama yang kamu simpan</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
            <BookMarked className="w-10 h-10 text-zinc-600" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Library Kosong</h2>
          <p className="text-sm text-zinc-500 text-center max-w-xs">
            Kamu belum menyimpan drama apapun. Jelajahi dan temukan drama favoritmu!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Library</h1>
            <p className="text-sm text-zinc-500">{library.length} drama tersimpan</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {library.map((drama) => (
          <div
            key={drama.shortPlayId}
            className="flex gap-3 bg-zinc-900/50 rounded-xl p-3 group"
          >
            <div
              onClick={() => onDramaClick(drama)}
              className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={drama.shortPlayCover}
                alt={drama.shortPlayName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0 py-1">
              <h3
                onClick={() => onDramaClick(drama)}
                className="font-semibold text-white truncate mb-1 cursor-pointer hover:text-rose-400 transition-colors"
              >
                {drama.shortPlayName}
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {drama.labelArray?.slice(0, 2).map((label) => (
                  <span key={label} className="px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-400 rounded-full">
                    {label}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {drama.heatScoreShow}
                </span>
                <button
                  onClick={() => onRemove(drama.shortPlayId)}
                  className="p-2 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
