import { useAuth } from "../context/AuthContext";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div className="p-10 text-center">Please login to view your profile.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 h-32"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-2 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-indigo-50 text-indigo-600">
              <User size={48} />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-slate-500 flex items-center gap-2 mt-1">{user.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>

          <div className="mt-8 border-t pt-8">
             <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Information</h3>
             <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div>
                    <label className="text-sm font-medium text-slate-500">Record ID</label>
                    <p className="mt-1 font-mono text-slate-900">{user.id}</p>
                </div>
                <div>
                    <label className="text-sm font-medium text-slate-500">Account Status</label>
                    <p className="mt-1 text-emerald-600 font-medium">Active</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
