interface SkeletonProps {
  variant?: 'card' | 'large' | 'horizontal';
  count?: number;
}

export function Skeleton({ variant = 'card', count = 1 }: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'horizontal') {
    return (
      <>
        {items.map((i) => (
          <div key={i} className="flex gap-3 bg-zinc-900/50 rounded-xl p-3 animate-pulse">
            <div className="w-24 h-32 flex-shrink-0 rounded-lg bg-zinc-800" />
            <div className="flex-1 py-1 space-y-2">
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-800 rounded w-full" />
              <div className="h-3 bg-zinc-800 rounded w-2/3" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 bg-zinc-800 rounded-full w-16" />
                <div className="h-5 bg-zinc-800 rounded-full w-16" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'large') {
    return (
      <>
        {items.map((i) => (
          <div key={i} className="w-72 h-96 flex-shrink-0 rounded-2xl bg-zinc-800 animate-pulse" />
        ))}
      </>
    );
  }

  return (
    <>
      {items.map((i) => (
        <div key={i} className="w-36 flex-shrink-0 animate-pulse">
          <div className="aspect-[3/4] rounded-xl bg-zinc-800 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-3/4 mb-1" />
          <div className="h-3 bg-zinc-800 rounded w-1/2" />
        </div>
      ))}
    </>
  );
}
