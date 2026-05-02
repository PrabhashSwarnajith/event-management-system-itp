import { FileText, Download, Users, Calendar, Building2, Ticket, BarChart3, TrendingUp } from "lucide-react";

/**
 * ReportsSection — Member 1 (Prabhash) unique feature.
 * Full CSV report generation for all system entities.
 */
export const ReportsSection = ({ users, events, venues, bookings }) => {
  const downloadCSV = (filename, rows) => {
    const BOM = "\uFEFF"; // UTF-8 BOM for Excel compatibility
    const csvContent = BOM + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportUsers = () => {
    const headers = ["ID", "Name", "Email", "Role", "Student ID", "Department", "Joined"];
    const rows = [headers.join(",")];
    users.forEach((u) => {
      rows.push([
        u.id,
        `"${(u.name || "").replace(/"/g, '""')}"`,
        `"${u.email || ""}"`,
        u.role || "ATTENDEE",
        `"${u.studentId || ""}"`,
        `"${u.department || ""}"`,
        u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "",
      ].join(","));
    });
    downloadCSV(`unievents_users_${today()}.csv`, rows);
  };

  const handleExportEvents = () => {
    const headers = ["ID", "Title", "Category", "Date", "Capacity", "Venue", "Status", "Organizer ID"];
    const rows = [headers.join(",")];
    events.forEach((e) => {
      rows.push([
        e.id,
        `"${(e.title || "").replace(/"/g, '""')}"`,
        `"${e.category || ""}"`,
        e.eventDate ? new Date(e.eventDate).toLocaleString() : "",
        e.capacity,
        `"${e.venue?.name || "No Venue"}"`,
        e.status || "PUBLISHED",
        e.organizerId || "",
      ].join(","));
    });
    downloadCSV(`unievents_events_${today()}.csv`, rows);
  };

  const handleExportVenues = () => {
    const headers = ["ID", "Name", "Location", "Capacity", "Available", "Amenities"];
    const rows = [headers.join(",")];
    venues.forEach((v) => {
      rows.push([
        v.id,
        `"${(v.name || "").replace(/"/g, '""')}"`,
        `"${(v.location || "").replace(/"/g, '""')}"`,
        v.capacity,
        v.available ? "Yes" : "No",
        `"${(v.amenities || "").replace(/"/g, '""')}"`,
      ].join(","));
    });
    downloadCSV(`unievents_venues_${today()}.csv`, rows);
  };

  const handleExportBookings = () => {
    const headers = ["Booking ID", "Student Name", "Student Email", "Event", "Event Date", "Venue", "Tickets", "Status", "Booked On"];
    const rows = [headers.join(",")];
    bookings.forEach((b) => {
      const eventDate = b.event?.eventDate ? new Date(b.event.eventDate).toLocaleDateString() : "";
      rows.push([
        b.id,
        `"${b.userName || ""}"`,
        `"${b.userEmail || ""}"`,
        `"${(b.eventTitle || b.event?.title || "").replace(/"/g, '""')}"`,
        eventDate,
        `"${b.event?.venue?.name || ""}"`,
        b.ticketCount,
        b.status || "CONFIRMED",
        b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "",
      ].join(","));
    });
    downloadCSV(`unievents_bookings_${today()}.csv`, rows);
  };

  const handleExportSummary = () => {
    const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;
    const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED").length;
    const totalRevenue = confirmedBookings * 250;

    const rows = [
      `"UniEvents System Summary Report — Generated: ${new Date().toLocaleString()}"`,
      "",
      `"METRIC","VALUE"`,
      `"Total Registered Users","${users.length}"`,
      `"Admin Users","${users.filter((u) => u.role === "ADMIN").length}"`,
      `"Student Attendees","${users.filter((u) => u.role === "ATTENDEE").length}"`,
      `"Total Events","${events.length}"`,
      `"Published Events","${events.filter((e) => e.status === "PUBLISHED").length}"`,
      `"Total Venues","${venues.length}"`,
      `"Available Venues","${venues.filter((v) => v.available !== false).length}"`,
      `"Total Bookings","${bookings.length}"`,
      `"Confirmed Bookings","${confirmedBookings}"`,
      `"Cancelled Bookings","${cancelledBookings}"`,
      `"Estimated Revenue (LKR)","${totalRevenue.toLocaleString()}"`,
    ];
    downloadCSV(`unievents_summary_${today()}.csv`, rows);
  };

  const today = () => new Date().toISOString().split("T")[0];

  // Stats for quick display
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const estimatedRevenue = confirmedCount * 250;
  const availableVenues = venues.filter((v) => v.available !== false).length;

  const reportCards = [
    {
      id: "users",
      title: "Users Report",
      description: "All registered students and admins",
      icon: Users,
      color: "indigo",
      count: users.length,
      label: "users",
      onClick: handleExportUsers,
    },
    {
      id: "events",
      title: "Events Report",
      description: "All system events with dates and venues",
      icon: Calendar,
      color: "violet",
      count: events.length,
      label: "events",
      onClick: handleExportEvents,
    },
    {
      id: "venues",
      title: "Venues Report",
      description: "All campus venues with amenities",
      icon: Building2,
      color: "cyan",
      count: availableVenues,
      label: "available venues",
      onClick: handleExportVenues,
    },
    {
      id: "bookings",
      title: "Bookings Report",
      description: "All booking records with student details",
      icon: Ticket,
      color: "emerald",
      count: confirmedCount,
      label: "confirmed bookings",
      onClick: handleExportBookings,
    },
  ];

  const colorMap = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "hover:border-indigo-300 hover:bg-indigo-50", badge: "bg-indigo-100 text-indigo-700" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", border: "hover:border-violet-300 hover:bg-violet-50", badge: "bg-violet-100 text-violet-700" },
    cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "hover:border-cyan-300 hover:bg-cyan-50", badge: "bg-cyan-100 text-cyan-700" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "hover:border-emerald-300 hover:bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-black text-slate-900">System Reports & Analytics</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Generate and download CSV reports for any system entity. Data is exported with UTF-8 encoding for Excel compatibility.
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-black text-slate-900">{users.length}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Total Users</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-black text-slate-900">{events.length}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Total Events</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-2xl font-black text-slate-900">{bookings.length}</p>
            <p className="text-xs text-slate-500 font-semibold mt-1">Total Bookings</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-2xl font-black text-emerald-700">LKR {estimatedRevenue.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">Est. Revenue</p>
          </div>
        </div>

        {/* Report cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reportCards.map((card) => {
            const colors = colorMap[card.color];
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={card.onClick}
                className={`group flex items-center gap-4 rounded-xl border border-slate-200 p-5 text-left transition cursor-pointer ${colors.border}`}
                id={`export-${card.id}-btn`}
              >
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-slate-900 text-sm">{card.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${colors.badge}`}>
                      {card.count} {card.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{card.description}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-slate-800 transition">
                  <Download className="h-4 w-4" />
                  CSV
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary report */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900">Executive Summary Report</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          A combined overview report with all key metrics — ideal for management presentations.
        </p>
        <button
          onClick={handleExportSummary}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          id="export-summary-btn"
        >
          <Download className="h-4 w-4" />
          Download Executive Summary
        </button>
      </div>
    </div>
  );
};
