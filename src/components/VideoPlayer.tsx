import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, X, Monitor, Smartphone, Tablet, Subtitles } from 'lucide-react';
import type { Episode, Subtitle } from '../types/drama';
import { fetchSubtitles } from '../services/api';

type PlayerSize = 'small' | 'medium' | 'large' | 'fullscreen';

interface VideoPlayerProps {
  episode: Episode;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  dramaName: string;
}

const sizeConfig = {
  small: 'max-w-sm',
  medium: 'max-w-2xl',
  large: 'max-w-4xl',
  fullscreen: 'w-full h-full',
};

export function VideoPlayer({
  episode,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  dramaName,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playerSize, setPlayerSize] = useState<PlayerSize>('small');
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isLoadingSubtitles, setIsLoadingSubtitles] = useState(false);
  const [isFullscreenMode, setIsFullscreenMode] = useState(false);
  const controlsTimeoutRef = useRef<number>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (hasNext && onNext) {
        onNext();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [hasNext, onNext]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    const loadSubtitles = async () => {
      setIsLoadingSubtitles(true);
      try {
        const data = await fetchSubtitles(episode.shortPlayId, episode.episodeId);
        if (data && data.length > 0) {
          setSubtitles(data);
        }
      } catch (error) {
        console.error('Failed to load subtitles:', error);
      } finally {
        setIsLoadingSubtitles(false);
      }
    };

    loadSubtitles();

    const handleFullscreenChange = () => {
      setIsFullscreenMode(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [episode.episodeId, episode.shortPlayId]);

  // Enable subtitle tracks after they're loaded
  useEffect(() => {
    if (subtitles.length > 0 && videoRef.current) {
      const video = videoRef.current;
      // Wait for tracks to be loaded
      const checkTracks = () => {
        if (video.textTracks.length > 0) {
          // Set first track to showing
          video.textTracks[0].mode = 'showing';
        }
      };

      // Check immediately and after a short delay
      checkTracks();
      const timeout = setTimeout(checkTracks, 100);

      return () => clearTimeout(timeout);
    }
  }, [subtitles]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSizeMenu(false);
      }
    }, 3000);
  };

  const isFullscreen = isFullscreenMode;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isFullscreen) {
          onClose();
        }
      }}
    >
      <div
        ref={containerRef}
        className={`relative bg-black flex flex-col transition-all duration-300 ${
          isFullscreen ? 'w-full h-full' : `${sizeConfig[playerSize]} w-full mx-4 rounded-xl overflow-hidden`
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div>
                <h2 className="text-white font-semibold text-sm sm:text-base">{dramaName}</h2>
                <p className="text-xs sm:text-sm text-zinc-400">Episode {episode.episodeNo}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-white/10 text-white rounded">
                {episode.playClarity}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`flex-1 flex items-center justify-center ${isFullscreen ? '' : 'aspect-video'}`}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={episode.playVoucher}
            className="w-full h-full object-contain"
            poster={episode.episodeCover}
            playsInline
            crossOrigin="anonymous"
          >
            {subtitles.length > 0 && subtitles.map((subtitle, index) => (
              <track
                key={subtitle.sub_id || index}
                kind="subtitles"
                src={subtitle.url}
                srcLang={subtitle.subtitleLanguage === 'id_ID' ? 'id' : subtitle.subtitleLanguage}
                label={subtitle.subtitleLanguage === 'id_ID' ? 'Bahasa Indonesia' : subtitle.subtitleLanguage}
                default={index === 0}
              />
            ))}
          </video>
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
              </div>
            </div>
          )}
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-rose-500 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={(e) => { e.stopPropagation(); onPrevious?.(); }}
                disabled={!hasPrevious}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  hasPrevious ? 'hover:bg-white/10 text-white' : 'text-zinc-600 cursor-not-allowed'
                }`}
              >
                <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center hover:bg-zinc-200 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-black" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-black ml-0.5" />
                )}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNext?.(); }}
                disabled={!hasNext}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  hasNext ? 'hover:bg-white/10 text-white' : 'text-zinc-600 cursor-not-allowed'
                }`}
              >
                <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <span className="text-xs sm:text-sm text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>

              {subtitles.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newState = !showSubtitles;
                    setShowSubtitles(newState);
                    const video = videoRef.current;
                    if (video && video.textTracks.length > 0) {
                      const tracks = video.textTracks;
                      for (let i = 0; i < tracks.length; i++) {
                        tracks[i].mode = newState ? 'showing' : 'hidden';
                      }
                    }
                  }}
                  className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                    showSubtitles ? 'bg-white/20 hover:bg-white/30' : 'hover:bg-white/10'
                  }`}
                  title={showSubtitles ? 'Sembunyikan subtitle' : 'Tampilkan subtitle'}
                >
                  <Subtitles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              )}

              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSizeMenu(!showSizeMenu); }}
                  className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </button>

                {showSizeMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-zinc-900 rounded-lg overflow-hidden shadow-xl border border-zinc-700">
                    <button
                      onClick={(e) => { e.stopPropagation(); setPlayerSize('small'); setShowSizeMenu(false); }}
                      className={`w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-zinc-800 transition-colors ${playerSize === 'small' && !isFullscreen ? 'text-rose-400' : 'text-white'}`}
                    >
                      <Smartphone className="w-4 h-4" />
                      Kecil
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPlayerSize('medium'); setShowSizeMenu(false); }}
                      className={`w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-zinc-800 transition-colors ${playerSize === 'medium' && !isFullscreen ? 'text-rose-400' : 'text-white'}`}
                    >
                      <Tablet className="w-4 h-4" />
                      Sedang
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPlayerSize('large'); setShowSizeMenu(false); }}
                      className={`w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-zinc-800 transition-colors ${playerSize === 'large' && !isFullscreen ? 'text-rose-400' : 'text-white'}`}
                    >
                      <Monitor className="w-4 h-4" />
                      Besar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFullscreen(); setShowSizeMenu(false); }}
                      className={`w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-zinc-800 transition-colors ${isFullscreen ? 'text-rose-400' : 'text-white'}`}
                    >
                      <Maximize className="w-4 h-4" />
                      Layar Penuh
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
