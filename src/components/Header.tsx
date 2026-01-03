import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearchClick?: () => void;
}

export function Header({ title = 'DramaCina', showSearch = true, onSearchClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/30">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-amber-500/5" />
        <div className="relative flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-gradient-to-br from-rose-500 to-amber-500 opacity-50 animate-pulse" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30 transform rotate-3">
                <span className="text-white font-black text-sm tracking-tight">DC</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-100 tracking-tight">{title}</h1>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-semibold">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showSearch && (
              <button
                onClick={onSearchClick}
                className="group w-10 h-10 rounded-xl bg-zinc-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-br hover:from-rose-500/20 hover:to-amber-500/20 transition-all duration-300 border border-zinc-700/50 hover:border-rose-500/30"
              >
                <Search className="w-5 h-5 text-zinc-400 group-hover:text-rose-400 transition-colors" />
              </button>
            )}
            <button className="group relative w-10 h-10 rounded-xl bg-zinc-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-br hover:from-rose-500/20 hover:to-amber-500/20 transition-all duration-300 border border-zinc-700/50 hover:border-rose-500/30">
              <Bell className="w-5 h-5 text-zinc-400 group-hover:text-rose-400 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            </button>
            <button className="group w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm flex items-center justify-center hover:from-rose-500/20 hover:to-amber-500/20 transition-all duration-300 border border-zinc-700/50 hover:border-amber-500/30">
              <User className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
