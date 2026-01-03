import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Loader2 } from 'lucide-react';
import type { Drama, ContentGroup } from '../types/drama';
import { fetchCategoryDramas } from '../services/api';

interface CategoryPageProps {
  group: ContentGroup;
  onBack: () => void;
  onDramaClick: (drama: Drama) => void;
}

export function CategoryPage({ group, onBack, onDramaClick }: CategoryPageProps) {
  const [dramas, setDramas] = useState<Drama[]>(group.contentInfos || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategoryDramas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCategoryDramas(group.groupId);
        if (data && data.length > 0 && data[0].contentInfos) {
          setDramas(data[0].contentInfos);
        }
      } catch {
        setError('Gagal memuat drama');
        setDramas(group.contentInfos || []);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryDramas();
  }, [group.groupId, group.contentInfos]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto">
      <div className="sticky top-0 bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800 z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center hover:bg-zinc-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">{group.contentName}</h1>
            <p className="text-xs text-zinc-500">
              {isLoading ? 'Memuat...' : `${dramas.length} drama`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 pb-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-3" />
            <p className="text-zinc-400 text-sm">Memuat semua drama...</p>
          </div>
        ) : error && dramas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-zinc-400 text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {dramas.map((drama) => (
              <button
                key={drama.shortPlayId}
                onClick={() => onDramaClick(drama)}
                className="text-left group"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                  <img
                    src={drama.shortPlayCover}
                    alt={drama.shortPlayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-xs text-white">
                    <TrendingUp className="w-3 h-3" />
                    <span>{drama.heatScoreShow}</span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-rose-400 transition-colors">
                  {drama.shortPlayName}
                </h3>
                {drama.labelArray && drama.labelArray.length > 0 && (
                  <p className="text-xs text-zinc-500 mt-1 truncate">
                    {drama.labelArray[0]}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
