import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useState } from "react";

const LANGS = [
  { code: "en", label: "EN", full: "English" },
  { code: "hi", label: "हि", full: "हिंदी" },
  { code: "ga", label: "ग", full: "गढ़वाली" },
];

export default function Navbar({ transparent = false }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        transparent
          ? "bg-transparent"
          : "bg-[#0d1f0d]/90 backdrop-blur-md border-b border-green-900/30"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/40 group-hover:scale-110 transition-transform">
          <span className="text-white text-lg">🌿</span>
        </div>
        <span
          className="text-white font-bold text-xl tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Plant<span className="text-green-400">AI</span>
        </span>
      </Link>

      {/* Language Switcher */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-600/50 bg-green-900/30 text-green-300 text-sm font-semibold hover:bg-green-800/40 transition-all"
        >
          <span className="text-base">🌐</span>
          {LANGS.find((l) => l.code === lang)?.full}
          <svg
            className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0a1a0a] border border-green-800/50 shadow-xl shadow-black/50 overflow-hidden">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                  lang === l.code
                    ? "bg-green-700/40 text-green-300 font-semibold"
                    : "text-gray-300 hover:bg-green-900/30"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-green-800/50 flex items-center justify-center text-xs font-bold text-green-400">
                  {l.label}
                </span>
                {l.full}
                {lang === l.code && <span className="ml-auto text-green-400">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
