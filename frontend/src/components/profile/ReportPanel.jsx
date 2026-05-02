import { useState } from "react";
import { Download, FileText, Calendar, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const ReportPanel = () => {
  const { authFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleGenerateEventsReport = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await authFetch("http://localhost:8080/api/events");
      if (!res.ok) throw new Error("Failed to fetch events data");
      const events = await res.json();
      
      const headers = ["ID", "Title", "Category", "Date", "Capacity", "Venue Name", "Status"];
      const csvRows = [headers.join(",")];
      
      events.forEach(event => {
        const row = [
          event.id,
          `"${event.title?.replace(/"/g, '""') || ""}"`,
          `"${event.category || ""}"`,
          event.eventDate,
          event.capacity,
          `"${event.venue?.name || "No Venue"}"`,
          event.status || "PUBLISHED"
        ];
        csvRows.push(row.join(","));
      });
      
      downloadCSV("system_events_report.csv", csvRows);
      setMessage("Events report generated successfully!");
    } catch (err) {
      setMessage("Error generating events report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVenuesReport = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await authFetch("http://localhost:8080/api/venues");
      if (!res.ok) throw new Error("Failed to fetch venues data");
      const venues = await res.json();
      
      const headers = ["ID", "Name", "Location", "Capacity", "Available", "Amenities"];
      const csvRows = [headers.join(",")];
      
      venues.forEach(venue => {
        const row = [
          venue.id,
          `"${venue.name?.replace(/"/g, '""') || ""}"`,
          `"${venue.location?.replace(/"/g, '""') || ""}"`,
          venue.capacity,
          venue.available ? "Yes" : "No",
          `"${venue.amenities?.replace(/"/g, '""') || ""}"`
        ];
        csvRows.push(row.join(","));
      });
      
      downloadCSV("system_venues_report.csv", csvRows);
      setMessage("Venues report generated successfully!");
    } catch (err) {
      setMessage("Error generating venues report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-7 mb-6 animate-fade-up">
      <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        Generate Reports
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Export system data to CSV format. This feature is available for all team members.
      </p>

      {message && (
        <div className={`text-sm mb-4 p-3 rounded-lg ${message.includes("Error") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleGenerateEventsReport}
          disabled={loading}
          className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-900 text-sm">Events Report</h3>
              <p className="text-xs text-slate-500">All scheduled events</p>
            </div>
          </div>
          <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
        </button>

        <button
          onClick={handleGenerateVenuesReport}
          disabled={loading}
          className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-white transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-slate-900 text-sm">Venues Report</h3>
              <p className="text-xs text-slate-500">All registered venues</p>
            </div>
          </div>
          <Download className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
        </button>
      </div>
    </div>
  );
};
