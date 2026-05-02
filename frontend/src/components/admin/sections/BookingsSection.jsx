import { Plus, Download } from "lucide-react";
import AdminModal from "../AdminModal";
import { BookingsTable } from "../tables/AdminTables";
import { BookingForm } from "../forms/AdminForms";
import { emptyForms, validateBooking, exportBookingsCSV } from "../../../utils/adminUtils";

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

export const BookingsSection = ({
  bookings,
  users,
  events,
  modal,
  bookingForm,
  setBookingForm,
  usingSampleData,
  onOpenCreate,
  onCloseModal,
  onCreateBooking,
  onCancelBooking,
  onDeleteBooking,
  submitting,
  error,
  setError
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateBooking(bookingForm);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      await onCreateBooking(bookingForm);
      onCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Panel
        title="All Bookings"
        exportAction={() => exportBookingsCSV(bookings, users, events)}
        action={<AddButton onClick={() => onOpenCreate("bookings")} label="Add Booking" />}
      >
        <BookingsTable
          rows={bookings}
          onCancel={onCancelBooking}
          onDelete={onDeleteBooking}
          readonly={usingSampleData}
        />
      </Panel>

      {modal === "bookings" && (
        <AdminModal title="Add Booking" onClose={onCloseModal}>
          <BookingForm
            form={bookingForm}
            setForm={setBookingForm}
            users={users}
            events={events}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </AdminModal>
      )}
    </>
  );
};
