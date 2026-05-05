import { useLocation, useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import VedaFloat from "../components/VedaFloat";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useLang();

  const result = state?.result || {
    disease: "Early Blight",
    confidence: 87,
    status: "diseased",
    description: "Early blight is a common fungal disease caused by Alternaria solani.",
    causes: ["Fungal infection (Alternaria solani)", "High humidity and warm temperatures", "Poor air circulation"],
    treatment: ["Apply copper-based fungicide", "Remove and destroy affected leaves", "Ensure proper plant spacing"],
    prevention: ["Use disease-resistant varieties", "Avoid overhead watering", "Rotate crops annually"],
  };

  const preview = state?.preview;
  const isHealthy = result.status === "healthy";
  const confidence = Math.round(result.confidence || 0);

  return (
    <div className="min-h-screen bg-[#060f06] text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
      <Navbar />

      <div className="pt-28 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2">{t("results_title")}</h1>
            <p className="text-gray-500 text-sm">{t("results_subtitle")}</p>
          </div>

          {/* Main result card */}
          <div className="rounded-3xl overflow-hidden border border-green-800/40 bg-[#0a1a0a] mb-6">
            {/* Image */}
            {preview && (
              <div className="relative h-52 overflow-hidden">
                <img src={preview} alt="Plant" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0a] via-[#0a1a0a]/20 to-transparent" />
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold ${
                  isHealthy ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                }`}>
                  {isHealthy ? "✓ Healthy" : "⚠ Disease Detected"}
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Disease name */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                    {isHealthy ? t("healthy") : t("disease_detected")}
                  </p>
                  <h2 className="text-2xl font-black text-white">{result.disease}</h2>
                  {result.description && (
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-sm">{result.description}</p>
                  )}
                </div>
                {/* Confidence meter */}
                <div className="flex-shrink-0 ml-4">
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a2e1a" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={isHealthy ? "#22c55e" : confidence > 70 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="3"
                        strokeDasharray={`${confidence} ${100 - confidence}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white font-black text-sm">{confidence}%</span>
                      <span className="text-gray-500 text-[9px] uppercase">{t("confidence")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-2 ${
                isHealthy ? "bg-green-900/30 border border-green-800/40" : "bg-red-900/20 border border-red-900/30"
              }`}>
                <span className="text-2xl">{isHealthy ? "✅" : "🔴"}</span>
                <div>
                  <p className={`font-semibold text-sm ${isHealthy ? "text-green-400" : "text-red-400"}`}>
                    {isHealthy ? "Your plant is healthy!" : "Disease detected — action recommended"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detail cards */}
          {!isHealthy && (
            <div className="space-y-4 mb-8">
              {result.causes?.length > 0 && (
                <DetailCard icon="🔍" title={t("causes")} items={result.causes} color="amber" />
              )}
              {result.treatment?.length > 0 && (
                <DetailCard icon="💊" title={t("treatment")} items={result.treatment} color="blue" />
              )}
              {result.prevention?.length > 0 && (
                <DetailCard icon="🛡️" title={t("prevention")} items={result.prevention} color="green" />
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/detect")}
              className="py-4 rounded-2xl border border-green-800/50 bg-[#0a1a0a] text-green-400 font-semibold hover:bg-green-900/20 hover:border-green-600/50 transition-all flex items-center justify-center gap-2"
            >
              🔄 {t("scan_again")}
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold hover:scale-[1.02] hover:shadow-xl hover:shadow-green-900/50 transition-all flex items-center justify-center gap-2"
            >
              <img src="src\images\image.png" alt="" /> {t("ask_veda")}
            </button>
          </div>
        </div>
      </div>

      <VedaFloat />
    </div>
  );
}

function DetailCard({ icon, title, items, color }) {
  const colorMap = {
    amber: "border-amber-900/30 bg-amber-950/10",
    blue: "border-blue-900/30 bg-blue-950/10",
    green: "border-green-900/30 bg-green-950/10",
  };
  const dotMap = {
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="text-white font-bold text-sm">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${dotMap[color]}`} />
            <span className="text-gray-400 text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
