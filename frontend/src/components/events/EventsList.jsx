import { CalendarIcon, MapPinIcon, UsersIcon, Edit2Icon, Trash2Icon, Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { formatEventDate, exportEventsToCSV } from "../../utils/eventManagementUtils";

const EventsList = ({ 
  events, 
  editingId, 
  onEdit, 
  onDelete, 
  onExport 
}) => {
  return (
    <div className="card p-7 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Published Events
          {events.length > 0 && (
            <span className="ml-2 badge badge-indigo">{events.length}</span>
          )}
        </h2>
        {events.length > 0 && (
          <button
            onClick={() => exportEventsToCSV(events)}
            className="btn-ghost text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-sm py-1.5 px-3 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" /> Export to CSV
          </button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
          <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="font-medium">No events created yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              isEditing={editingId === event.id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EventItem = ({ event, isEditing, onEdit, onDelete }) => {
  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        isEditing
          ? "border-indigo-300 bg-indigo-50"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-slate-900 truncate">{event.title}</h3>
            {event.category && (
              <span className="badge badge-indigo">{event.category}</span>
            )}
          </div>
          <p className="text-sm text-slate-500 line-clamp-1 mb-3">{event.description}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
              {formatEventDate(event.eventDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-3.5 h-3.5 text-indigo-400" />
              {event.venue?.name || "No Venue"}
            </span>
            <span className="flex items-center gap-1.5">
              <UsersIcon className="w-3.5 h-3.5 text-indigo-400" />
              {event.capacity} seats
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2 flex-wrap">
          <Link
            to={`/events/${event.id}`}
            className="btn-ghost text-sm py-1.5 px-3 cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye className="w-4 h-4" /> View
          </Link>
          <button
            type="button"
            onClick={() => onEdit(event)}
            className="btn-ghost text-indigo-700 border-indigo-200 hover:bg-indigo-50 text-sm py-1.5 px-3 cursor-pointer"
          >
            <Edit2Icon className="w-4 h-4" /> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(event.id)}
            className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 text-sm py-1.5 px-3 cursor-pointer"
          >
            <Trash2Icon className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsList;
