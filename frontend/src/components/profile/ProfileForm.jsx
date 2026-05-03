import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export const ProfileForm = ({ formData, setFormData, onSubmit, saving, message, error }) => {
  const set = (key) => (e) => setFormData((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="card p-7 mb-6 animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>

      {message && (
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-3.5 rounded-xl mb-5 animate-fade-in" role="alert">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3.5 rounded-xl mb-5 animate-fade-in" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="form-label">Full Name</label>
          <input
            id="profile-name"
            type="text"
            className="input-field"
            placeholder="Your full name"
            value={formData.name}
            onChange={set("name")}
            disabled={saving}
            required
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="form-label">Email Address</label>
          <input
            id="profile-email"
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={formData.email}
            onChange={set("email")}
            disabled={saving}
            required
          />
        </div>

        <div>
          <label htmlFor="profile-student-id" className="form-label">Student / Staff ID</label>
          <input
            id="profile-student-id"
            type="text"
            className="input-field"
            placeholder="e.g. IT20101010"
            value={formData.studentId}
            onChange={set("studentId")}
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="profile-department" className="form-label">Department</label>
          <input
            id="profile-department"
            type="text"
            className="input-field"
            placeholder="e.g. Software Engineering"
            value={formData.department}
            onChange={set("department")}
            disabled={saving}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full mt-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};
