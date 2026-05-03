/**
 * FeatureCard - Individual feature card for home page with dark mode support
 */
export const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="card card-hover p-7 flex flex-col gap-4 animate-fade-up bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);
