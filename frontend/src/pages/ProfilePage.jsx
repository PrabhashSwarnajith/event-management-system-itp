import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "../hooks/useProfileData";
import AccountLayout from "../components/account/AccountLayout";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { ProfileForm } from "../components/profile/ProfileForm";
import { StatsCard } from "../components/profile/StatsCard";
import { ReportPanel } from "../components/profile/ReportPanel";
import { DeleteAccountSection } from "../components/profile/DeleteAccountSection";
import { User, Settings, Sparkles, LayoutDashboard, History } from "lucide-react";

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
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm text-center p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <User className="w-10 h-10 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Not Signed In</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Please sign in to view your profile.</p>
          <button onClick={() => navigate("/auth")} className="btn-primary w-full">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    await handleDeleteAccount(authFetch, logout, navigate);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <AccountLayout>
      <div className="max-w-5xl mx-auto space-y-10 py-6 animate-fade-in">
        
        {/* Profile Top Decoration */}
        <div className="flex items-center gap-3 mb-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Your Profile</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-fit mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content Feed */}
        <div className="min-h-[400px]">
          {activeTab === "overview" && (
            <div className="animate-fade-up space-y-10">
              <ProfileHeader user={user} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <StatsCard stats={stats} />
                  <ReportPanel />
                </div>
                
                <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <History className="w-4 h-4 text-indigo-500" />
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <button onClick={() => navigate("/bookings")} className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-sm font-semibold text-slate-700 dark:text-slate-300 transition flex justify-between items-center">
                        My Bookings <span className="text-indigo-500">→</span>
                      </button>
                      <button onClick={() => navigate("/events")} className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-sm font-semibold text-slate-700 dark:text-slate-300 transition flex justify-between items-center">
                        Browse Events <span className="text-indigo-500">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-fade-up space-y-6 max-w-xl">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Account Settings</h3>
                <ProfileForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSaveProfile}
                  saving={saving}
                  message={message}
                  error={error}
                />
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-6 rounded-xl">
                <DeleteAccountSection user={user} onDelete={handleDelete} />
              </div>
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
