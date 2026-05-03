import { useState, useEffect, useRef } from "react";
import { Timer, X, ChevronDown, Bell, Calendar } from "lucide-react";

/**
 * EventCountdown — Special Feature: Live countdown timer widget.
 * Shows countdown to the nearest upcoming event fetched from the API.
 * Member 5 special feature.
 */

const API = "http://localhost:8080/api";

const pad = (n) => String(n).padStart(2, "0");

const getTimeLeft = (targetDate) => {
  const diff = new Date(targetDate) - new Date();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, mins, secs };
};

// Sample fallback events
const SAMPLE_EVENTS = [
  { id: 1, title: "SLIIT Career Fair 2026", eventDate: new Date(Date.now() + 2 * 86400000 + 3600000 * 5).toISOString(), category: "CAREER" },
  { id: 2, title: "Tech Symposium 2026", eventDate: new Date(Date.now() + 5 * 86400000).toISOString(), category: "TECH" },
  { id: 3, title: "Cultural Night 2026", eventDate: new Date(Date.now() + 12 * 86400000).toISOString(), category: "CULTURAL" },
];

const CATEGORY_COLORS = {
  TECH: "from-indigo-500 to-violet-600",
  CAREER: "from-emerald-500 to-teal-600",
  CULTURAL: "from-pink-500 to-rose-600",
  SPORTS: "from-orange-500 to-amber-600",
  ACADEMIC: "from-blue-500 to-cyan-600",
  DEFAULT: "from-slate-500 to-slate-700",
};

const EventCountdown = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const intervalRef = useRef(null);

  // Load events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/events`);
        if (res.ok) {
          const data = await res.json();
          const upcoming = data
            .filter(e => new Date(e.eventDate) > new Date())
            .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
            .slice(0, 5);
          setEvents(upcoming.length > 0 ? upcoming : SAMPLE_EVENTS);
        } else {
          setEvents(SAMPLE_EVENTS);
        }
      } catch {
        setEvents(SAMPLE_EVENTS);
      }
    };
    fetchEvents();
  }, []);

  // Tick every second
  useEffect(() => {
    if (!events[selectedIdx]) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const tl = getTimeLeft(events[selectedIdx].eventDate);
      setTimeLeft(tl);

      // Browser notification at 1-hour mark
      if (notifyEnabled && tl && tl.days === 0 && tl.hours === 1 && tl.mins === 0 && tl.secs === 0) {
        new Notification("⏰ UniEvents Reminder", {
          body: `${events[selectedIdx].title} starts in 1 hour!`,
          icon: "/favicon.ico",
        });
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [events, selectedIdx, notifyEnabled]);

  const current = events[selectedIdx];
  const gradient = current ? (CATEGORY_COLORS[current.category] || CATEGORY_COLORS.DEFAULT) : CATEGORY_COLORS.DEFAULT;

  const enableNotifications = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifyEnabled(perm === "granted");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl font-bold text-sm text-white transition-all duration-300"
        style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
        aria-label="Open event countdown"
        id="countdown-trigger-btn"
      >
        <Timer className="w-5 h-5" />
        <span>Event Countdown</span>
        {timeLeft && (
          <span className="bg-white/20 rounded-lg px-2 py-0.5 text-xs font-black">
            {timeLeft.days}d {pad(timeLeft.hours)}h
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-300 origin-bottom-left`}
      style={{ width: 300, height: minimized ? 64 : "auto" }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 text-white bg-gradient-to-r ${gradient}`}>
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4" />
          <p className="font-black text-sm">Event Countdown</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(m => !m)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
            aria-label="Minimize"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${minimized ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="bg-white">
          {/* Event selector */}
          {events.length > 1 && (
            <div className="p-3 border-b border-slate-100">
              <select
                value={selectedIdx}
                onChange={e => setSelectedIdx(Number(e.target.value))}
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-400 text-slate-700 bg-slate-50 cursor-pointer"
                id="countdown-event-select"
              >
                {events.map((ev, i) => (
                  <option key={ev.id} value={i}>{ev.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Event info */}
          {current && (
            <div className="px-4 pt-3 pb-1">
              <p className="font-black text-slate-900 text-sm leading-tight">{current.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(current.eventDate).toLocaleDateString("en-US", {
                  weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                })}
              </p>
            </div>
          )}

          {/* Countdown display */}
          {timeLeft ? (
            <div className="p-4">
              <div className={`grid grid-cols-4 gap-2`}>
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: pad(timeLeft.hours) },
                  { label: "Mins", value: pad(timeLeft.mins) },
                  { label: "Secs", value: pad(timeLeft.secs) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className={`flex flex-col items-center justify-center bg-gradient-to-br ${gradient} rounded-xl py-2.5 text-white shadow-sm`}
                  >
                    <span className="text-xl font-black tabular-nums leading-none">{value}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wide mt-0.5 opacity-80">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-bold text-emerald-600">🎉 Event is happening now!</p>
            </div>
          )}

          {/* Notify button */}
          <div className="px-4 pb-4">
            <button
              onClick={enableNotifications}
              className={`w-full flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl font-semibold transition cursor-pointer ${
                notifyEnabled
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
              id="countdown-notify-btn"
            >
              <Bell className="w-3.5 h-3.5" />
              {notifyEnabled ? "Notifications enabled ✓" : "Enable event reminders"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCountdown;
