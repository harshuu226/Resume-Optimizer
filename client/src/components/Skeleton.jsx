export const SkeletonLine = ({ className = '' }) => (
  <div className={`h-4 bg-surface-200 dark:bg-surface-700 rounded-md shimmer ${className}`} />
);

export const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonLine className="w-1/3" />
      <SkeletonLine className="w-16" />
    </div>
    <SkeletonLine className="w-full" />
    <SkeletonLine className="w-5/6" />
    <SkeletonLine className="w-4/6" />
    <div className="flex gap-3 pt-2">
      <SkeletonLine className="w-20 h-8 rounded-lg" />
      <SkeletonLine className="w-20 h-8 rounded-lg" />
    </div>
  </div>
);

export const SkeletonResult = () => (
  <div className="space-y-6 animate-pulse">
    <div className="card p-6 space-y-3">
      <SkeletonLine className="w-1/4 h-5" />
      {[...Array(8)].map((_, i) => (
        <SkeletonLine key={i} className={`${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
    <div className="card p-6 space-y-3">
      <SkeletonLine className="w-1/4 h-5" />
      {[...Array(6)].map((_, i) => (
        <SkeletonLine key={i} className={`${i % 2 === 1 ? 'w-4/5' : 'w-full'}`} />
      ))}
    </div>
  </div>
);
