/**
 * EventSkeleton - Skeleton loader for event cards (dark-mode aware via CSS vars)
 */
export const EventSkeleton = () => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-fade-up">
    <div className="skeleton h-48 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-10 w-full mt-4 rounded-xl" />
    </div>
  </div>
);
