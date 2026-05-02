import { Users, Heart, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white py-28 md:py-36">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 animate-fade-up">
            About UniEvents
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "80ms" }}>
            Connecting students with the campus experiences they love—one event at a time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              UniEvents exists to make discovering and attending campus events effortless. We believe that every student deserves easy access to the lectures, workshops, sports, concerts, and social gatherings that make university life memorable.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              By bringing all events to one platform, we're helping students stay engaged with their campus community while giving organizers the tools they need to reach their audience.
            </p>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-3xl animate-fade-up" style={{ animationDelay: "80ms" }} />
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-slate-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: "Community First",
                description: "We put student voices at the center of everything we do.",
                color: "bg-indigo-50 text-indigo-600",
              },
              {
                icon: Heart,
                title: "Inclusive",
                description: "Every student deserves to find events that match their interests.",
                color: "bg-rose-50 text-rose-600",
              },
              {
                icon: Zap,
                title: "Simple & Fast",
                description: "Discover events and book tickets in seconds, not minutes.",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: Shield,
                title: "Reliable",
                description: "Your bookings and event data are secure and always accessible.",
                color: "bg-emerald-50 text-emerald-600",
              },
            ].map((value, i) => (
              <div key={i} className="card p-6 text-center animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${value.color} mx-auto mb-4`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-slate-900 text-center mb-12">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "For Students",
              features: [
                "Browse all campus events in one place",
                "Get instant digital tickets with QR codes",
                "Track all your bookings",
                "Discover events matching your interests",
              ],
            },
            {
              title: "For Organizers",
              features: [
                "Create and manage events easily",
                "Track registrations in real-time",
                "Choose venues from campus spaces",
                "Reach thousands of students",
              ],
            },
          ].map((section, i) => (
            <div key={i} className="card p-8 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5 shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 py-20 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to get started?</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
            Join thousands of students discovering campus events they love.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="btn-primary bg-white text-indigo-700 hover:bg-indigo-50">
              Create Account
            </Link>
            <Link to="/events" className="btn-primary border-white text-white hover:bg-white/10">
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
