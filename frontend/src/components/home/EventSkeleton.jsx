/**
 * EventSkeleton - Skeleton loader for event cards
 */
export const EventSkeleton = () => (
  <div className="card overflow-hidden animate-fade-up">
    <div className="skeleton h-44 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-10 w-full mt-4" />
    </div>
  </div>
);
