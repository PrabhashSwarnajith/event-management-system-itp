import { useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";

/**
 * DeleteAccountSection - Delete account section with confirmation
 */
export const DeleteAccountSection = ({ user, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirmDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

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
    <div className="card p-8 border-red-200 bg-red-50 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-red-900 mb-1">
            Delete Account
          </h2>
          <p className="text-sm text-red-700 mb-4">
            Permanently delete your account and all associated data. This
            action cannot be undone.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-800 p-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {showConfirm && (
            <div className="bg-white border-2 border-red-300 rounded-lg p-4 mb-4">
              <p className="text-sm font-bold text-red-900 mb-3">
                Are you absolutely sure? This will permanently delete your
                account and all your bookings.
              </p>
              <p className="text-xs text-red-700 mb-4">
                Type your email to confirm: <span className="font-mono font-bold">{user.email}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={deleting}
                  className="flex-1 btn-ghost border-red-300 text-red-700 hover:bg-red-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          )}

          {!showConfirm && (
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Delete My Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
