import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Minimize2, Trash2 } from "lucide-react";

// ── Gemini API Config ──────────────────────────────────────────────────────────
// Replace this with your own key from https://makersuite.google.com/app/apikey
const GEMINI_API_KEY = "AIzaSyDemo_Replace_With_Your_Key"; // ← replace this
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are UniEvents AI Assistant — a helpful, friendly, and knowledgeable chatbot for the UniEvents university event management platform.

You help students and staff with:
- Browsing and discovering events (tech, cultural, sports, academic)
- Booking events and understanding the booking flow
- Payment queries (card payments, bank transfers)
- Venue information and availability
- Cancellation and refund policies (3-5 business days)
- Account management, login issues, and profile updates
- General university event questions

Key platform info:
- Platform: UniEvents (SLIIT University, Sri Lanka)
- Currency: LKR (Sri Lankan Rupee)
- Support email: support@unievents.lk
- Live chat available for real human support
- Admin can be reached via Live Support widget

Keep responses concise, helpful, and friendly. Use markdown formatting (bold, lists) for clarity.
If a question is outside your scope, politely redirect to the live support chat.`;

const SUGGESTIONS = [
  "How do I book an event?",
  "What venues are available?",
  "How do I cancel my booking?",
  "What payment methods are accepted?",
  "How do I get a refund?",
];

const STORAGE_KEY = "unievents_ai_chat";

const formatMarkdown = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^• /gm, "• ")
    .replace(/^- (.+)/gm, "• $1")
    .replace(/\n/g, "<br/>");

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        {
          role: "bot",
          text: "👋 Hi! I'm **UniEvents AI Assistant** powered by Google Gemini.\n\nI can help you with bookings, events, venues, payments, and more!\n\nWhat would you like to know?",
          timestamp: Date.now(),
        },
      ];
    } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open]);

  useEffect(() => {
    if (open && !minimized) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, minimized]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60))); } catch {}
  }, [messages]);

  // Build Gemini conversation history
  const buildHistory = (msgs) =>
    msgs
      .filter((m) => m.role !== "bot" || msgs.indexOf(m) > 0) // skip greeting
      .slice(-10) // last 10 for context window
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

  const sendMessage = async (text = input.trim()) => {
    if (!text || loading) return;

    const userMsg = { role: "user", text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = buildHistory([...messages, userMsg]);
      // Remove the last user message from history since we pass it as contents
      const contextHistory = history.slice(0, -1);

      const body = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          ...contextHistory,
          { role: "user", parts: [{ text }] },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      };

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || "Gemini API error");
      }

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) throw new Error("Empty response from Gemini");

      const botMsg = { role: "bot", text: reply, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
      if (!open) setUnread((u) => u + 1);
    } catch (err) {
      console.error("Gemini error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `⚠️ I'm having trouble connecting right now. Please try again or use the **Live Support** chat for immediate help.\n\n_Error: ${err.message}_`,
          timestamp: Date.now(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    const initial = [{
      role: "bot",
      text: "👋 Hi! I'm **UniEvents AI Assistant** powered by Google Gemini.\n\nHow can I help you today?",
      timestamp: Date.now(),
    }];
    setMessages(initial);
    localStorage.removeItem(STORAGE_KEY);
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => { setOpen(true); setUnread(0); }}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl font-bold text-sm text-white transition-all duration-300 ${
          open ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        aria-label="Open AI chatbot"
        id="chatbot-trigger-btn"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-black animate-pulse">
              {unread}
            </span>
          )}
        </div>
        <span>AI Assistant</span>
        <Sparkles className="w-4 h-4 opacity-80" />
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 origin-bottom-right bg-white ${
          open ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"
        }`}
        style={{ width: 370, height: minimized ? 64 : 560 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-black text-sm flex items-center gap-1.5">
                UniEvents AI
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-semibold">Gemini</span>
              </p>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Powered by Google AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
              aria-label="Clear chat"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMinimized((m) => !m)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
              aria-label="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setOpen(false); setMinimized(false); }}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer"
              aria-label="Close chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                      msg.role === "bot" ? "bg-gradient-to-br from-indigo-500 to-violet-600" : "bg-indigo-600"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <Bot className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  {/* Bubble */}
                  <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "bot"
                          ? msg.isError
                            ? "bg-red-50 border border-red-200 text-red-800 rounded-tl-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                          : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-tr-sm shadow-sm"
                      }`}
                      dangerouslySetInnerHTML={
                        msg.role === "bot" ? { __html: formatMarkdown(msg.text) } : undefined
                      }
                    >
                      {msg.role === "user" ? msg.text : undefined}
                    </div>
                    {msg.timestamp && (
                      <span className="text-[10px] text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 1 && (
              <div className="px-3 py-2 flex gap-1.5 flex-wrap border-t border-slate-100 bg-white">
                {SUGGESTIONS.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 transition cursor-pointer border border-indigo-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything about events..."
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-slate-50"
                disabled={loading}
                id="chatbot-input"
                maxLength={500}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition cursor-pointer disabled:opacity-40 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                aria-label="Send message"
                id="chatbot-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Footer note */}
            <div className="px-3 pb-2 text-center">
              <p className="text-[10px] text-slate-400">
                Powered by Google Gemini · UniEvents AI
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AIChatbot;
