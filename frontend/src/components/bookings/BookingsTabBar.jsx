export const BookingsTabBar = ({ activeTab, onTabChange, tabCounts }) => {
  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past",     label: "Past" },
    { id: "cancelled",label: "Cancelled" },
  ];

  return (
    <div
      className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-fit mb-6"
      role="tablist"
    >
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={activeTab === id}
          onClick={() => onTabChange(id)}
          id={`bookings-tab-${id}`}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition cursor-pointer ${
            activeTab === id
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          {label}
          {tabCounts[id] > 0 && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
              activeTab === id
                ? "bg-white/20 text-white"
                : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
            }`}>
              {tabCounts[id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
