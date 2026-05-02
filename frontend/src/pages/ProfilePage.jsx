import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "../hooks/useProfileData";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileForm } from "../components/profile/ProfileForm";
import { StatsCard } from "../components/profile/StatsCard";
import { ReportPanel } from "../components/profile/ReportPanel";
import { DeleteAccountSection } from "../components/profile/DeleteAccountSection";
import { User, Settings, LayoutDashboard } from "lucide-react";

const ProfilePage = () => {
  const { user, updateUser, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    formData,
    setFormData,
    message,
    error,
    saving,
    stats,
    handleSaveProfile,
    handleDeleteAccount,
  } = useProfileData(user, authFetch, updateUser);

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

  const handleDelete = async () => {
    await handleDeleteAccount(authFetch, logout, navigate);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="card p-4 sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">Profile Menu</h3>
            <nav className="flex flex-col gap-1">
              <button 
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === "overview" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Overview
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === "settings" ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Settings className="w-5 h-5" />
                Account Settings
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">
          {activeTab === "overview" && (
            <div className="animate-fade-in space-y-8">
              <ProfileHeader user={user} />
              <StatsCard stats={stats} />
              <ReportPanel />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-fade-in space-y-8">
              <ProfileForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSaveProfile}
                saving={saving}
                message={message}
                error={error}
              />
              <DeleteAccountSection user={user} onDelete={handleDelete} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
