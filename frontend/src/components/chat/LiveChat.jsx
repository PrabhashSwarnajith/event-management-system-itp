import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Clock, ChevronDown, Shield, Headphones, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const LIVE_CHAT_STORAGE_KEY = "unievents_livechat_v2";

const SUPPORT_AGENT = { name: "Campus Help Desk", avatar: "C" };

const SUPPORT_MEMBERS = [
  { name: "Prabhash Swarnajith", area: "Accounts" },
  { name: "Shehani03", area: "Questions" },
  { name: "it23677296-ayesha", area: "Events" },
  { name: "IT21012624", area: "Bookings" },
  { name: "PrabhashSwarnajith", area: "Venues" },
];

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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [agentTyping, setAgentTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const lastAgentMsgCount = useRef(0);

  useEffect(() => {
    const store = readChatStore();
    if (store.messages) {
      setMessages(store.messages);
      lastAgentMsgCount.current = store.messages.filter((m) => m.role === "agent").length;
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const store = readChatStore();
      if (!store.messages) return;

      const agentMsgs = store.messages.filter((m) => m.role === "agent");
      const previousCount = lastAgentMsgCount.current;

      if (agentMsgs.length > previousCount) {
        setMessages(store.messages);
        lastAgentMsgCount.current = agentMsgs.length;
        if (!open) setUnread((count) => count + (agentMsgs.length - previousCount));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
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

    const store = readChatStore();
    writeChatStore({ ...store, messages: newMessages.slice(-100), sessionId });

    setAgentTyping(true);
    const delay = 1200 + Math.random() * 1200;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const currentStore = readChatStore();
    const teamReplied = currentStore.messages.some(
      (m) => m.role === "agent" && m.timestamp > userMsg.timestamp
    );

    setAgentTyping(false);

    if (!teamReplied) {
      const agentMsg = {
        id: `agent_${Date.now()}`,
        role: "agent",
        text: getAutoReply(text),
        agent: SUPPORT_AGENT.name,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        timestamp: Date.now(),
        isAuto: true,
      };
      const updated = [...newMessages, agentMsg];
      setMessages(updated);
      lastAgentMsgCount.current += 1;
      writeChatStore({ ...currentStore, messages: updated.slice(-100), sessionId });
      if (!open) setUnread((count) => count + 1);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setUnread(0);
    lastAgentMsgCount.current = 0;
    writeChatStore({ messages: [], session: null });
  };

  const formatMarkdown = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setUnread(0);
        }}
        className={`fixed z-40 flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-2xl transition-all duration-300 ${
          open ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ background: "linear-gradient(135deg, #0ea5e9, #2563eb)", bottom: "1rem", right: "1rem" }}
        aria-label="Open live chat"
        id="livechat-trigger-btn"
      >
        <div className="relative">
          <Headphones className="h-4 w-4 sm:h-5 sm:w-5" />
          {unread > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-black">
              {unread}
            </span>
          )}
        </div>
        <span className="hidden sm:inline">Live Support</span>
      </button>

      <div
        className={`fixed z-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{
          width: "min(100vw - 0.5rem, 760px)",
          height: minimized ? 64 : "min(100vh - 2rem, 560px)",
          maxHeight: "calc(100vh - 2rem)",
          right: "0.25rem",
          bottom: "0.25rem"
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between bg-slate-900 px-3 sm:px-4 py-2 sm:py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="relative flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/10 shrink-0">
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="absolute bottom-0 right-0 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black">UniEvents Support</p>
                <p className="flex items-center gap-1 text-[10px] sm:text-xs text-white/75">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Student help team online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized((value) => !value)}
                className="rounded-lg p-1 sm:p-1.5 transition hover:bg-white/10"
                aria-label="Minimize live chat"
              >
                <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${minimized ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setMinimized(false);
                }}
                className="rounded-lg p-1 sm:p-1.5 transition hover:bg-white/10"
                aria-label="Close live chat"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[230px_minmax(0,1fr)]">
              {user?.role === "ADMIN" && (
                <aside className="border-b border-slate-200 bg-slate-50 p-3 sm:p-4 md:border-b-0 md:border-r overflow-y-auto max-h-[40vh] md:max-h-full">
                  <div className="mb-3 sm:mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600 shrink-0" />
                    <h3 className="text-xs sm:text-sm font-black text-slate-900">Support members</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                    {SUPPORT_MEMBERS.map((member) => (
                      <div key={member.name} className="rounded-lg border border-slate-200 bg-white p-2 sm:p-3">
                        <p className="truncate text-xs sm:text-sm font-bold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.area}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 sm:mt-4 text-xs leading-relaxed text-slate-500">
                    Share your booking ID, event name, or question. The correct member can pick it up from here.
                  </p>
                </aside>
              )}

              <section className="flex min-h-0 flex-col">
                {messages.length === 0 && (
                  <div className="border-b border-blue-100 bg-blue-50 px-3 sm:px-4 py-2 sm:py-3">
                    <p className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-blue-800">
                      <Headphones className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                      Welcome to UniEvents live support
                    </p>
                    <p className="mt-0.5 text-[10px] sm:text-xs text-blue-600">
                      Send your question and a team member will reply as soon as possible.
                    </p>
                  </div>
                )}

                <div className="flex-1 space-y-2.5 sm:space-y-3 overflow-y-auto bg-white p-2 sm:p-3">
                  {messages.length === 0 && (
                    <div className="py-6 sm:py-8 text-center text-slate-400">
                      <MessageSquare className="mx-auto mb-2 h-6 w-6 sm:h-8 sm:w-8 opacity-40" />
                      <p className="text-xs sm:text-sm">Start with a short message.</p>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {user?.role === "ADMIN" && (
                        <div
                          className={`flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                            msg.role === "agent" ? "bg-blue-100 text-blue-700" : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {msg.role === "agent" ? "S" : (msg.sender?.charAt(0).toUpperCase() || "U")}
                        </div>
                      )}
                      <div className="max-w-[75%] sm:max-w-[82%]">
                        {user?.role === "ADMIN" && (
                          <p className={`mb-1 text-[10px] font-bold text-slate-400 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                            {msg.role === "user" ? msg.sender : msg.agent}
                          </p>
                        )}
                        <div
                          className={`rounded-lg px-3 py-2 text-xs sm:text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "border border-slate-200 bg-slate-50 text-slate-800"
                          }`}
                          dangerouslySetInnerHTML={msg.role === "agent" ? { __html: formatMarkdown(msg.text) } : undefined}
                        >
                          {msg.role === "user" ? msg.text : undefined}
                        </div>
                        {user?.role === "ADMIN" && (
                          <div className="mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-300" />
                            <p className="text-[10px] text-slate-400">{msg.time}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {agentTyping && (
                    <div className="flex gap-2">
                      <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                        S
                      </div>
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:px-4 py-2">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-blue-400"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-slate-200 bg-white p-2 sm:p-3">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      id="livechat-input"
                      maxLength={300}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-40"
                      id="livechat-send-btn"
                      aria-label="Send message"
                    >
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                  {messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="mt-2 text-xs text-slate-400 transition hover:text-slate-600"
                    >
                      Clear conversation
                    </button>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveChat;
