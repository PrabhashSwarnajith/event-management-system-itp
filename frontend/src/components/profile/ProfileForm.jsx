import { Save, AlertCircle, CheckCircle } from "lucide-react";

/**
 * ProfileForm - Form to edit user name and email
 */
export const ProfileForm = ({
  formData,
  setFormData,
  onSubmit,
  saving,
  message,
  error,
}) => {
  const set = (key) => (e) =>
    setFormData((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="card p-8 mb-6 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        Profile Information
      </h2>

      {/* Success message */}
      {message && (
        <div
          className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 animate-fade-in"
          role="alert"
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 animate-fade-in"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Name field */}
        <div>
          <label htmlFor="profile-name" className="block text-sm font-semibold text-slate-700 mb-2">
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            className="input-field w-full"
            placeholder="John Doe"
            value={formData.name}
            onChange={set("name")}
            disabled={saving}
            required
          />
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address
          </label>
          <input
            id="profile-email"
            type="email"
            className="input-field w-full"
            placeholder="john@example.com"
            value={formData.email}
            onChange={set("email")}
            disabled={saving}
            required
          />
        </div>

        {/* Student ID field */}
        <div>
          <label htmlFor="profile-student-id" className="block text-sm font-semibold text-slate-700 mb-2">
            Student / Staff ID
          </label>
          <input
            id="profile-student-id"
            type="text"
            className="input-field w-full"
            placeholder="e.g. IT20101010"
            value={formData.studentId}
            onChange={set("studentId")}
            disabled={saving}
          />
        </div>

        {/* Department field */}
        <div>
          <label htmlFor="profile-department" className="block text-sm font-semibold text-slate-700 mb-2">
            Department
          </label>
          <input
            id="profile-department"
            type="text"
            className="input-field w-full"
            placeholder="e.g. Software Engineering"
            value={formData.department}
            onChange={set("department")}
            disabled={saving}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full py-3 gap-2 flex items-center justify-center"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
