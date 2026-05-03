import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  MessageSquare, Send, RefreshCw, Users, Trash2,
  AlertCircle, MessageCircle, Clock,
} from "lucide-react";

const STORAGE_KEY = "viva_chat_final";

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { messages: [] };
  } catch {
    return { messages: [] };
  }
};

const writeStore = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

/**
 * LiveChatPanel — Admin 2-column live support view.
 * Left: list of unique student sessions, sorted by most recent message.
 * Right: full conversation with the selected student + reply box.
 */
const LiveChatPanel = ({ adminName = "Admin" }) => {
  const [messages, setMessages]   = useState([]);
  const [selected, setSelected]   = useState(null); // selected sessionId
  const [reply, setReply]         = useState("");
  const [newAlert, setNewAlert]   = useState(false);
  const [seenCounts, setSeenCounts] = useState({}); // sessionId → count seen by admin

  const prevMsgCount  = useRef(0);
  const prevSelected  = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // ── Load from localStorage ──────────────────────────────────────────────────
  const loadMessages = useCallback(() => {
    const store = readStore();
    const msgs  = Array.isArray(store.messages) ? store.messages : [];

    // Only trigger alert for genuinely new messages
    if (msgs.length > prevMsgCount.current) {
      prevMsgCount.current = msgs.length;
      setNewAlert(true);
      setTimeout(() => setNewAlert(false), 3000);
    }

    setMessages(msgs);
  }, []);

  // ── Poll every 500 ms + cross-tab storage event ─────────────────────────────
  useEffect(() => {
    const onStorage = (e) => { if (e.key === STORAGE_KEY) loadMessages(); };
    window.addEventListener("storage", onStorage);
    loadMessages();
    const id = setInterval(loadMessages, 500);
    return () => { clearInterval(id); window.removeEventListener("storage", onStorage); };
  }, [loadMessages]);

  // ── Scroll to bottom when conversation updates ──────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selected]);

  // ── Build student session list, sorted by most recent user message ──────────
  const students = useMemo(() => {
    const map = new Map(); // sessionId → { name, lastMsg, lastTimestamp, userCount, sessionId }

    messages.forEach((m) => {
      const sid  = m.sessionId || m.sender || "unknown_session";
      const name = m.role === "user"
        ? (m.sender || "Student")
        : (map.get(sid)?.name || "Student");

      const existing = map.get(sid);
      if (!existing) {
        map.set(sid, {
          name,
          lastMsg:       m.text,
          lastTime:      m.time,
          lastTimestamp: m.timestamp || 0,
          userCount:     m.role === "user" ? 1 : 0,
          sessionId:     sid,
        });
      } else {
        // Always track the latest timestamp for sorting
        if ((m.timestamp || 0) > existing.lastTimestamp) {
          existing.lastTimestamp = m.timestamp || 0;
          existing.lastMsg  = m.text;
          existing.lastTime = m.time;
        }
        if (m.role === "user") {
          existing.name = m.sender || existing.name;
          existing.userCount += 1;
        }
        map.set(sid, existing);
      }
    });

    // Sort: most recently active session first
    return [...map.values()].sort((a, b) => b.lastTimestamp - a.lastTimestamp);
  }, [messages]);

  // ── Auto-select the most recent student session (only if nothing selected) ──
  // Also auto-switch when a brand-new session appears (no prior selection)
  useEffect(() => {
    if (students.length === 0) return;
    const mostRecent = students[0].sessionId;

    if (!selected) {
      // Nothing chosen yet — pick the freshest session
      setSelected(mostRecent);
    } else if (!students.find((s) => s.sessionId === selected)) {
      // Previously selected session was cleared — fall back to newest
      setSelected(mostRecent);
    }
    // If admin has already chosen a session, leave their choice alone
  }, [students]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Track unread counts per session ─────────────────────────────────────────
  // When a session becomes selected, mark all its current messages as "seen"
  useEffect(() => {
    if (!selected) return;
    const sessionMsgs = messages.filter(
      (m) => (m.sessionId || m.sender || "unknown_session") === selected
    );
    setSeenCounts((prev) => ({ ...prev, [selected]: sessionMsgs.length }));
    prevSelected.current = selected;
  }, [selected, messages]);

  // ── Messages for the selected conversation ───────────────────────────────────
  const conversation = useMemo(
    () =>
      selected
        ? messages.filter(
            (m) => (m.sessionId || m.sender || "unknown_session") === selected
          )
        : [],
    [messages, selected]
  );

  // ── Unread count per session (messages arrived after last seen) ──────────────
  const getUnread = (sid) => {
    const total = messages.filter(
      (m) => (m.sessionId || m.sender || "unknown_session") === sid && m.role === "user"
    ).length;
    const seen = seenCounts[sid] || 0;
    return Math.max(0, total - seen);
  };

  // ── Send admin reply ─────────────────────────────────────────────────────────
  const sendReply = () => {
    const text = reply.trim();
    if (!text || !selected) return;

    const agentMsg = {
      id:        `agent_${Date.now()}`,
      role:      "agent",
      text,
      agent:     adminName,
      sender:    adminName,
      time:      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      isAuto:    false,
      sessionId: selected,
    };

    const store   = readStore();
    const updated = [...(Array.isArray(store.messages) ? store.messages : []), agentMsg];
    writeStore({ ...store, messages: updated });

    prevMsgCount.current = updated.length;
    setMessages(updated);
    setReply("");
    inputRef.current?.focus();
  };

  const clearAll = () => {
    if (!window.confirm("Clear all chat messages?")) return;
    writeStore({ messages: [] });
    setMessages([]);
    prevMsgCount.current = 0;
    setSelected(null);
    setSeenCounts({});
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); }
  };

  const fmt = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");

  const selectedStudent = students.find((s) => s.sessionId === selected);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 h-full">

      {/* New message alert */}
      {newAlert && (
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          New student message received!
        </div>
      )}

      {/* ── 2-column split ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4 flex-1 min-h-0">

        {/* LEFT: Student session list */}
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

          {/* Session list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {students.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                <Users className="w-9 h-9 mb-2 opacity-40" />
                <p className="text-sm font-semibold">No students yet</p>
                <p className="text-xs mt-1 text-slate-300">Messages appear here</p>
              </div>
            ) : (
              students.map((s) => {
                const isActive = selected === s.sessionId; // ← fixed: compare sessionIds
                const unread   = isActive ? 0 : getUnread(s.sessionId);
                return (
                  <button
                    key={s.sessionId}
                    onClick={() => setSelected(s.sessionId)}
                    className={`w-full text-left px-4 py-3 transition cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? "bg-indigo-50 border-l-2 border-indigo-500"
                        : "hover:bg-slate-50 border-l-2 border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm ${
                      isActive   // ← fixed: was s.name comparison (always false)
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-sm font-bold truncate ${
                          isActive ? "text-indigo-700" : "text-slate-800"  // ← fixed
                        }`}>
                          {s.name}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {unread > 0 && (
                            <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                              {unread}
                            </span>
                          )}
                          {s.lastTime && (
                            <span className="text-[10px] text-slate-400">{s.lastTime}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{s.lastMsg}</p>
                      <p className="text-[10px] text-slate-300 mt-0.5">
                        {s.userCount} student message{s.userCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </button>
                );
              })
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
              {selectedStudent ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{selectedStudent.name}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Active session · {conversation.length} messages
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
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50" style={{ minHeight: 0 }}>
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16">
                <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-semibold">
                  {selected ? "No messages in this session yet" : "No messages yet"}
                </p>
                <p className="text-xs mt-1">Student messages will appear here in real-time</p>
              </div>
            ) : (
              conversation.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === "agent" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black ${
                    msg.role === "agent"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {msg.role === "agent"
                      ? adminName.charAt(0).toUpperCase()
                      : (msg.sender?.charAt(0).toUpperCase() || "S")}
                  </div>
                  <div className="max-w-[75%]">
                    <p className={`text-[10px] font-semibold mb-1 ${
                      msg.role === "agent" ? "text-right text-indigo-500" : "text-blue-500"
                    }`}>
                      {msg.role === "agent"
                        ? `${msg.agent || adminName}${msg.isAuto ? " (auto)" : ""}`
                        : `Student: ${msg.sender || "Unknown"}`}
                    </p>
                    <div
                      className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                        msg.role === "agent"
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                      }`}
                      dangerouslySetInnerHTML={{ __html: fmt(msg.text) }}
                    />
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
              placeholder={selectedStudent ? `Reply to ${selectedStudent.name}…` : "Select a student first…"}
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

      <p className="text-[10px] font-mono text-slate-400 text-center uppercase tracking-widest mt-2">
        Sync: {messages.length} total messages · {students.length} session{students.length !== 1 ? "s" : ""} · 500 ms interval
      </p>
    </div>
  );
};

export default LiveChatPanel;