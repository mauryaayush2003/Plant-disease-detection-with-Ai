import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LangContext";
import Navbar from "../components/Navbar";

const LANGS_CHAT = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिंदी" },
];

const VEDA_AVATAR = ({ size = "md" }) => (
  <div className={`relative rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center flex-shrink-0 ${size === "lg" ? "w-14 h-14 text-3xl" : "w-10 h-10 text-lg"} shadow-2xl shadow-purple-500/30`}>
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
    <img src="src\images\image.png" className="rounded-2xl w-full h-full object-cover border-2 border-white/30" alt="" />
    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
  </div>
);

export default function Chat() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "veda", text: null }, // will be set via t()
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const bottomRef = useRef(null);
  const fileRef = useRef();
  const recogRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Set initial greeting based on language
  useEffect(() => {
    setMessages([{ role: "veda", text: t("veda_greeting") }]);
  }, [lang]);

  
  const speakText = (text) => {
    // Clean text for TTS - remove emojis and special characters that might cause issues
    const cleanText = text
      .replace(/[🌿🍅🌾🌱🧪🔊🎤🔴]/g, '') // Remove emojis
      .replace(/\*/g, '') // Remove asterisks
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    if (!cleanText) {
      console.log('No text to speak after cleaning');
      return;
    }

    console.log(`Speaking text: "${cleanText}" in language: ${lang}`);

    // Use Sarvam AI TTS for Hindi
    if (lang === "hi") {
      speakWithSarvamAI(cleanText, lang);
    } else {
      // Use browser's built-in speech synthesis for English
      speakWithBrowserTTS(cleanText, "en-US");
    }
  };

  const speakWithSarvamAI = (text, language) => {
    try {
      // Cancel any ongoing audio
      const existingAudio = document.getElementById('tts-audio');
      if (existingAudio) {
        existingAudio.pause();
        existingAudio.remove();
      }

      // API configuration
      const API_KEY = import.meta.env.VITE_API_KEY || "sk_fajkpqtn_MuCf8Y6uu7XE2ZjpVkmeodaC";
      const API_URL = "https://api.sarvam.ai/text-to-speech/stream";

      // Prepare the payload
      const payload = {
        text: text,
        target_language_code: "hi-IN", // Hindi language code
        speaker: "shubh",
        model: "bulbul:v3",
        pace: 1.1,
        speech_sample_rate: 22050,
        output_audio_codec: "mp3",
        enable_preprocessing: true
      };

      // Make the API call
      fetch(API_URL, {
        method: "POST",
        headers: {
          "api-subscription-key": API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create object URL from the blob
        const audioUrl = URL.createObjectURL(blob);
        
        // Create audio element
        const audio = new Audio();
        audio.id = 'tts-audio';
        audio.src = audioUrl;
        audio.volume = 1.0;
        
        audio.onerror = (error) => {
          console.error('Sarvam AI TTS audio error:', error);
          URL.revokeObjectURL(audioUrl);
          // Fallback to browser TTS
          speakWithBrowserTTS(text, "hi-IN");
        };
        
        audio.onended = () => {
          // Clean up audio element and revoke URL
          const audioElement = document.getElementById('tts-audio');
          if (audioElement) {
            audioElement.remove();
          }
          URL.revokeObjectURL(audioUrl);
        };
        
        // Play the audio
        audio.play().catch(error => {
          console.error('Failed to play Sarvam AI TTS:', error);
          URL.revokeObjectURL(audioUrl);
          // Fallback to browser TTS
          speakWithBrowserTTS(text, "hi-IN");
        });
      })
      .catch(error => {
        console.error('Sarvam AI TTS API error:', error);
        // Fallback to browser TTS
        speakWithBrowserTTS(text, "hi-IN");
      });
      
    } catch (error) {
      console.error('Sarvam AI TTS setup error:', error);
      // Fallback to browser TTS
      speakWithBrowserTTS(text, "hi-IN");
    }
  };

  const speakWithBrowserTTS = (text, language) => {
    if (!('speechSynthesis' in window)) {
      console.log('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Wait for voices to be loaded before setting voice
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      let preferredVoice = null;
      
      if (language.includes("en")) {
        // Try to find English voices
        preferredVoice = voices.find(voice => 
          voice.lang.includes("en-US") || voice.lang.includes("en-GB") || voice.lang.includes("en")
        );
      } else if (language.includes("hi")) {
        // Try to find Hindi voices
        preferredVoice = voices.find(voice => 
          voice.lang.includes("hi-IN") || voice.lang.includes("hi")
        );
      }
      
      // If no preferred voice found, try to find any voice that matches the language family
      if (!preferredVoice) {
        if (language.includes("en")) {
          preferredVoice = voices.find(voice => voice.lang.includes("en"));
        } else {
          preferredVoice = voices.find(voice => 
            voice.lang.includes("hi") || voice.lang.includes("en")
          );
        }
      }
      
      // If still no voice found, use the default voice
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log(`Using browser voice: ${preferredVoice.name} (${preferredVoice.lang})`);
      } else {
        console.log(`No suitable browser voice found for language: ${language}, using default`);
      }
      
      window.speechSynthesis.speak(utterance);
    };

    // Load voices if not already loaded
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
    
    utterance.onerror = (event) => {
      console.error('Browser TTS error:', event.error);
    };
  };

  // Initialize voices on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices immediately
      window.speechSynthesis.getVoices();
      
      // Also set up voice change handler
      const handleVoiceChange = () => {
        window.speechSynthesis.getVoices();
      };
      
      window.speechSynthesis.onvoiceschanged = handleVoiceChange;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // Speak initial greeting when language changes
  useEffect(() => {
    if (ttsEnabled) {
      const greeting = t("veda_greeting");
      console.log(`Triggering TTS for greeting in ${lang}: "${greeting.substring(0, 50)}..."`);
      setTimeout(() => speakText(greeting), 1500);
    }
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const API_KEY = "AIzaSyBghJm-8kQw7u6omcPM6cTVfVC1AnlceQ0";
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: newMessages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }],
          })),
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1000,
          },
          systemInstruction: {
            parts: [{ text: `You are VEDA, a friendly AI plant assistant. You help farmers and gardeners with plant diseases, care tips, fertilizer recommendations, and plant health. Be warm, concise, and practical. Always respond in the same language as the user's message. Supported languages: English, Hindi (हिंदी), Garhwali (गढ़वाली). Current language preference: ${lang}. When giving advice, use bullet points when appropriate. Keep responses under 200 words.` }],
          },
        }),
      });
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond. Please try again.";
      setMessages((prev) => [...prev, { role: "veda", text: reply }]);
      
      // Text-to-speech for VEDA's response with better timing
      if (ttsEnabled) {
        // Wait a bit longer for the message to be rendered
        setTimeout(() => {
          console.log(`Triggering TTS for AI response: "${reply.substring(0, 50)}..."`);
          speakText(reply);
        }, 1000);
      }
    } catch (error) {
      const errorMessage = "Connection error. Please check your internet and try again.";
      setMessages((prev) => [...prev, { role: "veda", text: errorMessage }]);
      
      // Speak error message if TTS is enabled
      if (ttsEnabled) {
        setTimeout(() => {
          console.log(`Triggering TTS for error message: "${errorMessage}"`);
          speakText(errorMessage);
        }, 500);
      }
    }
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = await new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (ev) => res(ev.target.result);
      reader.readAsDataURL(file);
    });
    const base64 = preview.split(",")[1];

    setMessages((prev) => [...prev, { role: "user", text: "🖼️ [Plant image uploaded]", image: preview }]);
    setLoading(true);

    try {
      const API_KEY = "AIzaSyBghJm-8kQw7u6omcPM6cTVfVC1AnlceQ0";
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: "Please analyze this plant image and tell me if there are any diseases or issues." },
                { inlineData: { mimeType: file.type, data: base64 } },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: `You are VEDA, a plant disease detection AI assistant. Analyze the plant image and provide a friendly, helpful diagnosis with care recommendations. Respond in the language preference: ${lang}.` }],
          },
        }),
      });
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't analyze the image. Please try again.";
      setMessages((prev) => [...prev, { role: "veda", text: reply }]);
      
      // Text-to-speech for VEDA's response with better timing
      if (ttsEnabled) {
        // Wait a bit longer for the message to be rendered
        setTimeout(() => {
          console.log(`Triggering TTS for image analysis response: "${reply.substring(0, 50)}..."`);
          speakText(reply);
        }, 1000);
      }
    } catch (error) {
      const errorMessage = "Failed to analyze image.";
      setMessages((prev) => [...prev, { role: "veda", text: errorMessage }]);
      
      // Speak error message if TTS is enabled
      if (ttsEnabled) {
        setTimeout(() => {
          console.log(`Triggering TTS for image error message: "${errorMessage}"`);
          speakText(errorMessage);
        }, 500);
      }
    }
    setLoading(false);
  };

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input not supported in this browser. Try Chrome.");
      return;
    }
    
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    
    // Set language based on current selection
    if (lang === "en") {
      recog.lang = "en-US";
    } else if (lang === "hi") {
      recog.lang = "hi-IN";
    }
    
    recog.onstart = () => {
      setListening(true);
    };
    
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      
      // Auto-send message after voice input
      setTimeout(() => {
        if (transcript.trim()) {
          sendMessage(transcript);
        }
      }, 500);
    };
    
    recog.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
      
      // Show user-friendly error messages
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access.');
      } else if (event.error === 'network') {
        alert('Network error. Please check your internet connection.');
      } else {
        alert('Voice recognition error. Please try again.');
      }
    };
    
    recog.onend = () => {
      setListening(false);
    };
    
    recogRef.current = recog;
    
    try {
      recog.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setListening(false);
    }
  };

  const chips = [
    { label: t("chip_tomato"), emoji: "🍅" },
    { label: t("chip_wheat"), emoji: "🌾" },
    { label: t("chip_care"), emoji: "🌱" },
    { label: t("chip_fertilizer"), emoji: "🧪" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 flex flex-col" style={{ fontFamily: "'Inter', 'Sora', sans-serif" }}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-violet-600 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-20 -left-20 w-32 h-32 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <Navbar />

      {/* Chat container */}
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto pt-28 pb-0 px-6 overflow-hidden">
        {/* Chat header card */}
        <div className="rounded-t-3xl bg-white/5 backdrop-blur-2xl border border-white/10 border-b-0 px-8 py-8 flex items-center justify-between mt-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <VEDA_AVATAR size="lg" />
            <div>
              <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 bg-gradient-to-r text-3xl font-black tracking-tight">VEDA</h2>
              <p className="text-violet-300 text-sm flex items-center gap-3 font-medium">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse shadow-lg shadow-green-400/50"></span>
                {t("chat_online")}
              </p>
            </div>
          </div>

          {/* TTS toggle and Lang switcher */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`group relative px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-500 transform hover:scale-105 ${
                ttsEnabled
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-2xl shadow-violet-500/30 hover:shadow-3xl hover:shadow-violet-600/40"
                  : "bg-white/10 backdrop-blur-sm border border-white/20 text-violet-600 hover:bg-white/20 hover:border-violet-500/40 hover:text-violet-700"
              }`}
              title={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
            >
              <span className="relative z-10 text-2xl transition-transform duration-300 group-hover:rotate-12">{ttsEnabled ? "🔊" : "🔇"}</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </button>
            {LANGS_CHAT.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`group relative px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-500 transform hover:scale-105 ${
                  lang === l.code
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-2xl shadow-violet-500/30 hover:shadow-3xl hover:shadow-violet-600/40"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-violet-600 hover:bg-white/20 hover:border-violet-500/40 hover:text-violet-700"
                }`}
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{l.label}</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white/5 backdrop-blur-sm border-x border-white/10 px-6 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3 items-end mb-4`}>
              {msg.role === "veda" && <VEDA_AVATAR />}
              <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                {msg.image && (
                  <img src={msg.image} alt="uploaded" className="rounded-2xl max-h-48 object-cover border border-white/20 shadow-xl" />
                )}
                <div
                  className={`relative px-6 py-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap transition-all duration-500 transform hover:scale-105 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-br-2xl shadow-lg shadow-emerald-600/20"
                      : "bg-white/90 text-slate-800 rounded-bl-2xl border border-white/20 shadow-xl backdrop-blur-sm hover:shadow-2xl hover:shadow-violet-500/10"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start gap-3 items-end mb-4">
              <VEDA_AVATAR />
              <div className="bg-white/90 rounded-2xl rounded-bl-2xl border border-white/20 shadow-xl backdrop-blur-sm px-6 py-4">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 animate-bounce shadow-lg" style={{ animationDelay: `${i * 0.15}s` }}></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick chips */}
        <div className="bg-white/5 backdrop-blur-sm border-x border-white/10 px-6 pt-4 pb-6 flex gap-3 overflow-x-auto">
          {chips.map((c, index) => (
            <button
              key={c.label}
              onClick={() => sendMessage(c.label)}
              className="group relative whitespace-nowrap text-sm px-5 py-3 rounded-2xl border border-white/20 bg-white/10 text-violet-600 hover:bg-gradient-to-br hover:from-violet-500 hover:to-purple-600 hover:text-white transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20 flex items-center gap-3 flex-shrink-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              <span className="relative z-10 text-lg transition-transform duration-300 group-hover:scale-110">{c.emoji}</span>
              <span className="relative z-10 font-semibold transition-colors duration-300 group-hover:text-white">{c.label}</span>
            </button>
          ))}
        </div>

        {/* Upload image strip */}
        <div className="bg-white/5 backdrop-blur-sm border-x border-white/10 px-6 pb-6">
          <button
            onClick={() => fileRef.current.click()}
            className="group relative w-full flex items-center justify-center gap-4 py-4 rounded-2xl border-2 border-dashed border-white/30 bg-white/10 text-violet-600 hover:bg-gradient-to-br hover:from-violet-500 hover:to-purple-600 hover:text-white transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🌿</div>
              <span className="font-semibold text-lg transition-colors duration-300 group-hover:text-white">{t("chat_upload")}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Upload image strip */}
      <div className="bg-white/5 backdrop-blur-sm border-x border-white/10 px-6 pb-6">
        <button
          onClick={() => fileRef.current.click()}
          className="group relative w-full flex items-center justify-center gap-4 py-4 rounded-2xl border-2 border-dashed border-white/30 bg-white/10 text-violet-600 hover:bg-gradient-to-br hover:from-violet-500 hover:to-purple-600 hover:text-white transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="text-4xl mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🌿</div>
            <span className="font-semibold text-lg transition-colors duration-300 group-hover:text-white">{t("chat_upload")}</span>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Input bar */}
      <div className="rounded-b-3xl bg-white/10 backdrop-blur-xl border border-white/10 border-t-0 px-6 py-6 flex gap-4 items-center shadow-2xl">
        <button
          onClick={toggleVoice}
          className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 transform hover:scale-105 ${
            listening
              ? "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl shadow-red-600/30 animate-pulse"
              : "bg-white/10 border border-white/20 text-violet-600 hover:bg-gradient-to-br hover:from-violet-500 hover:to-purple-600 hover:text-white"
          }`}
          title={listening ? "Stop recording" : "Voice input (Click to speak)"}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          <span className="relative z-10 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">{listening ? "🔴" : "🎤"}</span>
        </button>

        <div className="flex-1 relative">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
            placeholder={listening ? t("voice_listening") : t("chat_placeholder")}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-sm text-white placeholder-white/50 outline-none focus:border-violet-500 focus:bg-white/30 focus:ring-2 focus:ring-violet-500/20 transition-all duration-500"
          />

          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={`absolute right-3 top-1/2 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center text-white flex-shrink-0 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20 disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100 ${
              isTyping ? 'ring-2 ring-violet-500 ring-offset-2' : ''
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5v14l-3.86-3.86a2 2 0 012-2 012-2s0 2 2v14a2 2 0 01-2 01-2 012-2s0 2 2l-2.59 2.59-6.41 0 01-2 01-2 012-2s0 2 2l7 7 7 7 7 7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);
  );
}
