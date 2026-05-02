import { Ticket } from "lucide-react";

/**
 * StatsCard - Displays user statistics
 */
export const StatsCard = ({ stats }) => {
  return (
    <div className="card p-8 mb-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Your Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bookings stat */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-600 font-medium">
              Total Bookings
            </p>
            <p className="text-3xl font-black text-indigo-600">
              {stats.bookings}
            </p>
          </div>
        </div>

        {/* Placeholder for future stats */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 flex items-center gap-4 opacity-50">
          <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-slate-600 font-medium">
              Events Attended
            </p>
            <p className="text-3xl font-black text-purple-600">
              Coming Soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
