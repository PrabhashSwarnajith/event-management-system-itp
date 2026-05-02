import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Clock, ChevronDown, Shield, Headphones } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/**
 * LiveChat — Real-time student support chat widget.
 * Member 3 (Dilhani) feature: Live support with admin reply capability.
 *
 * Architecture:
 *  - Messages stored in localStorage under STORAGE_KEY
 *  - Admin LiveChatPanel (in AdminDashboard) reads/writes the same key
 *  - Both poll every 2s for new messages → simulates real-time
 */

export const LIVE_CHAT_STORAGE_KEY = "unievents_livechat_v2";

const SUPPORT_AGENT = { name: "Support Team", avatar: "S" };

const AUTO_REPLIES = {
  keywords: {
    booking: "For booking issues, please share your **Booking ID** and we'll look into it right away. You can also check **My Bookings** in your profile.",
    venue: "For venue inquiries, visit our **Venues page** for availability and details. You can also email venues@unievents.lk.",
    cancel: "To cancel a booking: go to **My Bookings** → click **Cancel**. Refunds are processed within **3-5 business days**.",
    payment: "For payment issues, please share your **transaction ID** and we'll resolve it within 24 hours. Email: payments@unievents.lk",
    event: "Check our **Events page** for the latest schedule. Need help registering? I'm happy to assist!",
    refund: "Refunds take **3-5 business days** after cancellation. The amount returns to your original payment method.",
    ticket: "Your QR ticket is available in **My Bookings** after a successful payment. Download it from there!",
  },
  default: [
    "Thanks for reaching out! A member of our team will respond shortly. ⏱️",
    "Hi! We've received your message. Our support team will reply within 5 minutes.",
    "Hello! Thank you for contacting UniEvents support. Someone will be with you soon.",
  ],
};

const getAutoReply = (text) => {
  const lower = text.toLowerCase();
  for (const [keyword, reply] of Object.entries(AUTO_REPLIES.keywords)) {
    if (lower.includes(keyword)) return reply;
  }
  return AUTO_REPLIES.default[Math.floor(Math.random() * AUTO_REPLIES.default.length)];
};

// ── Shared storage helpers ─────────────────────────────────────────────────────
export const readChatStore = () => {
  try {
    const raw = localStorage.getItem(LIVE_CHAT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { messages: [], session: null };
  } catch { return { messages: [], session: null }; }
};

export const writeChatStore = (data) => {
  try {
    localStorage.setItem(LIVE_CHAT_STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const LiveChat = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastAdminMsgCount = useRef(0);

  // Load messages from storage on mount
  useEffect(() => {
    const store = readChatStore();
    if (store.messages) {
      setMessages(store.messages);
      lastAdminMsgCount.current = store.messages.filter(m => m.role === "agent").length;
    }
  }, []);

  // Poll for admin replies every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const store = readChatStore();
      if (!store.messages) return;
      const adminMsgs = store.messages.filter(m => m.role === "agent");
      if (adminMsgs.length > lastAdminMsgCount.current) {
        setMessages(store.messages);
        lastAdminMsgCount.current = adminMsgs.length;
        if (!open) setUnread(u => u + (adminMsgs.length - lastAdminMsgCount.current + 1));
      }
    }, 2000);
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
      id: `user_${Date.now()}`,
      role: "user",
      text,
      sender: user?.name || "Student",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      sessionId,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // Write to shared storage immediately
    const store = readChatStore();
    writeChatStore({ ...store, messages: newMessages.slice(-100), sessionId });

    // Simulate auto-reply if no admin online
    setAgentTyping(true);
    const delay = 1500 + Math.random() * 1500;
    await new Promise((r) => setTimeout(r, delay));

    // Check if admin replied in the meantime
    const currentStore = readChatStore();
    const adminReplied = currentStore.messages.some(
      m => m.role === "agent" && m.timestamp > userMsg.timestamp
    );

    setAgentTyping(false);

    if (!adminReplied) {
      const autoReplyText = getAutoReply(text);
      const agentMsg = {
        id: `agent_${Date.now()}`,
        role: "agent",
        text: autoReplyText,
        agent: SUPPORT_AGENT.name,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        timestamp: Date.now(),
        isAuto: true,
      };
      const updated = [...newMessages, agentMsg];
      setMessages(updated);
      writeChatStore({ ...currentStore, messages: updated.slice(-100) });
      if (!open) setUnread(u => u + 1);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([]);
    setUnread(0);
    writeChatStore({ messages: [], session: null });
  };

  const formatMarkdown = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => { setOpen(true); setUnread(0); }}
        className={`fixed z-40 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl font-bold text-sm text-white transition-all duration-300 ${
          open ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        style={{
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          bottom: "5rem",
          right: "1.5rem",
        }}
        aria-label="Open live chat"
        id="livechat-trigger-btn"
      >
        <div className="relative">
          <Headphones className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-black animate-pulse">
              {unread}
            </span>
          )}
        </div>
        Live Support
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-40 flex flex-col rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 origin-bottom-right bg-white ${
          open ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"
        }`}
        style={{
          width: 340,
          height: minimized ? 64 : 500,
          right: 400, // Offset from AI chatbot
          bottom: 24,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="font-black text-sm">UniEvents Support</p>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Live · Admin monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized((m) => !m)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
              aria-label="Minimize"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${minimized ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => { setOpen(false); setMinimized(false); }}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Welcome */}
            {messages.length === 0 && (
              <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
                <p className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" />
                  Welcome to UniEvents Live Support!
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Type your question — our team or AI will respond shortly.
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-slate-50 to-white">
              {messages.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Send a message to start chatting</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black ${
                      msg.role === "agent" ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {msg.role === "agent" ? "S" : (msg.sender?.charAt(0).toUpperCase() || "U")}
                  </div>
                  <div className="max-w-[78%]">
                    <p className={`text-[10px] mb-1 font-bold ${msg.role === "user" ? "text-right text-slate-400" : "text-left text-slate-400"}`}>
                      {msg.role === "user" ? msg.sender : msg.agent}
                      {msg.isAuto && (
                        <span className="ml-1 text-[8px] bg-slate-100 px-1 rounded text-slate-400 uppercase tracking-tighter">auto</span>
                      )}
                    </p>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                      }`}
                      dangerouslySetInnerHTML={
                        msg.role === "agent" ? { __html: formatMarkdown(msg.text) } : undefined
                      }
                    >
                      {msg.role === "user" ? msg.text : undefined}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <p className="text-xs text-slate-400">{msg.time}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Agent typing */}
              {agentTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black text-blue-700 flex-shrink-0">S</div>
                  <div className="bg-white border border-slate-200 px-3 py-2.5 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type your message..."
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-slate-50"
                  id="livechat-input"
                  maxLength={300}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition cursor-pointer disabled:opacity-40 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}
                  id="livechat-send-btn"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-xs text-slate-400 hover:text-slate-600 mt-2 cursor-pointer transition"
                >
                  Clear conversation
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default LiveChat;
