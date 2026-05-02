import { User } from "lucide-react";
import { getInitials, ROLE_COLORS } from "../../utils/profileUtils";

/**
 * ProfileHeader - Displays user avatar, name, email, and role badge
 */
export const ProfileHeader = ({ user }) => {
  const initials = getInitials(user.name);

  return (
    <div className="card overflow-hidden mb-6 animate-fade-in">
      {/* Hero banner */}
      <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, white, transparent 50%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="px-7 pb-7">
        {/* Avatar */}
        <div className="flex items-end -mt-12 mb-5">
          <div className="relative">
            <div
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg border-4 border-white"
              aria-label={`Avatar for ${user.name}`}
            >
              {initials || <User className="w-10 h-10" />}
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-0.5">
            {user.name}
          </h1>
          <p className="text-slate-500 text-sm mb-3">{user.email}</p>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span
              className={`badge ${
                ROLE_COLORS[user.role] || "badge-slate"
              }`}
            >
              {user.role}
            </span>
            {user.studentId && (
              <span className="badge badge-slate">ID: {user.studentId}</span>
            )}
            {user.department && (
              <span className="badge badge-slate">{user.department}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
