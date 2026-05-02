/**
 * BookingsTabBar - Tab navigation for bookings filter
 */
export const BookingsTabBar = ({ activeTab, onTabChange, tabCounts }) => {
  const tabs = ["upcoming", "past", "cancelled"];

  return (
    <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-8 animate-fade-up" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onTabChange(tab)}
          id={`bookings-tab-${tab}`}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold capitalize rounded-lg transition-all duration-150 cursor-pointer ${
            activeTab === tab
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          {tab}
          {tabCounts[tab] > 0 && (
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {tabCounts[tab]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
