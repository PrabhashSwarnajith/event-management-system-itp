import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Save, User, Mail, Shield, Hash, CheckCircle, AlertCircle, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ROLE_COLORS = {
  ADMIN: "badge-red",
  ORGANIZER: "badge-indigo",
  ATTENDEE: "badge-green",
};

const ProfilePage = () => {
  const { user, updateUser, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-28 text-center animate-fade-in">
        <div className="card p-12">
          <User className="w-14 h-14 text-slate-300 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Not Logged In</h2>
          <p className="text-slate-500 mb-6">Please log in to view your profile.</p>
          <a href="/auth" className="btn-primary">Go to Login</a>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const res = await authFetch("http://localhost:8080/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not update profile");
      updateUser(data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const res = await authFetch(`http://localhost:8080/api/auth/users/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Could not delete account");
      }

      logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Profile card */}
      <div className="card overflow-hidden mb-6">
        {/* Hero banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white, transparent 50%)" }} />
        </div>

        <div className="px-7 pb-7">
          {/* Avatar + actions */}
          <div className="flex items-end justify-between -mt-12 mb-5">
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg border-4 border-white"
                aria-label={`Avatar for ${user.name}`}
              >
                {initials || <User className="w-10 h-10" />}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn-ghost text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
              id="profile-logout-btn"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Name + role */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 mb-0.5">{user.name}</h1>
            <p className="text-slate-500 mb-3">{user.email}</p>
            <span className={`badge ${ROLE_COLORS[user.role] || "badge-slate"}`}>
              {user.role}
            </span>
          </div>

          {/* Account info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 mb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                <Hash className="w-3.5 h-3.5" /> User ID
              </div>
              <p className="text-sm font-mono text-slate-700 truncate">{user.id}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                <Shield className="w-3.5 h-3.5" /> Role
              </div>
              <p className="text-sm font-semibold text-slate-700">{user.role}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                <CheckCircle className="w-3.5 h-3.5" /> Status
              </div>
              <p className="text-sm font-semibold text-emerald-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card p-7">
        <h2 className="text-xl font-bold text-slate-900 mb-5">Edit Profile</h2>

        {/* Alert messages */}
        {message && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm mb-5 font-semibold animate-fade-in" role="status">
            <CheckCircle className="w-5 h-5 shrink-0" />
            {message}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-5 font-semibold animate-fade-in" role="alert">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="profile-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
                <input
                  id="profile-name"
                  type="text"
                  required
                  className="input-field pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
                <input
                  id="profile-email"
                  type="email"
                  required
                  className="input-field pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary cursor-pointer"
              id="profile-save-btn"
              aria-busy={saving}
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Danger Zone - Delete Account */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </h3>
          
          {deleteConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-4">
              <p className="text-red-900 font-semibold mb-4">
                ⚠️ Are you sure? This action cannot be undone. Your account and all associated data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  id="confirm-delete-btn"
                >
                  {deleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Yes, Delete My Account
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm(false);
                    setError("");
                  }}
                  disabled={deleting}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  id="cancel-delete-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              id="delete-account-btn"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
