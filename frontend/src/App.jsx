import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import DiseaseDetection from "./components/DiseaseDetection";
import Retraining from "./components/Retraining";
import Visualizations from "./components/Visualizations";

const API_URL = "https://paulette12344545-agri-predict-api.hf.space";

export default function App() {
  const [uptime, setUptime]     = useState("Connecting...");
  const [isOnline, setIsOnline] = useState(null);
  const [activeTab, setActiveTab] = useState("detection");

  useEffect(() => {
    const check = () => {
      axios.get(`${API_URL}/`)
        .then(r  => { setUptime(r.data.uptime); setIsOnline(true);  })
        .catch(() => { setUptime("Offline");       setIsOnline(false); });
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="page-bg" style={{ fontFamily: "'Tahoma', 'MS Sans Serif', Arial, sans-serif" }}>

      {/* Desktop taskbar header */}
      <Header uptime={uptime} isOnline={isOnline} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main window body */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 8px 24px" }}>
        <div className="win-window" style={{ padding: 0, overflow: "hidden" }}>

          {/* Window title bar */}
          <div className="win-titlebar">
            {/* Leaf icon — tiny SVG */}
            <svg className="win-titlebar-icon" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#008000"/>
              <path d="M8 12C8 12 4 9 4 6C4 3 6 2 8 2C10 2 12 3 12 6C12 9 8 12 8 12Z" fill="#00c000"/>
              <line x1="8" y1="12" x2="8" y2="7" stroke="#004000" strokeWidth="0.8"/>
            </svg>
            <span>Agri-Predict — AI-Powered Cassava Disease Detection System</span>
            <div className="win-titlebar-buttons">
              <div className="win-btn-chrome">─</div>
              <div className="win-btn-chrome">□</div>
              <div className="win-btn-chrome close">✕</div>
            </div>
          </div>

          {/* Menu bar */}
          <div className="win-toolbar" style={{ borderBottom: "1px solid #808080" }}>
            {["File", "Edit", "View", "Tools", "Model", "Help"].map(m => (
              <button key={m} className="win-tab" style={{
                background: "var(--win-bg)",
                border: "none",
                borderBottom: "none",
                padding: "2px 8px",
                fontSize: 11,
                cursor: "default",
              }}>
                {m}
              </button>
            ))}
          </div>

          {/* Toolbar row */}
          <div className="win-toolbar">
            <button className="win-btn" style={{ padding: "2px 8px", fontSize: 11 }}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>⟵</span> Back
            </button>
            <button className="win-btn" style={{ padding: "2px 8px", fontSize: 11 }}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>⟶</span> Forward
            </button>
            <div style={{ width: 1, height: 20, background: "#808080", margin: "0 4px" }} />
            <button className="win-btn" style={{ padding: "2px 8px", fontSize: 11 }}>⟳ Refresh</button>
            <button className="win-btn" style={{ padding: "2px 8px", fontSize: 11 }}>🏠 Home</button>
            <div style={{ width: 1, height: 20, background: "#808080", margin: "0 4px" }} />
            <div className="win-inset" style={{ flex: 1, display: "flex", alignItems: "center", padding: "1px 6px", fontSize: 11, background: "white" }}>
              <span style={{ color: "#808080", marginRight: 4 }}>Address:</span>
              <span style={{ color: "#000080" }}>https://agri-predict.ai/app</span>
            </div>
            <button className="win-btn" style={{ padding: "2px 10px", fontSize: 11, fontWeight: "bold" }}>Go</button>
          </div>

          {/* Stats ribbon */}
          <div style={{
            background: "#000080",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 12px",
            fontSize: 11,
            gap: 12,
          }}>
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { val: "86.73%", lbl: "Accuracy" },
                { val: "21,397", lbl: "Training Images" },
                { val: "5",      lbl: "Disease Classes" },
                { val: "0.868",  lbl: "F1-Score" },
              ].map(({ val, lbl }) => (
                <span key={lbl} style={{ display: "flex", gap: 4, alignItems: "baseline" }}>
                  <strong style={{ fontSize: 13 }}>{val}</strong>
                  <span style={{ opacity: 0.75 }}>{lbl}</span>
                </span>
              ))}
            </div>
            {/* Status indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: isOnline === true ? "#00ff00" : isOnline === false ? "#ff4444" : "#ffff00",
                border: "1px solid rgba(0,0,0,0.4)",
                boxShadow: isOnline === true ? "0 0 4px #00ff00" : "none",
              }} />
              <span>
                {isOnline === true ? `API Live · ${uptime}` : isOnline === false ? "API Offline" : "Connecting…"}
              </span>
            </div>
          </div>

          {/* Tab row */}
          <div style={{
            background: "var(--win-bg)",
            padding: "6px 12px 0",
            borderBottom: "2px solid var(--win-border-dark)",
            display: "flex",
            gap: 0,
          }}>
            {[
              { id: "detection",  label: "Disease Detection", icon: "🔬" },
              { id: "retraining", label: "Retrain Model",      icon: "🔄" },
              { id: "insights",   label: "Data Insights",      icon: "📊" },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`win-tab${activeTab === id ? " active" : ""}`}
                style={{ userSelect: "none" }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Page body */}
          <div style={{ padding: 12, background: "var(--win-bg)", minHeight: 400 }}>
            <div className="fade-in" key={activeTab}>
              {activeTab === "detection"  && <DiseaseDetection apiUrl={API_URL} />}
              {activeTab === "retraining" && <Retraining apiUrl={API_URL} />}
              {activeTab === "insights"   && <Visualizations />}
            </div>
          </div>

          {/* Status bar */}
          <div className="win-statusbar">
            <div className="win-status-pane">
              {isOnline === true ? "✓ API Connected" : isOnline === false ? "✗ API Offline" : "● Connecting…"}
            </div>
            <div className="win-status-pane">EfficientNetB4 · ImageNet Pretrained</div>
            <div className="win-status-pane" style={{ marginLeft: "auto" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
