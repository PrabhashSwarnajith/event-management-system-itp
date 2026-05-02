import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, RefreshCw, Users, Clock, Trash2, AlertCircle } from "lucide-react";
import { readChatStore, writeChatStore } from "../chat/LiveChat";

/**
 * LiveChatPanel — Admin section to see & reply to student live-chat messages.
 * Reads/writes the same localStorage key as the user-facing LiveChat widget.
 * Polls every 2 seconds for new student messages.
 */
const LiveChatPanel = ({ adminName = "Admin" }) => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [lastCount, setLastCount] = useState(0);
  const [newMsgAlert, setNewMsgAlert] = useState(false);
  const messagesEndRef = useRef(null);

  const loadMessages = () => {
    const store = readChatStore();
    const msgs = store.messages || [];
    if (msgs.length > lastCount) {
      setNewMsgAlert(true);
      setTimeout(() => setNewMsgAlert(false), 3000);
      setLastCount(msgs.length);
    }
    setMessages(msgs);
  };

  // Poll every 2 seconds
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = () => {
    const text = reply.trim();
    if (!text) return;

    const agentMsg = {
      id: `agent_${Date.now()}`,
      role: "agent",
      text,
      agent: adminName,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      isAuto: false,
    };

    const store = readChatStore();
    const updated = [...(store.messages || []), agentMsg];
    writeChatStore({ ...store, messages: updated });
    setMessages(updated);
    setReply("");
  };

  const clearAll = () => {
    if (!window.confirm("Clear all chat messages?")) return;
    writeChatStore({ messages: [], session: null });
    setMessages([]);
    setLastCount(0);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); }
  };

  const formatMarkdown = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  const userMessages = messages.filter(m => m.role === "user");
  const agentMessages = messages.filter(m => m.role === "agent" && !m.isAuto);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-black text-slate-900">{messages.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Total Messages</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-black text-blue-700">{userMessages.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Student Messages</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
          <p className="text-2xl font-black text-emerald-700">{agentMessages.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Your Replies</p>
        </div>
      </div>

      {/* New message alert */}
      {newMsgAlert && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 flex items-center gap-2 animate-pulse">
          <AlertCircle className="w-4 h-4" />
          New student message received!
        </div>
      )}

      {/* Chat feed */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm">Live Chat Feed</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">Auto-refreshing</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadMessages}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer transition hover:bg-slate-50"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-2.5 py-1.5 cursor-pointer transition hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Users className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-semibold">No messages yet</p>
              <p className="text-xs mt-1">Student messages will appear here in real-time</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "agent" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black ${
                    msg.role === "agent" ? "bg-indigo-100 text-indigo-700" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {msg.role === "agent" ? "A" : (msg.sender?.charAt(0).toUpperCase() || "S")}
                </div>
                <div className="max-w-[75%]">
                  <p className="text-[10px] text-slate-400 mb-1 font-semibold">
                    {msg.role === "agent" ? (
                      <span className="text-indigo-600">
                        {msg.agent} {msg.isAuto && <span className="text-slate-400">(auto-reply)</span>}
                      </span>
                    ) : (
                      <span className="text-blue-600">Student: {msg.sender || "Unknown"}</span>
                    )}
                  </p>
                  <div
                    className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "agent"
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                    }`}
                    dangerouslySetInnerHTML={
                      msg.role === "agent" ? { __html: formatMarkdown(msg.text) } : undefined
                    }
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

        {/* Admin Reply Input */}
        <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a reply to the student..."
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition bg-slate-50"
            id="admin-chat-reply-input"
          />
          <button
            onClick={sendReply}
            disabled={!reply.trim()}
            className="px-4 py-2 rounded-xl text-white text-sm font-bold transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            id="admin-chat-send-btn"
          >
            <Send className="w-3.5 h-3.5" /> Reply
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Messages sync in real-time with the student Live Chat widget · Auto-refreshes every 2 seconds
      </p>
    </div>
  );
};

export default LiveChatPanel;
