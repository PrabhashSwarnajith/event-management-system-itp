import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "../../hooks/useProfileData";
import AccountLayout from "../../components/account/AccountLayout";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { StatsCard } from "../../components/profile/StatsCard";
import { ReportPanel } from "../../components/profile/ReportPanel";
import { DeleteAccountSection } from "../../components/profile/DeleteAccountSection";
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
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-[2.5rem] shadow-2xl text-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Session Expired</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Please sign in to access your profile and event bookings.
          </p>
          <button 
            onClick={() => navigate("/auth")}
            className="btn-primary w-full h-14 text-lg font-black shadow-xl shadow-indigo-500/30"
          >
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

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "animate-pulse" : ""}`} />
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
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <History className="w-4 h-4 text-indigo-500" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button onClick={() => navigate("/bookings")} className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-bold text-slate-700 dark:text-slate-300 transition group flex justify-between items-center">
                        View Bookings
                        <span className="text-indigo-500 group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                      <button onClick={() => navigate("/events")} className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-sm font-bold text-slate-700 dark:text-slate-300 transition group flex justify-between items-center">
                        Browse Events
                        <span className="text-indigo-500 group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="animate-fade-up space-y-10 max-w-3xl">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Personal Information</h3>
                <ProfileForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSaveProfile}
                  saving={saving}
                  message={message}
                  error={error}
                />
              </div>
              
              <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 p-8 rounded-[2.5rem]">
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
