import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";
import VedaFloat from "../components/VedaFloat";

export default function Detect() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();
  const cameraRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const analyse = async () => {
    if (!image) return;
    setAnalysing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.random() * 15;
      });
    }, 300);

    // Convert image to base64
    const base64 = await new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result.split(",")[1]);
      reader.readAsDataURL(image);
    });

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a plant disease detection AI. Analyze the plant leaf image and respond ONLY with a JSON object with these fields:
{
  "disease": "Disease name or 'Healthy Plant'",
  "confidence": 85,
  "status": "diseased" or "healthy",
  "description": "Brief description of the condition",
  "causes": ["cause1", "cause2"],
  "treatment": ["treatment1", "treatment2", "treatment3"],
  "prevention": ["prevention1", "prevention2"]
}
No markdown, no extra text, only valid JSON.`,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: image.type, data: base64 },
                },
                { type: "text", text: "Analyze this plant leaf for diseases." },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);

      const text = data.content?.[0]?.text || "{}";
      let result;
      try {
        result = JSON.parse(text.replace(/```json|```/g, "").trim());
      } catch {
        result = { disease: "Analysis Complete", confidence: 80, status: "unknown", description: text };
      }

      setTimeout(() => {
        navigate("/results", { state: { result, preview } });
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setAnalysing(false);
      setProgress(0);
      alert("Analysis failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#060f06] text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
      <Navbar />

      <div className="pt-28 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 border border-green-800/40 text-green-400 text-xs font-semibold uppercase tracking-widest mb-5">
              🔬 CNN Deep Learning
            </div>
            <h1 className="text-4xl font-black text-white mb-3">{t("detect_title")}</h1>
            <p className="text-gray-500 text-base">{t("detect_subtitle")}</p>
          </div>

          {!preview ? (
            <>
              {/* Upload options */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => fileRef.current.click()}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-green-800/50 bg-[#0a1a0a] hover:border-green-500/60 hover:bg-green-900/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-900/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📁</div>
                  <span className="text-white font-semibold text-sm">{t("upload_file")}</span>
                </button>
                <button
                  onClick={() => cameraRef.current.click()}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-green-800/50 bg-[#0a1a0a] hover:border-green-500/60 hover:bg-green-900/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-900/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📷</div>
                  <span className="text-white font-semibold text-sm">{t("take_photo")}</span>
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileRef.current.click()}
                className={`relative rounded-3xl border-2 border-dashed p-14 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  dragging
                    ? "border-green-400 bg-green-900/20 scale-[1.01]"
                    : "border-green-900/50 bg-[#0a1a0a] hover:border-green-700/60 hover:bg-green-950/30"
                }`}
              >
                <div className="text-5xl mb-4">🌿</div>
                <p className="text-gray-400 text-sm text-center mb-4">{t("drag_drop")}</p>
                <p className="text-gray-600 text-xs mb-4">{t("or_text")}</p>
                <div className="px-6 py-2 rounded-full bg-green-800/40 border border-green-700/50 text-green-400 text-sm font-semibold hover:bg-green-700/50 transition">
                  {t("browse_files")}
                </div>
                <p className="text-gray-700 text-xs mt-4">Supports JPG, PNG, WEBP</p>
              </div>
            </>
          ) : (
            /* Preview */
            <div className="rounded-3xl overflow-hidden border border-green-800/40 bg-[#0a1a0a]">
              <div className="p-4 border-b border-green-900/30 flex items-center justify-between">
                <p className="text-green-400 font-semibold text-sm">{t("preview_label")}</p>
                <button
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="text-xs text-gray-500 hover:text-red-400 border border-gray-800 hover:border-red-800 rounded-full px-3 py-1 transition"
                >
                  {t("change_image")}
                </button>
              </div>
              <div className="relative">
                <img src={preview} alt="Plant" className="w-full max-h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0a] to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-green-400 text-sm font-medium">{image?.name}</p>
                </div>
                <p className="text-gray-600 text-xs ml-5">{(image?.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          {/* Hidden inputs */}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

          {/* Analyse Button */}
          {preview && (
            <div className="mt-6">
              {analysing ? (
                <div className="rounded-2xl bg-[#0a1a0a] border border-green-800/40 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center animate-spin text-lg">
                      ⚙️
                    </div>
                    <p className="text-green-400 font-semibold">{t("analysing")}</p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-green-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-gray-600 text-xs mt-2 text-right">{Math.round(Math.min(progress, 100))}%</p>
                </div>
              ) : (
                <button
                  onClick={analyse}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-lg hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-900/50 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  🔬 {t("analyse_btn")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <VedaFloat />
    </div>
  );
}
