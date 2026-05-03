import { Plus, Download } from "lucide-react";
import AdminModal from "../AdminModal";
import { UsersTable } from "../tables/AdminTables";
import { UserForm } from "../forms/AdminForms";
import { emptyForms, validateUser, exportUsersCSV } from "../../../utils/adminUtils";

const AddButton = ({ onClick, label }) => (
  <button onClick={onClick} className="btn-primary h-9 px-3 text-sm cursor-pointer">
    <Plus className="h-4 w-4" />
    {label}
  </button>
);

const Panel = ({ title, action, exportAction, children }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
      <h2 className="text-base font-black text-slate-900 dark:text-white">{title}</h2>
      <div className="flex items-center gap-2">
        {exportAction && (
          <button onClick={exportAction} className="btn-ghost h-9 px-3 text-sm cursor-pointer">
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

export const UsersSection = ({
  users,
  modal,
  editingUserId,
  userForm,
  setUserForm,
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
    const validationError = validateUser(userForm);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!editingUserId && !userForm.password.trim()) {
      setError("Password is required");
      return;
    }
    try {
      await onSave(userForm, Boolean(editingUserId), editingUserId);
      onCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Panel
        title="All Users"
        exportAction={() => exportUsersCSV(users)}
        action={<AddButton onClick={() => onOpenCreate("users")} label="Add User" />}
      >
        <UsersTable
          rows={users}
          onEdit={onEdit}
          onDelete={onDelete}
          readonly={usingSampleData}
        />
      </Panel>

      {modal === "users" && (
        <AdminModal
          title={editingUserId ? "Update User" : "Add User"}
          onClose={onCloseModal}
        >
          <UserForm
            form={userForm}
            setForm={setUserForm}
            onSubmit={handleSubmit}
            submitting={submitting}
            editing={Boolean(editingUserId)}
          />
        </AdminModal>
      )}
    </>
  );
};
