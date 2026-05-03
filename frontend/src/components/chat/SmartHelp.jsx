import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Minimize2, Trash2, HelpCircle } from "lucide-react";

const HELP_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const HELP_URL = "https://api.groq.com/openai/v1/chat/completions";
const AI_ENABLED = HELP_API_KEY.length > 10;

const SYSTEM_PROMPT = `You are the UniEvents student help desk for a university event management platform.

Help students and staff with:
- finding campus events
- booking events
- payment and refund questions
- venue availability
- account and profile questions
- general event support

Platform details:
- UniEvents is for SLIIT campus events in Sri Lanka
- Currency is LKR
- Support email is support@unievents.lk
- Live support is available in the support widget

Keep answers short, friendly, and useful. If the question needs a person, ask the user to open live support.`;

const SUGGESTIONS = [
  "How do I book an event?",
  "Where can I find my ticket?",
  "How do I cancel a booking?",
];

const STORAGE_KEY = "unievents_help_chat";

const formatMarkdown = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)/gm, "- $1")
    .replace(/\n/g, "<br/>");

const createGreeting = () => ({
  role: "bot",
  text: "Hi! I am the UniEvents help desk. Ask me about events, bookings, venues, tickets, or payments.",
  timestamp: Date.now(),
});

const SmartHelp = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [createGreeting()];
    } catch {
      return [createGreeting()];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (open && !minimized) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, minimized]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
    } catch {}
  }, [messages]);

  const buildHistory = (items) =>
    items
      .filter((item, index) => item.role !== "bot" || index > 0)
      .slice(-10)
      .map((item) => ({
        role: item.role === "user" ? "user" : "assistant",
        content: item.text,
      }));

  const OFFLINE_REPLIES = {
    book: "To book an event, browse the Events page and click 'Book Now'. You need to be logged in first.",
    cancel: "To cancel a booking, go to My Bookings and click Cancel on the booking. Refunds take 3-5 business days.",
    ticket: "Your QR ticket is in My Bookings after booking is confirmed. Click 'View Ticket' to see it.",
    venue: "Browse the Venues page to see all campus halls, labs, and outdoor spaces with capacity and amenities.",
    payment: "We accept online payments via the booking flow. For payment issues, share your reference with Live Support.",
    refund: "Refunds are processed after cancellation and return to your original payment method within 5 days.",
    event: "You can find all upcoming events on the Events page. Use filters to search by category or date.",
    login: "Use your university email and password to log in. Click 'Continue with Google' to use your uni account.",
    password: "If you forgot your password, contact support at support@unievents.lk with your student ID.",
    register: "Click 'Sign up here' on the login page. Use your SLIIT email and student ID to create an account.",
  };

  const getOfflineReply = (text) => {
    const lower = text.toLowerCase();
    for (const [key, reply] of Object.entries(OFFLINE_REPLIES)) {
      if (lower.includes(key)) return reply;
    }
    return "Thanks for your question! For detailed help, please use the Live Support button to chat with our team directly. We are available during university hours.";
  };

  const sendMessage = async (text = input.trim()) => {
    if (!text || loading) return;

    const userMsg = { role: "user", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (!AI_ENABLED) {
        // Offline mode: keyword-based instant reply
        await new Promise((r) => setTimeout(r, 700)); // small typing delay
        const reply = getOfflineReply(text);
        setMessages((prev) => [...prev, { role: "bot", text: reply, timestamp: Date.now() }]);
        if (!open) setUnread((count) => count + 1);
        return;
      }

      const history = buildHistory([...messages, userMsg]);
      
      const res = await fetch(HELP_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HELP_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...history
          ],
          temperature: 0.7,
          max_tokens: 512
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || "Service unavailable");
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (!reply) throw new Error("No reply received");

      setMessages((prev) => [...prev, { role: "bot", text: reply, timestamp: Date.now() }]);
      if (!open) setUnread((count) => count + 1);
    } catch (err) {
      console.error("Help service error:", err);
      // Fall back to offline mode on API error
      const reply = getOfflineReply(text);
      setMessages((prev) => [...prev, { role: "bot", text: reply, timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };


  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    const initial = [createGreeting()];
    setMessages(initial);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setUnread(0);
        }}
        className={`fixed z-50 flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-2xl transition-all duration-300 ${
          open ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", bottom: "1.25rem", right: "1.25rem" }}
        aria-label="Open help desk"
        id="chatbot-trigger-btn"
      >
        <div className="relative">
          <MessageCircle className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-black">
              {unread}
            </span>
          )}
        </div>
        <span>Help Desk</span>
      </button>

      <div
        className={`fixed z-50 flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ 
          width: "min(calc(100vw - 2rem), 380px)", 
          height: minimized ? 56 : "min(calc(100vh - 2rem), 540px)",
          maxHeight: "calc(100vh - 2rem)",
          bottom: "5rem",
          right: "1.25rem"
        }}
      >
        <div className="flex shrink-0 items-center justify-between bg-indigo-700 px-4 py-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-black">UniEvents Help Desk</p>
              <p className="flex items-center gap-1 text-xs text-white/80">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Campus support
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="rounded-lg p-1.5 transition hover:bg-white/15"
              aria-label="Clear chat"
              title="Clear conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setMinimized((value) => !value)}
              className="rounded-lg p-1.5 transition hover:bg-white/15"
              aria-label="Minimize help desk"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setMinimized(false);
              }}
              className="rounded-lg p-1.5 transition hover:bg-white/15"
              aria-label="Close help desk"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            <div className="flex-1 space-y-2.5 sm:space-y-3 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-3 sm:p-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-2 sm:gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full shadow-sm text-xs sm:text-sm ${
                      msg.role === "bot" ? "bg-indigo-600" : "bg-slate-700"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <HelpCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                    ) : (
                      <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                    )}
                  </div>
                  <div className={`flex max-w-[75%] sm:max-w-[80%] flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-lg px-3 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm leading-relaxed ${
                        msg.role === "bot"
                          ? msg.isError
                            ? "border border-red-200 bg-red-50 text-red-800"
                            : "border border-slate-200 bg-white text-slate-800 shadow-sm"
                          : "bg-indigo-600 text-white shadow-sm"
                      }`}
                      dangerouslySetInnerHTML={msg.role === "bot" ? { __html: formatMarkdown(msg.text) } : undefined}
                    >
                      {msg.role === "user" ? msg.text : undefined}
                    </div>
                    {msg.timestamp && (
                      <span className="px-1 text-[9px] sm:text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 sm:gap-2.5">
                  <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 shadow-sm">
                    <HelpCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-indigo-400"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 sm:px-3 py-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-lg border border-indigo-100 bg-indigo-50 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 sm:p-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about events..."
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
                disabled={loading}
                id="chatbot-input"
                maxLength={500}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-40"
                aria-label="Send message"
                id="chatbot-send-btn"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SmartHelp;
