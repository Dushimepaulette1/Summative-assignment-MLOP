import { Leaf, UploadCloud, RefreshCw, BarChart3, Wifi, WifiOff, Cpu } from "lucide-react";

const TABS = [
  { id: "detection",  label: "Disease Detection", icon: UploadCloud },
  { id: "retraining", label: "Retrain Model",      icon: RefreshCw   },
  { id: "insights",   label: "Data Insights",      icon: BarChart3   },
];

export default function Header({ uptime, isOnline, activeTab, setActiveTab }) {
  return (
    <header className="hero-bg text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top bar */}
        <div className="flex items-center justify-between py-5 border-b border-white/10">
          {/* Brand */}
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center ring-2 ring-white/25 shadow-lg shadow-black/20">
              <Leaf className="w-9 h-9 text-green-300" />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#14532d]" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight leading-none">Agri-Predict</h1>
              <p className="text-green-300 text-sm font-semibold mt-1 tracking-wide">AI-Powered Cassava Disease Detection</p>
            </div>
          </div>

          {/* Status pill */}
          <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold border backdrop-blur ${
            isOnline === true  ? "bg-green-500/20 border-green-400/30 text-green-200"  :
            isOnline === false ? "bg-red-500/20 border-red-400/30 text-red-200"        :
                                 "bg-white/10 border-white/20 text-white/70"
          }`}>
            {isOnline === true  ? <><span className="w-2.5 h-2.5 bg-green-400 rounded-full pulse-dot" /><Wifi className="w-4 h-4" /><span>Live · {uptime}</span></> :
             isOnline === false ? <><span className="w-2.5 h-2.5 bg-red-400 rounded-full" /><WifiOff className="w-4 h-4" /><span>Backend Offline</span></> :
                                  <><span className="w-2.5 h-2.5 bg-white/40 rounded-full pulse-dot" /><Cpu className="w-4 h-4" /><span>Connecting…</span></>}
          </div>
        </div>

        {/* Hero copy */}
        <div className="py-8">
          <p className="text-green-200 text-sm font-semibold uppercase tracking-widest mb-3">
            Machine Learning Operations Pipeline
          </p>
          <h2 className="text-4xl font-black leading-tight max-w-2xl mb-4">
            Detect Cassava Diseases<br />
            <span className="text-green-300">Instantly with AI</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
            Upload a photo of your cassava leaf and our EfficientNetB4 model —
            trained on 21,397 images — will identify any of 5 diseases in seconds,
            helping you protect your harvest.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { val: "86.73%", lbl: "Accuracy" },
              { val: "21,397", lbl: "Training Images" },
              { val: "5",      lbl: "Disease Classes" },
              { val: "0.868",  lbl: "F1-Score" },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center">
                <p className="text-2xl font-black text-white">{val}</p>
                <p className="text-green-300 text-xs font-semibold uppercase tracking-wide">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab nav */}
        <nav className="flex gap-2 pb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === id
                  ? "bg-white/15 text-white ring-1 ring-white/30"
                  : "text-white/50 hover:text-white/80 hover:bg-white/8"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
