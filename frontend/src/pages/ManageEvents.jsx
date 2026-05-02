import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import EventFormCard from "../components/events/EventFormCard";
import EventsList from "../components/events/EventsList";
import { useManageEvents } from "../hooks/useManageEvents";

const ManageEvents = () => {
  const { user, authFetch } = useAuth();
  const {
    events,
    venues,
    editingId,
    message,
    formData,
    submitting,
    setMessage,
    setFormData,
    handleSubmit,
    handleEdit,
    handleCancelEdit,
    handleDelete,
  } = useManageEvents(authFetch, user);

  // Access guard
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center animate-fade-in">
        <div className="card p-12">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Access Denied</h2>
          <p className="text-slate-500 mb-6">Only administrators can manage events.</p>
          <Link to="/" className="btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-black text-slate-900">Manage Events</h1>
        <p className="text-slate-500 mt-1.5">Create, edit, and publish events for your attendees.</p>
      </div>

      {/* Form Card */}
      <EventFormCard
        editingId={editingId}
        message={message}
        formData={formData}
        setFormData={setFormData}
        venues={venues}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />

      {/* Events List */}
      <EventsList
        events={events}
        editingId={editingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageEvents;
