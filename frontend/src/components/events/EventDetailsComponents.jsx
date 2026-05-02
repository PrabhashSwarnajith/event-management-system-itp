/**
 * LoadingSkeleton - Skeleton loader for event details page
 */
export const LoadingSkeleton = () => (
  <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
    <div className="skeleton h-5 w-32 mb-6" />
    <div className="card overflow-hidden">
      <div className="skeleton h-72 w-full" />
      <div className="p-10 space-y-4">
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-5 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  </div>
);

/**
 * MetaPill - Meta information display pill
 */
export const MetaPill = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
    <Icon className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" aria-hidden="true" />
    <div className="text-sm text-slate-700 leading-snug">{children}</div>
  </div>
);
