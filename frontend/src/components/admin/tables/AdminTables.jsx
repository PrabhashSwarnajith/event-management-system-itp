import { Edit2, Trash2 } from "lucide-react";
import AdminTable, { AdminTd, AdminBadge } from "../AdminTable";
import { formatDate } from "../../../utils/adminUtils";

const RowActions = ({ onEdit, onDelete, readonly }) => (
  <div className="flex gap-2">
    <button
      disabled={readonly}
      onClick={onEdit}
      className="rounded-md border border-indigo-200 px-2 py-1 text-indigo-700 hover:bg-indigo-50 disabled:opacity-40 cursor-pointer"
    >
      <Edit2 className="h-3.5 w-3.5" />
    </button>
    <button
      disabled={readonly}
      onClick={onDelete}
      className="rounded-md border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-40 cursor-pointer"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </div>
);

export const UsersOverviewTable = ({ rows }) => (
  <AdminTable headers={["Name", "Role", "Email"]}>
    {rows.map((row) => (
      <tr key={row.id}>
        <AdminTd strong>{row.name}</AdminTd>
        <AdminTd>
          <AdminBadge>{row.role}</AdminBadge>
        </AdminTd>
        <AdminTd>{row.email}</AdminTd>
      </tr>
    ))}
  </AdminTable>
);

export const EventsOverviewTable = ({ rows }) => (
  <AdminTable headers={["Title", "Venue", "Date"]}>
    {rows.map((row) => (
      <tr key={row.id}>
        <AdminTd strong>{row.title}</AdminTd>
        <AdminTd>{row.venue?.name || "-"}</AdminTd>
        <AdminTd>{formatDate(row.eventDate)}</AdminTd>
      </tr>
    ))}
  </AdminTable>
);

export const VenuesOverviewTable = ({ rows }) => (
  <AdminTable headers={["Name", "Location", "Available"]}>
    {rows.map((row) => (
      <tr key={row.id}>
        <AdminTd strong>{row.name}</AdminTd>
        <AdminTd>{row.location}</AdminTd>
        <AdminTd>
          <AdminBadge tone={row.available ? "green" : "red"}>
            {row.available ? "Yes" : "No"}
          </AdminBadge>
        </AdminTd>
      </tr>
    ))}
  </AdminTable>
);

export const BookingsOverviewTable = ({ rows }) => (
  <AdminTable headers={["Event", "User", "Status"]}>
    {rows.map((row) => (
      <tr key={row.id}>
        <AdminTd strong>{row.eventTitle}</AdminTd>
        <AdminTd>{row.userName}</AdminTd>
        <AdminTd>
          <AdminBadge tone={row.status === "CANCELLED" ? "red" : "green"}>
            {row.status}
          </AdminBadge>
        </AdminTd>
      </tr>
    ))}
  </AdminTable>
);

export const UsersTable = ({ rows, onEdit, onDelete, readonly }) => (
  <AdminTable headers={["ID", "Name", "Email", "Role", "Created", "Actions"]}>
    {rows.map((row) => (
      <tr key={row.id}>
        <AdminTd>{row.id}</AdminTd>
        <AdminTd strong>{row.name}</AdminTd>
        <AdminTd>{row.email}</AdminTd>
        <AdminTd>
          <AdminBadge>{row.role}</AdminBadge>
        </AdminTd>
        <AdminTd>{formatDate(row.createdAt)}</AdminTd>
        <AdminTd>
          <RowActions readonly={readonly} onEdit={() => onEdit(row)} onDelete={() => onDelete(row.id)} />
        </AdminTd>
      </tr>
    ))}
  </AdminTable>
);

export const EventsTable = ({ rows, onEdit, onDelete, readonly }) => (
  <AdminTable headers={["ID", "Title", "Category", "Venue", "Date", "Capacity", "Actions"]}>
    {rows.map((row) => (
      <tr key={row.id}>
        <AdminTd>{row.id}</AdminTd>
        <AdminTd strong>{row.title}</AdminTd>
        <AdminTd>{row.category}</AdminTd>
        <AdminTd>{row.venue?.name || "-"}</AdminTd>
        <AdminTd>{formatDate(row.eventDate)}</AdminTd>
        <AdminTd>{row.capacity}</AdminTd>
        <AdminTd>
          <RowActions readonly={readonly} onEdit={() => onEdit(row)} onDelete={() => onDelete(row.id)} />
        </AdminTd>
      </tr>
    ))}
  </AdminTable>
);

export const VenuesTable = ({ rows, onEdit, onDelete, readonly }) => (
  <AdminTable headers={["ID", "Name", "Location", "Capacity", "Available", "Actions"]}>
    {rows.map((row) => (
      <tr key={row.id}>
        <AdminTd>{row.id}</AdminTd>
        <AdminTd strong>{row.name}</AdminTd>
        <AdminTd>{row.location}</AdminTd>
        <AdminTd>{row.capacity}</AdminTd>
        <AdminTd>
          <AdminBadge tone={row.available ? "green" : "red"}>
            {row.available ? "Yes" : "No"}
          </AdminBadge>
        </AdminTd>
        <AdminTd>
          <RowActions readonly={readonly} onEdit={() => onEdit(row)} onDelete={() => onDelete(row.id)} />
        </AdminTd>
      </tr>
    ))}
  </AdminTable>
);

export const BookingsTable = ({ rows, onCancel, onDelete, readonly }) => (
  <AdminTable headers={["ID", "Event", "User", "Email", "Tickets", "Status", "Date", "Actions"]}>
    {rows.map((row) => (
      <tr key={row.id}>
        <AdminTd>{row.id}</AdminTd>
        <AdminTd strong>{row.eventTitle}</AdminTd>
        <AdminTd>{row.userName}</AdminTd>
        <AdminTd>{row.userEmail}</AdminTd>
        <AdminTd>{row.ticketCount}</AdminTd>
        <AdminTd>
          <AdminBadge tone={row.status === "CANCELLED" ? "red" : "green"}>
            {row.status}
          </AdminBadge>
        </AdminTd>
        <AdminTd>{formatDate(row.bookingDate)}</AdminTd>
        <AdminTd>
          <div className="flex gap-2">
            {row.status !== "CANCELLED" && (
              <button
                disabled={readonly}
                onClick={() => onCancel(row.id)}
                className="rounded-md border border-amber-200 px-2 py-1 text-xs font-bold text-amber-700 hover:bg-amber-50 disabled:opacity-40 cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              disabled={readonly}
              onClick={() => onDelete(row.id)}
              className="rounded-md border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50 disabled:opacity-40 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </AdminTd>
      </tr>
    ))}
  </AdminTable>
);
