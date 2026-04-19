import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Calendar, Building2, Ticket, Activity, AlertCircle, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

const AdminDashboard = () => {
  const { user, authFetch } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalVenues: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/admin/dashboard-stats");
        if (!res.ok) throw new Error("Failed to load dashboard statistics");
        setStats(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "ADMIN") fetchStats();
    else setLoading(false);
  }, [user, authFetch]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-28 text-center animate-fade-in">
        <div className="card p-12">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Access Denied</h2>
          <p className="text-slate-500">Only administrators can access this dashboard.</p>
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "Users", value: stats.totalUsers, color: "#3b82f6" },
    { name: "Events", value: stats.totalEvents, color: "#4f46e5" },
    { name: "Venues", value: stats.totalVenues, color: "#10b981" },
    { name: "Bookings", value: stats.totalBookings, color: "#f59e0b" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1.5">System overview and statistics.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          {/* Users Card */}
          <div className="card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <span className="badge badge-blue">Active</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Users</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalUsers}</h3>
            </div>
          </div>

          {/* Events Card */}
          <div className="card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Calendar className="w-6 h-6" />
              </div>
              <Link to="/manage-events" className="text-xs font-semibold text-indigo-600 hover:underline">Manage &rarr;</Link>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Events</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalEvents}</h3>
            </div>
          </div>

          {/* Venues Card */}
          <div className="card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Building2 className="w-6 h-6" />
              </div>
              <Link to="/manage-venues" className="text-xs font-semibold text-emerald-600 hover:underline">Manage &rarr;</Link>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Venues</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalVenues}</h3>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Ticket className="w-6 h-6" />
              </div>
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Bookings</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalBookings}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics Chart (Special Function - Member 5) */}
      {!loading && !error && (
        <div className="card p-7 mt-8 animate-fade-up border-t-4 border-t-indigo-500">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">System Analytics</h2>
              <p className="text-sm text-slate-500">Visual overview of platform metrics</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [<span className="font-bold text-slate-700">{value}</span>, "Total"]}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
