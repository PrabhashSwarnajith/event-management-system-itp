import { Ticket, CalendarCheck } from "lucide-react";

export const StatsCard = ({ stats }) => (
  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 mb-4">
    <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Your Statistics</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl p-5">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Ticket className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Bookings</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats.bookings}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-xl p-5 opacity-60">
        <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <CalendarCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Events Attended</p>
          <p className="text-sm font-bold text-violet-500 dark:text-violet-400 mt-1">Coming soon</p>
        </div>
      </div>
    </div>
  </div>
);
