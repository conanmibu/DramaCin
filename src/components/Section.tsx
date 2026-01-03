import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onSeeAll?: () => void;
  horizontal?: boolean;
}

export function Section({ title, subtitle, children, onSeeAll, horizontal = true }: SectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 blur-md bg-gradient-to-r from-rose-500 to-amber-500 opacity-30" />
            <div className="relative w-1 h-6 bg-gradient-to-b from-rose-500 to-amber-500 rounded-full" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-zinc-500 font-medium">{subtitle}</p>}
          </div>
        </div>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="group flex items-center gap-1 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 hover:from-rose-300 hover:to-amber-300 transition-all duration-300"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all duration-300" />
          </button>
        )}
      </div>
      {horizontal ? (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-2">
          {children}
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {children}
        </div>
      )}
    </section>
  );
}
