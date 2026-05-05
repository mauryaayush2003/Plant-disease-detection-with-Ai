import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";

const VEDA_AVATAR = () => (
  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-emerald-700 flex items-center justify-center text-xl shadow-lg">
    <img src="src\images\image.png" alt="" />
  </div>
);

export default function VedaFloat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "veda", text: t("veda_greeting") }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const API_KEY = "AIzaSyBghJm-8kQw7u6omcPM6cTVfVC1AnlceQ0";
      const chatHistory = messages.filter((m) => m.text).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));
      chatHistory.push({ role: "user", parts: [{ text: userText }] });

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: chatHistory,
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1000,
          },
          systemInstruction: {
            parts: [{ text: `You are VEDA, a friendly AI plant assistant. You help farmers and gardeners with plant diseases, care tips, fertilizer guides, and plant health. Be concise, warm, and practical. Always respond in the same language as the user's message. Supported languages: English, Hindi, Garhwali. Current language preference: ${lang}` }],
          },
        }),
      });
      console.log('API Response status:', res.status);
      const data = await res.json();
      console.log('API Response data:', data);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond right now.";
      setMessages((prev) => [...prev, { role: "veda", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "veda", text: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const chips = [
    { label: t("chip_tomato"), emoji: "🍅" },
    { label: t("chip_wheat"), emoji: "🌾" },
    { label: t("chip_care"), emoji: "🌱" },
    { label: t("chip_fertilizer"), emoji: "🧪" },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 shadow-2xl shadow-green-900/50 flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300 border-2 border-green-400/30"
        title="Chat with VEDA"
      >
        {open ? "✕" : <img src="src\images\image.png" className="rounded-3xl" alt="" />}
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-green-800/50 flex flex-col"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1a3a1a] to-[#0f2d0f] px-4 py-3 flex items-center justify-between border-b border-green-800/40">
            <div className="flex items-center gap-3">
              <VEDA_AVATAR />
              <div>
                <p className="text-white font-bold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>VEDA</p>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  {t("chat_online")}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/chat")}
              className="text-xs text-green-400 border border-green-700 rounded-full px-3 py-1 hover:bg-green-800/40 transition"
            >
              Full Chat →
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-[#0a1a0a] px-3 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2 items-end`}>
                {msg.role === "veda" && <VEDA_AVATAR />}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-green-700 text-white rounded-br-sm"
                      : "bg-[#1a2e1a] text-gray-200 rounded-bl-sm border border-green-900/40"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start gap-2 items-end">
                <VEDA_AVATAR />
                <div className="bg-[#1a2e1a] border border-green-900/40 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          <div className="bg-[#0a1a0a] px-3 pt-2 flex gap-2 overflow-x-auto pb-1 border-t border-green-900/30">
            {chips.map((c) => (
              <button
                key={c.label}
                onClick={() => sendMessage(c.label)}
                className="whitespace-nowrap text-xs px-3 py-1.5 rounded-full border border-green-700/50 text-green-300 bg-green-900/20 hover:bg-green-800/40 transition flex items-center gap-1"
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-[#0a1a0a] px-3 py-3 border-t border-green-900/30 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={t("chat_placeholder")}
              className="flex-1 bg-[#1a2e1a] border border-green-800/50 rounded-full px-4 py-2 text-sm text-white placeholder-green-700 outline-none focus:border-green-500 transition"
            />
            <button
              onClick={() => sendMessage()}
              className="w-9 h-9 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition text-white text-sm"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
