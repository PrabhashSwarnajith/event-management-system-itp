import { BookingCard } from "./BookingCard";

/**
 * BookingsList - List of bookings
 */
export const BookingsList = ({ bookings, onViewTicket, onViewInvoice, onCancel }) => {
  if (bookings.length === 0) {
    return (
      <div className="card border-dashed p-12 text-center">
        <p className="text-slate-500 text-lg">No bookings in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onViewTicket={onViewTicket}
          onViewInvoice={onViewInvoice}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};
