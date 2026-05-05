import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import VedaFloat from "../components/VedaFloat";

const HOW_STEPS = [
  { icon: "📷", key: "step1" },
  { icon: "⬆️", key: "step2" },
  { icon: "📋", key: "step3" },
  {
    icon: (
      <img
        src="src\images\image.png"
        className="rounded-2xl object-contain"
        alt=""
      />
    ),
    key: "step4",
  },
];

const FEATURES = [
  { icon: "🌿", key: "feat1" },
  { icon: "💬", key: "feat2" },
  { icon: "🌱", key: "feat3" },
  { icon: "🧪", key: "feat4" },
  { icon: "🌐", key: "feat5" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLang();

  return (
    <div
      className="min-h-screen bg-[#060f06] text-white"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#060f06]" />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/40 to-transparent" />
        </div>

        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-green-500/5 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-emerald-400/5 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto my-5">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/40 border border-green-700/40 text-green-400 text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            AI-Powered • CNN Deep Learning
          </div> */}

          <h1 className="text-5xl sm:text-7xl font-black leading-tight mb-6 tracking-tight">
            <span className="text-white">{t("hero_title")}</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              {t("hero_title2")}
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Instant plant disease diagnosis powered by deep learning. Upload a
            leaf photo and get expert AI analysis in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/detect")}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-lg hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300"
            >
              {t("hero_btn")} →
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="px-10 py-4 rounded-full bg-green-800/40 border border-green-600/50 text-green-300 font-semibold text-lg hover:bg-green-700/50 hover:scale-105 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 justify-center"
            >
              <img
                src="src/images/image.png"
                className="w-6 h-6 object-contain rounded-full"
                alt=""
              />
              {t("hero_chat_btn")}
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-green-600 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-green-700/50 flex items-center justify-center">
            <div className="w-1 h-3 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#060f06] to-[#0a1a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-500 text-sm font-semibold tracking-widest uppercase mb-3">
              Simple & Fast
            </p>
            <h2 className="text-4xl font-black text-white">{t("how_title")}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_STEPS.map((step, i) => (
              <div key={step.key} className="relative group">
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-green-700/60 to-transparent z-0" />
                )}
                <div className="relative z-10 bg-gradient-to-b from-[#0f2010] to-[#0a1a0a] border border-green-900/50 rounded-3xl p-6 text-center hover:border-green-600/50 hover:-translate-y-2 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-green-900/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-800/30 border border-green-700/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-green-600 text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">
                    {t(`${step.key}_title`)}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {t(`${step.key}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VEDA Section */}
      <section className="py-24 px-6 bg-[#0a1a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-[#0f2e10] to-[#071207] border border-green-800/40 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left */}
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <p className="text-green-400 text-sm font-semibold tracking-widest uppercase mb-4">
                  {t("meet_veda")}
                </p>
                <h2 className="text-5xl font-black text-white mb-4 tracking-tight">
                  VED<span className="text-green-400">A</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  {t("veda_tagline")}
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    { icon: "🔬", key: "detect_diseases", desc: "detect_desc" },
                    { icon: "💡", key: "expert_advice", desc: "expert_desc" },
                    { icon: "🌐", key: "multilang", desc: "multilang_desc" },
                  ].map((f) => (
                    <div key={f.key} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-900/50 border border-green-800/50 flex items-center justify-center text-xl flex-shrink-0">
                        {f.icon}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {t(f.key)}
                        </p>
                        <p className="text-gray-500 text-xs">{t(f.desc)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/chat")}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold text-base hover:scale-105 hover:shadow-xl hover:shadow-green-900/50 transition-all duration-300 w-fit"
                >
                  🌿 {t("hero_chat_btn")}
                </button>
              </div>

              {/* Right — Robot visual */}
              <div className="relative flex items-center justify-center p-10 bg-gradient-to-br from-green-950/20 to-transparent overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <div className="w-80 h-80 rounded-full border-4 border-green-400" />
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-5"
                  style={{ transform: "scale(0.6)" }}
                >
                  <div className="w-80 h-80 rounded-full border-4 border-green-400" />
                </div>
                <div className="relative z-10 text-center">
                  <div className="text-[120px] leading-none select-none filter drop-shadow-2xl animate-float">
                    <img
                      src="src\images\image.png"
                      className="rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {[
                      "Friendly & Supportive",
                      "Smart & Knowledgeable",
                      "Multi-lingual Expert",
                    ].map((trait) => (
                      <span
                        key={trait}
                        className="text-xs px-3 py-1 rounded-full bg-green-900/40 border border-green-800/40 text-green-400"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-green-600 text-sm italic">
                    "I Care for Plants, So You Can Grow Better."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Bar */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#0a1a0a] to-[#060f06] border-t border-green-900/20">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-green-500 text-sm font-semibold tracking-widest uppercase mb-10">
            {t("features_title")}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.key}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#0f2010]/50 border border-green-900/30 hover:border-green-700/50 transition group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {f.icon}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm">{t(f.key)}</p>
                  <p className="text-gray-600 text-xs">{t(`${f.key}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-green-900 text-sm border-t border-green-950/50">
        <p>
          🌿 VEDA – Your AI Plant Assistant for a Healthier, Greener Tomorrow
          🌍🌱
        </p>
      </footer>

      <VedaFloat />
    </div>
  );
}
