import { Plus, Download } from "lucide-react";
import AdminModal from "../AdminModal";
import { VenuesTable } from "../tables/AdminTables";
import { VenueForm } from "../forms/AdminForms";
import { emptyForms, validateVenue, exportVenuesCSV } from "../../../utils/adminUtils";

const AddButton = ({ onClick, label }) => (
  <button onClick={onClick} className="btn-primary h-9 px-3 text-sm cursor-pointer">
    <Plus className="h-4 w-4" />
    {label}
  </button>
);

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

export const VenuesSection = ({
  venues,
  modal,
  editingVenueId,
  venueForm,
  setVenueForm,
  usingSampleData,
  onOpenCreate,
  onCloseModal,
  onEdit,
  onDelete,
  onSave,
  submitting,
  error,
  setError
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateVenue(venueForm);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await onSave(venueForm, Boolean(editingVenueId), editingVenueId);
      onCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Panel
        title="All Venues"
        exportAction={() => exportVenuesCSV(venues)}
        action={<AddButton onClick={() => onOpenCreate("venues")} label="Add Venue" />}
      >
        <VenuesTable
          rows={venues}
          onEdit={onEdit}
          onDelete={onDelete}
          readonly={usingSampleData}
        />
      </Panel>

      {modal === "venues" && (
        <AdminModal
          title={editingVenueId ? "Update Venue" : "Add Venue"}
          onClose={onCloseModal}
        >
          <VenueForm
            form={venueForm}
            setForm={setVenueForm}
            onSubmit={handleSubmit}
            submitting={submitting}
            editing={Boolean(editingVenueId)}
          />
        </AdminModal>
      )}
    </>
  );
};
