import { User } from "lucide-react";
import { getInitials, ROLE_COLORS } from "../../utils/profileUtils";

export const ProfileHeader = ({ user }) => {
  const initials = getInitials(user.name);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden mb-4">
      {/* Banner */}
      <div className="h-28 bg-gradient-to-r from-indigo-600 to-violet-600" />

      {/* Info */}
      <div className="px-6 pb-6">
        <div className="-mt-10 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-black shadow-md border-4 border-white dark:border-slate-900">
            {initials || <User className="w-8 h-8" />}
          </div>
        </div>

        <h1 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 mb-3">{user.email}</p>

        <div className="flex flex-wrap gap-2">
          <span className={`badge ${ROLE_COLORS[user.role] || "badge-slate"}`}>{user.role}</span>
          {user.studentId && <span className="badge badge-slate">ID: {user.studentId}</span>}
          {user.department && <span className="badge badge-slate">{user.department}</span>}
        </div>
      </div>
    </div>
  );
};
