import { FileText, Download, Users, Calendar, Building2 } from "lucide-react";

export const ReportsSection = ({ users, events, venues }) => {
  const downloadCSV = (filename, rows) => {
    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportUsers = () => {
    const headers = ["ID", "Name", "Email", "Role", "Student ID", "Department"];
    const rows = [headers.join(",")];
    users.forEach((u) => {
      rows.push([
        u.id, 
        `"${u.name || ""}"`, 
        `"${u.email || ""}"`, 
        u.role || "ATTENDEE",
        `"${u.studentId || ""}"`,
        `"${u.department || ""}"`
      ].join(","));
    });
    downloadCSV("admin_users_report.csv", rows);
  };

  const handleExportEvents = () => {
    const headers = ["ID", "Title", "Category", "Date", "Capacity", "Venue Name"];
    const rows = [headers.join(",")];
    events.forEach((e) => {
      rows.push([
        e.id, 
        `"${e.title?.replace(/"/g, '""') || ""}"`, 
        `"${e.category || ""}"`, 
        e.eventDate, 
        e.capacity, 
        `"${e.venue?.name || "No Venue"}"`
      ].join(","));
    });
    downloadCSV("admin_events_report.csv", rows);
  };

  const handleExportVenues = () => {
    const headers = ["ID", "Name", "Location", "Capacity", "Available", "Amenities"];
    const rows = [headers.join(",")];
    venues.forEach((v) => {
      rows.push([
        v.id,
        `"${v.name?.replace(/"/g, '""') || ""}"`,
        `"${v.location?.replace(/"/g, '""') || ""}"`,
        v.capacity,
        v.available ? "Yes" : "No",
        `"${v.amenities?.replace(/"/g, '""') || ""}"`
      ].join(","));
    });
    downloadCSV("admin_venues_report.csv", rows);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          System Reports Export
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          Generate and download CSV reports for different system entities.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            onClick={handleExportUsers}
            className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-white">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Users Report</h3>
              <p className="text-xs text-slate-500 mt-1">Export all registered users</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Download className="h-4 w-4" /> Download CSV
            </div>
          </button>

          <button
            onClick={handleExportEvents}
            className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-white">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Events Report</h3>
              <p className="text-xs text-slate-500 mt-1">Export all system events</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Download className="h-4 w-4" /> Download CSV
            </div>
          </button>

          <button
            onClick={handleExportVenues}
            className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Venues Report</h3>
              <p className="text-xs text-slate-500 mt-1">Export all registered venues</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Download className="h-4 w-4" /> Download CSV
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
