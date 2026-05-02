import { AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useManageVenues } from "../hooks/useManageVenues";
import { VenueForm, VenuesList } from "../components/manage/VenueComponents";

const ManageVenues = () => {
  const { user, authFetch } = useAuth();
  const {
    venues,
    formData,
    editingId,
    message,
    submitting,
    handleSubmit,
    handleEdit,
    handleDelete,
    cancelEdit,
    set,
  } = useManageVenues(authFetch);

  if (user?.role !== "ADMIN") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-28 text-center animate-fade-in">
        <div className="card p-12">
          <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Access Denied</h2>
          <p className="text-slate-500">Only administrators can manage venues.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-4xl font-black text-slate-900">Manage Venues</h1>
        <p className="text-slate-500 mt-1.5">Add and maintain university event venues.</p>
      </div>

      <VenueForm
        formData={formData}
        editingId={editingId}
        message={message}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={cancelEdit}
        set={set}
      />

      <VenuesList
        venues={venues}
        editingId={editingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageVenues;
