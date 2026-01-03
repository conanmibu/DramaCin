import { useState, useEffect, useCallback } from 'react';
import { Search, X, TrendingUp, Loader2 } from 'lucide-react';
import { searchDramas } from '../services/api';
import type { SearchResult, Drama } from '../types/drama';

interface SearchPageProps {
  onClose: () => void;
  onDramaClick: (drama: Drama) => void;
}

function convertSearchResultToDrama(result: SearchResult): Drama {
  return {
    shortPlayId: result.shortPlayId,
    shortPlayLibraryId: result.shortPlayLibraryId,
    shortPlayName: result.shortPlayName.replace(/<\/?em>/g, ''),
    shortPlayLabels: result.labelNames,
    labelArray: result.labelNameList || [],
    isNewLabel: false,
    shortPlayCover: result.shortPlayCover,
    groupShortPlayCover: result.shortPlayCover,
    scriptName: '',
    scriptType: 0,
    heatScore: result.heatScore,
    heatScoreShow: result.formatHeatScore,
    totalReserveNum: '0',
    isReserve: 0,
    publishTime: 0,
    isChase: false,
  };
}

export function SearchPage({ onClose, onDramaClick }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await searchDramas(searchQuery);
      setResults(data.searchCodeSearchResult || []);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const popularSearches = ['CEO', 'Romantis', 'Balas Dendam', 'Hamil', 'Kaya'];

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950">
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari drama..."
              autoFocus
              className="w-full h-12 pl-11 pr-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-rose-400 font-medium hover:text-rose-300 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        {!hasSearched && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-3">Pencarian Populer</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-300 rounded-full text-sm hover:bg-zinc-800 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            <p className="text-zinc-500 mt-3">Mencari...</p>
          </div>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Search className="w-16 h-16 text-zinc-700 mb-4" />
            <p className="text-zinc-400">Tidak ada hasil untuk "{query}"</p>
            <p className="text-zinc-600 text-sm mt-1">Coba kata kunci lain</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="p-4">
            <p className="text-sm text-zinc-500 mb-4">{results.length} hasil ditemukan</p>
            <div className="space-y-3">
              {results.map((result) => (
                <button
                  key={result.shortPlayId}
                  onClick={() => onDramaClick(convertSearchResultToDrama(result))}
                  className="w-full flex gap-4 p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors text-left"
                >
                  <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={result.shortPlayCover}
                      alt={result.shortPlayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <h4
                      className="font-semibold text-white mb-1 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: result.shortPlayName.replace(
                          /<em>/g,
                          '<span class="text-rose-400">'
                        ).replace(/<\/em>/g, '</span>')
                      }}
                    />
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.labelNameList?.slice(0, 2).map((label) => (
                        <span
                          key={label}
                          className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded-full"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>{result.formatHeatScore}</span>
                    </div>
                    {result.shotIntroduce && (
                      <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                        {result.shotIntroduce}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
