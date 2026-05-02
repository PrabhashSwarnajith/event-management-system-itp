import { Download } from "lucide-react";
import { UsersOverviewTable, EventsOverviewTable, VenuesOverviewTable, BookingsOverviewTable } from "../tables/AdminTables";
import { exportUsersCSV, exportEventsCSV, exportVenuesCSV, exportBookingsCSV } from "../../../utils/adminUtils";

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

export const OverviewSection = ({ users, events, venues, bookings }) => (
  <section className="space-y-5">
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <Panel title="Users Overview" exportAction={() => exportUsersCSV(users)}>
        <UsersOverviewTable rows={users.slice(0, 5)} />
      </Panel>
      <Panel title="Events Overview" exportAction={() => exportEventsCSV(events)}>
        <EventsOverviewTable rows={events.slice(0, 5)} />
      </Panel>
      <Panel title="Venues Overview" exportAction={() => exportVenuesCSV(venues)}>
        <VenuesOverviewTable rows={venues.slice(0, 5)} />
      </Panel>
      <Panel title="Bookings Overview" exportAction={() => exportBookingsCSV(bookings, users, events)}>
        <BookingsOverviewTable rows={bookings.slice(0, 5)} />
      </Panel>
    </div>
  </section>
);
