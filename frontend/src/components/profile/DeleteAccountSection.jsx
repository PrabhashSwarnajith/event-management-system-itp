import { useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";

export const DeleteAccountSection = ({ user, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [error, setError]             = useState("");

  const handleDelete = async () => {
    if (!showConfirm) { setShowConfirm(true); return; }
    setDeleting(true);
    setError("");
    try {
      await onDelete();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-red-700 dark:text-red-400">Delete Account</h3>
          <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">
            Permanently remove your account and all bookings. This cannot be undone.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg mb-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {showConfirm ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-red-300 dark:border-red-800 rounded-xl p-4 mb-4">
          <p className="text-sm font-bold text-red-800 dark:text-red-300 mb-2">
            Are you sure? This will delete your account and all your bookings.
          </p>
          <p className="text-xs text-red-600 dark:text-red-500 mb-4">
            Deleting account: <span className="font-mono font-bold">{user.email}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
              className="flex-1 btn-ghost text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
        >
          Delete My Account
        </button>
      )}
    </div>
  );
};
