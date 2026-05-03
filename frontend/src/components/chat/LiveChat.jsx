import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Clock, ChevronDown, Shield, Headphones } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const LIVE_CHAT_STORAGE_KEY = "unievents_livechat_v2";

const SUPPORT_AGENT = { name: "Campus Help Desk" };

const AUTO_REPLIES = {
  keywords: {
    booking: "For booking issues, please share your booking ID. You can also check My Bookings from your profile.",
    venue: "For venue inquiries, open the Venues page and check capacity, location, and availability.",
    cancel: "To cancel a booking, go to My Bookings and select Cancel. Refunds usually take 3-5 business days.",
    payment: "For payment issues, please share your transaction reference so the team can check it.",
    event: "You can find the latest event schedule from the Events page. Tell us the event name if you need help.",
    refund: "Refunds are processed after cancellation and return to the original payment method.",
    ticket: "Your QR ticket is shown in My Bookings after the booking is confirmed.",
  },
  default: [
    "Thanks for the message. One of our team members will check this shortly.",
    "Hi, we got your question. Please keep this chat open for the reply.",
    "Thanks for contacting UniEvents support. We will help you with this.",
  ],
};

const getAutoReply = (text) => {
  const lower = text.toLowerCase();
  for (const [keyword, reply] of Object.entries(AUTO_REPLIES.keywords)) {
    if (lower.includes(keyword)) return reply;
  }
  return AUTO_REPLIES.default[Math.floor(Math.random() * AUTO_REPLIES.default.length)];
};

export const readChatStore = () => {
  try {
    const raw = localStorage.getItem(LIVE_CHAT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { messages: [], session: null };
  } catch {
    return { messages: [], session: null };
  }
};

export const writeChatStore = (data) => {
  try {
    localStorage.setItem(LIVE_CHAT_STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const LiveChat = () => {
  const { user } = useAuth();

  // Admin users should use the dashboard panel — hide this widget for admins
  if (user?.role === "ADMIN") return null;

  return <CustomerChat user={user} />;
};

// ── Customer-facing chat widget ────────────────────────────────────────────────
const CustomerChat = ({ user }) => {
  const [open, setOpen]             = useState(false);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const [unread, setUnread]         = useState(0);
  const [minimized, setMinimized]   = useState(false);
  const [sessionId]                 = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  const messagesEndRef              = useRef(null);
  const inputRef                    = useRef(null);
  const lastAgentMsgCount           = useRef(0);

  // Load saved messages on mount
  useEffect(() => {
    const store = readChatStore();
    if (store.messages?.length) {
      setMessages(store.messages);
      lastAgentMsgCount.current = store.messages.filter((m) => m.role === "agent").length;
    }
  }, []);

  // Poll every 1.5 s for admin replies from localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const store = readChatStore();
      if (!store.messages) return;
      const agentMsgs = store.messages.filter((m) => m.role === "agent");
      const newCount  = agentMsgs.length;
      const prevCount = lastAgentMsgCount.current;
      if (newCount > prevCount) {
        const diff = newCount - prevCount;          // capture BEFORE updating ref
        lastAgentMsgCount.current = newCount;       // update ref
        setMessages(store.messages);               // refresh conversation
        if (!open) setUnread((c) => c + diff);     // show badge
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      id:        `user_${Date.now()}`,
      role:      "user",
      text,
      sender:    user?.name || "Student",
      time:      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      sessionId,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    const store = readChatStore();
    writeChatStore({ ...store, messages: newMessages.slice(-100), sessionId });

    setAgentTyping(true);
    // Give admin 8-10 s to reply before auto-reply fires
    await new Promise((resolve) => setTimeout(resolve, 8000 + Math.random() * 2000));

    const currentStore = readChatStore();
    const teamReplied  = currentStore.messages.some(
      (m) => m.role === "agent" && !m.isAuto && m.timestamp > userMsg.timestamp
    );
    setAgentTyping(false);

    if (!teamReplied) {
      const agentMsg = {
        id:        `agent_${Date.now()}`,
        role:      "agent",
        text:      getAutoReply(text),
        agent:     SUPPORT_AGENT.name,
        time:      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        timestamp: Date.now(),
        isAuto:    true,
      };
      const updated = [...newMessages, agentMsg];
      setMessages(updated);
      lastAgentMsgCount.current += 1;
      writeChatStore({ ...currentStore, messages: updated.slice(-100), sessionId });
      if (!open) setUnread((c) => c + 1);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([]);
    setUnread(0);
    lastAgentMsgCount.current = 0;
    writeChatStore({ messages: [], session: null });
  };

  const fmt = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => { setOpen(true); setUnread(0); }}
        className={`fixed z-40 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 ${
          open ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ background: "linear-gradient(135deg, #0ea5e9, #2563eb)", bottom: "5.5rem", right: "1.25rem" }}
        aria-label="Open live chat"
        id="livechat-trigger-btn"
      >
        <div className="relative">
          <Headphones className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black">
              {unread}
            </span>
          )}
        </div>
        <span className="hidden sm:inline">Live Support</span>
      </button>

      {/* Chat window */}
      <div
        className={`fixed z-40 flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{
          width:     "min(calc(100vw - 2rem), 360px)",
          height:    minimized ? 56 : "min(calc(100vh - 6rem), 500px)",
          right:     "1.25rem",
          bottom:    "1.25rem",
        }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-900 px-4 py-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Shield className="h-4 w-4" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black">UniEvents Support</p>
              <p className="flex items-center gap-1 text-xs text-white/70">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Help team online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized((v) => !v)}
              className="rounded-lg p-1.5 transition hover:bg-white/10"
              aria-label="Minimize"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${minimized ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => { setOpen(false); setMinimized(false); }}
              className="rounded-lg p-1.5 transition hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!minimized && (
          <div className="flex flex-1 flex-col min-h-0">
            {/* Welcome banner */}
            {messages.length === 0 && (
              <div className="border-b border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  <Headphones className="h-3.5 w-3.5 shrink-0" />
                  Welcome to UniEvents live support
                </p>
                <p className="mt-0.5 text-xs text-indigo-500 dark:text-indigo-400">
                  Ask anything about events, bookings, venues, or tickets.
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 p-3">
              {messages.length === 0 && (
                <div className="py-8 text-center text-slate-400 dark:text-slate-600">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  <p className="text-sm">Start with a short message.</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                    msg.role === "agent"
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                      : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  }`}>
                    {msg.role === "agent" ? "S" : (msg.sender?.charAt(0)?.toUpperCase() || "U")}
                  </div>

                  {/* Bubble */}
                  <div className="max-w-[78%] space-y-1">
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-tr-sm bg-blue-600 text-white"
                          : "rounded-tl-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      }`}
                      dangerouslySetInnerHTML={msg.role === "agent" ? { __html: fmt(msg.text) } : undefined}
                    >
                      {msg.role === "user" ? msg.text : undefined}
                    </div>
                    <div className="flex items-center gap-1 px-1">
                      <Clock className="h-2.5 w-2.5 text-slate-300 dark:text-slate-600" />
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {agentTyping && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-xs font-black text-indigo-700 dark:text-indigo-300">
                    S
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                  id="livechat-input"
                  maxLength={300}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
                  id="livechat-send-btn"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="mt-2 text-xs text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition"
                >
                  Clear conversation
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LiveChat;
