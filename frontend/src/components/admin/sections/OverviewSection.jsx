import { BarChart3, Users, Calendar, Building2, Ticket } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export const OverviewSection = ({ users, events, venues, bookings }) => {
  // Prepare chart data — bookings per event (top 6)
  const bookingsByEvent = events.slice(0, 6).map((ev) => ({
    name: ev.title?.substring(0, 18) + (ev.title?.length > 18 ? "…" : "") || "Event",
    bookings: bookings.filter((b) => b.eventId === ev.id || b.event?.id === ev.id).length,
  }));

  // Category distribution pie chart
  const categoryCount = {};
  events.forEach((ev) => {
    const cat = ev.category || "Other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  // Booking status breakdown
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter((b) => b.status === "CANCELLED").length;
  const statusData = [
    { name: "Confirmed", value: confirmedCount },
    { name: "Cancelled", value: cancelledCount },
  ];

  // Role distribution
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const attendeeCount = users.filter((u) => u.role === "ATTENDEE").length;
  const roleData = [
    { name: "Admins", value: adminCount },
    { name: "Attendees", value: attendeeCount },
  ];

  return (
    <section className="space-y-5">
      {/* Charts row */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Bookings per Event Bar Chart - Enhanced */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Bookings per Event</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Top {bookingsByEvent.length} events by bookings</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart 
              data={bookingsByEvent} 
              margin={{ top: 20, right: 30, left: -10, bottom: 50 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e2e8f0"
                style={{ opacity: 0.5 }}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                angle={-40}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "#64748b" }}
                width={40}
              />
              <Tooltip
                contentStyle={{ 
                  borderRadius: 12, 
                  border: "1px solid #e2e8f0", 
                  fontSize: 12,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
                cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
              />
              <Bar 
                dataKey="bookings" 
                fill="#6366f1" 
                radius={[8, 8, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie charts row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 xl:grid-cols-1 xl:gap-3">
          {/* Category Pie */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Calendar className="h-4 w-4" />
              </div>
              Events by Category
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={55} 
                  dataKey="value" 
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: 10, fontSize: 11, border: "1px solid #e2e8f0" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Status Pie */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Ticket className="h-4 w-4" />
              </div>
              Booking Status
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie 
                  data={statusData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={55} 
                  dataKey="value"
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: 10, fontSize: 11, border: "1px solid #e2e8f0" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Roles Pie */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                <Users className="h-4 w-4" />
              </div>
              User Roles
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie 
                  data={roleData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={55} 
                  dataKey="value"
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  <Cell fill="#6366f1" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: 10, fontSize: 11, border: "1px solid #e2e8f0" }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
