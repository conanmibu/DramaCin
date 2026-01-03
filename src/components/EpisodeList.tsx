import { Play } from 'lucide-react';
import type { Episode } from '../types/drama';

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId?: string;
  onEpisodeSelect: (episode: Episode) => void;
}

export function EpisodeGrid({ episodes, currentEpisodeId, onEpisodeSelect }: EpisodeListProps) {
  return (
    <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
      {episodes.map((episode) => {
        const isCurrent = episode.episodeId === currentEpisodeId;

        return (
          <button
            key={episode.episodeId}
            onClick={() => onEpisodeSelect(episode)}
            className={`h-8 rounded flex items-center justify-center transition-all text-xs font-medium ${
              isCurrent
                ? 'bg-rose-500 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {episode.episodeNo}
          </button>
        );
      })}
    </div>
  );
}

export function EpisodeList({ episodes, currentEpisodeId, onEpisodeSelect }: EpisodeListProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {episodes.map((episode) => {
        const isCurrent = episode.episodeId === currentEpisodeId;

        return (
          <button
            key={episode.episodeId}
            onClick={() => onEpisodeSelect(episode)}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all text-sm ${
              isCurrent
                ? 'bg-rose-500 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {isCurrent && <Play className="w-3 h-3 fill-white" />}
            <span>Ep {episode.episodeNo}</span>
          </button>
        );
      })}
    </div>
  );
}
