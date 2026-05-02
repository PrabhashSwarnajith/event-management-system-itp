/**
 * FeatureCard - Individual feature card for home page
 */
export const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="card p-7 flex flex-col gap-4 animate-fade-up">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);
