import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, updateUser, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  if (!user) {
    return <div className="p-10 text-center">Please login to view your profile.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await authFetch("http://localhost:8080/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update profile");
      }

      updateUser(data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-indigo-50 rounded-full p-2 border-4 border-white shadow-md flex items-center justify-center text-indigo-600">
              <User size={48} />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-500 mt-1">{user.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>

          {(message || error) && (
            <div className={`mb-6 rounded-lg p-3 text-sm font-medium ${message ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
              {message || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t pt-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Edit Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-slate-500">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div>
                <label className="text-sm font-medium text-slate-500">Record ID</label>
                <p className="mt-1 font-mono text-slate-900">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Account Status</label>
                <p className="mt-1 text-emerald-600 font-medium">Active</p>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
