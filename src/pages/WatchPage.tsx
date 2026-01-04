import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, BookmarkPlus, BookmarkCheck, List, Info, Loader2, Grid, LayoutList } from 'lucide-react';
import { VideoPlayer } from '../components/VideoPlayer';
import { EpisodeList, EpisodeGrid } from '../components/EpisodeList';
import { fetchAllEpisodes } from '../services/api';
import type { Drama, DramaDetail, Episode } from '../types/drama';

interface WatchPageProps {
  drama: Drama;
  isInLibrary: boolean;
  onBack: () => void;
  onToggleLibrary: () => void;
}

export function WatchPage({ drama, isInLibrary, onBack, onToggleLibrary }: WatchPageProps) {
  const [dramaDetail, setDramaDetail] = useState<DramaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const loadEpisodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAllEpisodes(drama.shortPlayId);
        setDramaDetail(data);
        if (data.shortPlayEpisodeInfos?.length > 0) {
          setCurrentEpisode(data.shortPlayEpisodeInfos[0]);
        } else {
          setError('Drama ini belum tersedia. Silakan cek kembali nanti.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat episode');
      } finally {
        setIsLoading(false);
      }
    };

    loadEpisodes();
  }, [drama.shortPlayId]);

  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  };

  const handleNextEpisode = () => {
    if (!dramaDetail || !currentEpisode || !dramaDetail.shortPlayEpisodeInfos) return;
    const currentIndex = dramaDetail.shortPlayEpisodeInfos.findIndex(
      (ep) => ep.episodeId === currentEpisode.episodeId
    );
    if (currentIndex < dramaDetail.shortPlayEpisodeInfos.length - 1) {
      setCurrentEpisode(dramaDetail.shortPlayEpisodeInfos[currentIndex + 1]);
    }
  };

  const handlePreviousEpisode = () => {
    if (!dramaDetail || !currentEpisode || !dramaDetail.shortPlayEpisodeInfos) return;
    const currentIndex = dramaDetail.shortPlayEpisodeInfos.findIndex(
      (ep) => ep.episodeId === currentEpisode.episodeId
    );
    if (currentIndex > 0) {
      const prevEpisode = dramaDetail.shortPlayEpisodeInfos[currentIndex - 1];
      setCurrentEpisode(prevEpisode);
    }
  };

  const currentIndex = dramaDetail?.shortPlayEpisodeInfos?.findIndex(
    (ep) => ep.episodeId === currentEpisode?.episodeId
  ) ?? -1;

  const hasNext = currentIndex < (dramaDetail?.shortPlayEpisodeInfos?.length ?? 0) - 1;
  const hasPrevious = currentIndex > 0;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
          <p className="text-zinc-400">Memuat episode...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 px-4 text-center">
          <p className="text-rose-400">{error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (isPlaying && currentEpisode) {
    return (
      <VideoPlayer
        episode={currentEpisode}
        dramaName={dramaDetail?.shortPlayName || drama.shortPlayName}
        onClose={() => setIsPlaying(false)}
        onNext={handleNextEpisode}
        onPrevious={handlePreviousEpisode}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto">
      <div className="relative">
        <div className="relative h-56 sm:h-72">
          <img
            src={dramaDetail?.shortPlayCover || drama.shortPlayCover}
            alt={dramaDetail?.shortPlayName || drama.shortPlayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <button
            onClick={onBack}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="px-4 -mt-16 relative">
          <div className="flex gap-4 mb-4">
            <div className="w-28 h-40 rounded-xl overflow-hidden flex-shrink-0 shadow-xl">
              <img
                src={dramaDetail?.shortPlayCover || drama.shortPlayCover}
                alt={dramaDetail?.shortPlayName || drama.shortPlayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pt-16">
              <h1 className="text-xl font-bold text-white mb-2">
                {dramaDetail?.shortPlayName || drama.shortPlayName}
              </h1>
              <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                <span>{dramaDetail?.totalEpisode || 0} Episode</span>
                <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                <span>{dramaDetail?.isFinish ? 'Selesai' : 'Ongoing'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-sm text-zinc-400">{dramaDetail?.defaultLikeNums?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => currentEpisode && setIsPlaying(true)}
              disabled={!currentEpisode}
              className={`flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                currentEpisode
                  ? 'bg-rose-500 text-white hover:bg-rose-400'
                  : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {currentEpisode ? 'Tonton Sekarang' : 'Tidak Tersedia'}
            </button>
            <button
              onClick={onToggleLibrary}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isInLibrary
                  ? 'bg-sky-500 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {isInLibrary ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
            </button>
            <button className="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {(dramaDetail?.shortPlayLabels || drama.labelArray)?.map((label) => (
              <span
                key={label}
                className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>

          {dramaDetail?.shotIntroduce && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Sinopsis
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {dramaDetail.shotIntroduce}
              </p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase flex items-center gap-2">
                <List className="w-4 h-4" />
                Episode ({dramaDetail?.shortPlayEpisodeInfos?.length || 0})
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex bg-zinc-800 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setShowEpisodes(!showEpisodes)}
                  className="text-sm text-rose-400 hover:text-rose-300 transition-colors"
                >
                  {showEpisodes ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
            </div>

            {showEpisodes && dramaDetail?.shortPlayEpisodeInfos && (
              viewMode === 'list' ? (
                <EpisodeList
                  episodes={dramaDetail.shortPlayEpisodeInfos}
                  currentEpisodeId={currentEpisode?.episodeId}
                  onEpisodeSelect={handleEpisodeSelect}
                />
              ) : (
                <EpisodeGrid
                  episodes={dramaDetail.shortPlayEpisodeInfos}
                  currentEpisodeId={currentEpisode?.episodeId}
                  onEpisodeSelect={handleEpisodeSelect}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
