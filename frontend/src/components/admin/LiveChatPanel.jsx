import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, Send, RefreshCw, Users, Trash2, AlertCircle, MessageCircle, Clock } from "lucide-react";
import { readChatStore, writeChatStore } from "../chat/LiveChat";

/**
 * LiveChatPanel — Admin 2-column live support view.
 * Left: list of unique student senders.
 * Right: full conversation with the selected student + reply box.
 * Polls every 3 s without causing page reloads (useRef for counts).
 */
const LiveChatPanel = ({ adminName = "Admin" }) => {
  const [messages, setMessages]       = useState([]);
  const [selected, setSelected]       = useState(null); // selected sender name
  const [reply, setReply]             = useState("");
  const [newAlert, setNewAlert]       = useState(false);
  const lastCountRef                  = useRef(0);
  const messagesEndRef                = useRef(null);
  const inputRef                      = useRef(null);

  // ── Stable loader — does NOT trigger re-render unless data changed ──────────
  const loadMessages = useCallback(() => {
    const store = readChatStore();
    const msgs  = store.messages || [];

    if (msgs.length > lastCountRef.current) {
      lastCountRef.current = msgs.length;
      setNewAlert(true);
      setTimeout(() => setNewAlert(false), 3000);
    }

    // Only update state when content actually changes (avoids re-render loops)
    setMessages(prev => {
      if (prev.length === msgs.length && prev[prev.length - 1]?.id === msgs[msgs.length - 1]?.id) {
        return prev; // identical — skip re-render
      }
      return msgs;
    });
  }, []);

  // ── Poll every 3 s — interval is stable, no reload ──────────────────────────
  useEffect(() => {
    loadMessages();
    const id = setInterval(loadMessages, 3000);
    return () => clearInterval(id);
  }, [loadMessages]);

  // ── Scroll to bottom whenever the selected conversation updates ─────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selected]);

  // ── Derive unique student list from messages ─────────────────────────────────
  const students = (() => {
    const map = new Map(); // senderName → { lastMsg, unread, count }
    messages.forEach(m => {
      if (m.role !== "user") return;
      const name = m.sender || "Student";
      const existing = map.get(name);
      if (!existing) {
        map.set(name, { name, lastMsg: m.text, lastTime: m.time, count: 1 });
      } else {
        existing.lastMsg  = m.text;
        existing.lastTime = m.time;
        existing.count   += 1;
        map.set(name, existing);
      }
    });
    return [...map.values()];
  })();

  // ── Auto-select first student if none selected ──────────────────────────────
  useEffect(() => {
    if (!selected && students.length > 0) setSelected(students[0].name);
  }, [students.length]); // eslint-disable-line

  // ── Messages for selected student conversation ───────────────────────────────
  const conversation = selected
    ? messages.filter(m => m.role === "agent" || m.sender === selected || (!m.sender && m.role === "user"))
    : messages;

  // ── Send reply ───────────────────────────────────────────────────────────────
  const sendReply = () => {
    const text = reply.trim();
    if (!text) return;

    const agentMsg = {
      id:        `agent_${Date.now()}`,
      role:      "agent",
      text,
      agent:     adminName,
      time:      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      isAuto:    false,
    };

    const store   = readChatStore();
    const updated = [...(store.messages || []), agentMsg];
    writeChatStore({ ...store, messages: updated });
    lastCountRef.current = updated.length;
    setMessages(updated);
    setReply("");
    inputRef.current?.focus();
  };

  const clearAll = () => {
    if (!window.confirm("Clear all chat messages?")) return;
    writeChatStore({ messages: [], session: null });
    setMessages([]);
    lastCountRef.current = 0;
    setSelected(null);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); }
  };

  const fmt = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 h-full">

      {/* New message alert */}
      {newAlert && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          New student message received!
        </div>
      )}

      {/* ── 2-column split ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4 flex-1 min-h-0">

        {/* LEFT: Customer list */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-black text-slate-800">Students</span>
              {students.length > 0 && (
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                  {students.length}
                </span>
              )}
            </div>
            <button
              onClick={loadMessages}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Student list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                <Users className="w-9 h-9 mb-2 opacity-40" />
                <p className="text-sm font-semibold">No students yet</p>
                <p className="text-xs mt-1 text-slate-300">Messages appear here</p>
              </div>
            ) : (
              students.map(s => (
                <button
                  key={s.name}
                  onClick={() => setSelected(s.name)}
                  className={`w-full text-left px-4 py-3 transition cursor-pointer flex items-start gap-3 ${
                    selected === s.name
                      ? "bg-indigo-50 border-l-2 border-indigo-500"
                      : "hover:bg-slate-50 border-l-2 border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm ${
                    selected === s.name ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-sm font-bold truncate ${selected === s.name ? "text-indigo-700" : "text-slate-800"}`}>
                        {s.name}
                      </p>
                      {s.lastTime && (
                        <span className="text-[10px] text-slate-400 shrink-0">{s.lastTime}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{s.lastMsg}</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{s.count} message{s.count !== 1 ? "s" : ""}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Clear all footer */}
          {messages.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2">
              <button
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-red-500 hover:text-red-700 py-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Clear all messages
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Chat window */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden h-full">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2.5">
              {selected ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
                    {selected.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{selected}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Active session
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-500">Select a student to view chat</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50" style={{ minHeight: 0 }}>
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
                <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-semibold">No messages yet</p>
                <p className="text-xs mt-1">Student messages will appear here in real-time</p>
              </div>
            ) : (
              conversation.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "agent" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black ${
                    msg.role === "agent" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {msg.role === "agent" ? adminName.charAt(0).toUpperCase() : (msg.sender?.charAt(0).toUpperCase() || "S")}
                  </div>
                  <div className="max-w-[75%]">
                    <p className={`text-[10px] font-semibold mb-1 ${msg.role === "agent" ? "text-right text-indigo-500" : "text-blue-500"}`}>
                      {msg.role === "agent"
                        ? `${msg.agent}${msg.isAuto ? " (auto)" : ""}`
                        : `Student: ${msg.sender || "Unknown"}`}
                    </p>
                    <div
                      className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        msg.role === "agent"
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                      }`}
                      dangerouslySetInnerHTML={msg.role === "agent" ? { __html: fmt(msg.text) } : undefined}
                    >
                      {msg.role === "user" ? msg.text : undefined}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5 text-slate-300" />
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply input */}
          <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={handleKey}
              placeholder={selected ? `Reply to ${selected}...` : "Select a student first..."}
              disabled={!selected}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              id="admin-chat-reply-input"
            />
            <button
              onClick={sendReply}
              disabled={!reply.trim() || !selected}
              className="px-4 py-2 rounded-xl text-white text-sm font-bold transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              id="admin-chat-send-btn"
            >
              <Send className="w-3.5 h-3.5" /> Reply
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Messages sync with the student Live Chat widget · Auto-refreshes every 3 seconds
      </p>
    </div>
  );
};

export default LiveChatPanel;
