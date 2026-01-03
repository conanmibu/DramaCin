import { Home, Flame, Sparkles, BookMarked } from 'lucide-react';
import type { TabType } from '../types/drama';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'home' as TabType, label: 'Home', icon: Home },
  { id: 'hot' as TabType, label: 'Hot', icon: Flame },
  { id: 'foryou' as TabType, label: 'For You', icon: Sparkles },
  { id: 'library' as TabType, label: 'Library', icon: BookMarked },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="max-w-lg mx-auto bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-800/50 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-amber-500/5" />
          <div className="relative flex items-center justify-around py-3">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`relative flex flex-col items-center gap-1.5 py-2 px-4 rounded-xl transition-all duration-500 ${
                    isActive
                      ? 'scale-105'
                      : 'hover:bg-zinc-800/30'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent rounded-xl" />
                  )}
                  <div className={`relative ${isActive ? 'transform -translate-y-1' : ''} transition-all duration-500`}>
                    {isActive && (
                      <div className="absolute inset-0 blur-xl bg-rose-500/40 rounded-full animate-pulse" />
                    )}
                    <div className={`relative ${isActive ? 'bg-gradient-to-br from-rose-500 to-amber-500 p-2 rounded-xl shadow-lg shadow-rose-500/30' : 'p-2'}`}>
                      <Icon
                        className={`w-5 h-5 ${isActive ? 'text-white stroke-[2.5]' : 'text-zinc-500 stroke-[1.5]'}`}
                        fill={isActive && id === 'hot' ? 'currentColor' : 'none'}
                      />
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold transition-all duration-500 relative z-10 ${
                    isActive
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400'
                      : 'text-zinc-500'
                  }`}>
                    {label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
