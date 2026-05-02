import { Download, BarChart3, Users, Calendar, Building2, Ticket } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { UsersOverviewTable, EventsOverviewTable, VenuesOverviewTable, BookingsOverviewTable } from "../tables/AdminTables";
import { exportUsersCSV, exportEventsCSV, exportVenuesCSV, exportBookingsCSV } from "../../../utils/adminUtils";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

const Panel = ({ title, action, exportAction, children }) => (
  <div className="rounded-lg border border-slate-200 bg-white">
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
      <div className="flex items-center gap-2">
        {exportAction && (
          <button onClick={exportAction} className="btn-ghost h-9 px-3 text-sm cursor-pointer bg-white border border-slate-200">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        )}
        {action}
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

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
        {/* Bookings per Event Bar Chart */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">Bookings per Event</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bookingsByEvent} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
              />
              <Bar dataKey="bookings" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie charts row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 xl:grid-cols-1 xl:gap-3">
          {/* Category Pie */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-indigo-500" /> Events by Category
            </h3>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Status Pie */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-1.5">
              <Ticket className="h-4 w-4 text-emerald-500" /> Booking Status
            </h3>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* User Roles Pie */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-black text-slate-700 mb-3 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-violet-500" /> User Roles
            </h3>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={roleData} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                  <Cell fill="#6366f1" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data tables */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel title="Users Overview" exportAction={() => exportUsersCSV(users)}>
          <UsersOverviewTable rows={users.slice(0, 5)} />
        </Panel>
        <Panel title="Events Overview" exportAction={() => exportEventsCSV(events)}>
          <EventsOverviewTable rows={events.slice(0, 5)} />
        </Panel>
        <Panel title="Venues Overview" exportAction={() => exportVenuesCSV(venues)}>
          <VenuesOverviewTable rows={venues.slice(0, 5)} />
        </Panel>
        <Panel title="Bookings Overview" exportAction={() => exportBookingsCSV(bookings, users, events)}>
          <BookingsOverviewTable rows={bookings.slice(0, 5)} />
        </Panel>
      </div>
    </section>
  );
};
