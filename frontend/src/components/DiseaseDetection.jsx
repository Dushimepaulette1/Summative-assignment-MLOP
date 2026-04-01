import { useState, useRef } from "react";
import axios from "axios";

const CLASSES = [
  { key: "Cassava Bacterial Blight (CBB)",       short: "CBB",  desc: "Angular water-soaked lesions turning brown. Remove infected plants and avoid overhead irrigation." },
  { key: "Cassava Brown Streak Disease (CBSD)",  short: "CBSD", desc: "Brown streaks on stems and tuber necrosis. Use certified disease-free planting material." },
  { key: "Cassava Green Mottle (CGM)",            short: "CGM",  desc: "Mosaic green mottle on leaves. Control whitefly vectors and rogue infected plants." },
  { key: "Cassava Mosaic Disease (CMD)",          short: "CMD",  desc: "Mosaic yellowing and leaf distortion. Most common. Use resistant varieties such as NASE 14." },
  { key: "Healthy",                               short: "HLT",  desc: "No disease detected. Your plant looks healthy. Maintain good agronomic practices." },
];
const classMap = Object.fromEntries(CLASSES.map(c => [c.key, c]));

export default function DiseaseDetection({ apiUrl }) {
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag]       = useState(false);
  const inputRef              = useRef(null);

  const processFile = (f) => {
    if (!f?.type.startsWith("image/")) return alert("Please select an image file.");
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };
  const clear = () => {
    setFile(null); setPreview(null); setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };
  const predict = async () => {
    setLoading(true); setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await axios.post(`${apiUrl}/predict`, fd);
      setResult(r.data);
    } catch {
      setResult({ error: "Could not reach the backend. Make sure the API is running." });
    }
    setLoading(false);
  };

  const top   = result && !result.error ? classMap[result.prediction] : null;
  const probs = result?.all_probabilities
    ? Object.entries(result.all_probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Section heading */}
      <div style={{
        background: "#000080", color: "white",
        padding: "3px 8px", fontSize: 11, fontWeight: "bold",
        borderLeft: "3px solid #4080ff"
      }}>
        🔬 Leaf Disease Analysis — Upload a cassava leaf photo to get an instant AI diagnosis.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>

        {/* ── Upload panel ─────────────────────────────────────── */}
        <div className="win-window" style={{ overflow: "hidden" }}>
          <div className="win-titlebar" style={{ fontSize: 11 }}>
            <span>📷</span> Upload Leaf Image
            <div className="win-titlebar-buttons">
              <div className="win-btn-chrome">?</div>
            </div>
          </div>
          <div style={{ padding: 8 }}>

            <input type="file" ref={inputRef} onChange={e => processFile(e.target.files?.[0])} accept="image/*" className="hidden" />

            {!preview ? (
              <div
                className={`win-dropzone${drag ? " drag" : ""}`}
                onDragOver={e => { e.preventDefault(); setDrag(true);  }}
                onDragLeave={e => { e.preventDefault(); setDrag(false); }}
                onDrop={e => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files?.[0]); }}
                onClick={() => inputRef.current.click()}
                style={{ cursor: "default", minHeight: 180 }}
              >
                <div style={{ fontSize: 40, marginBottom: 8, userSelect: "none" }}>🌿</div>
                <p style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4, color: "#000080" }}>
                  {drag ? "Release to upload image" : "Drag & drop your cassava leaf photo here"}
                </p>
                <p style={{ fontSize: 11, color: "#808080", marginBottom: 12 }}>
                  — or —
                </p>
                <button className="win-btn primary" onClick={e => { e.stopPropagation(); inputRef.current.click(); }}>
                  Browse…
                </button>
                <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
                  {["Well-lit photo", "Single leaf", "Full leaf in frame"].map(tip => (
                    <div key={tip} className="win-inset" style={{ padding: "2px 8px", fontSize: 10, background: "#ffffc0" }}>
                      💡 {tip}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="win-inset" style={{ position: "relative" }}>
                  <img
                    src={preview}
                    alt="Leaf preview"
                    crossOrigin="anonymous"
                    style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                  />
                </div>
                <div style={{ fontSize: 10, color: "#808080", borderTop: "1px solid #d4d0c8", paddingTop: 3 }}>
                  📄 {file?.name}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="win-btn primary"
                    onClick={predict}
                    disabled={loading}
                    style={{ flex: 1, justifyContent: "center", fontSize: 11 }}
                  >
                    {loading
                      ? <><span className="spin" style={{ display: "inline-block", width: 10, height: 10, border: "2px solid #808080", borderTopColor: "#000", borderRadius: "50%" }} /> Analyzing…</>
                      : "🔬 Analyze for Disease"
                    }
                  </button>
                  <button className="win-btn" onClick={clear} style={{ fontSize: 11 }}>
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Results panel ────────────────────────────────────── */}
        <div className="win-window" style={{ overflow: "hidden" }}>
          <div className="win-titlebar" style={{ fontSize: 11 }}>
            <span>📋</span> Diagnosis Results
            <div className="win-titlebar-buttons">
              <div className="win-btn-chrome">?</div>
            </div>
          </div>
          <div style={{ padding: 8, minHeight: 280 }}>

            {/* Empty state */}
            {!result && !loading && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#808080" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🌱</div>
                <p style={{ fontSize: 12, fontWeight: "bold", color: "#808080" }}>No analysis yet</p>
                <p style={{ fontSize: 11 }}>Upload a leaf image to begin diagnosis</p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 11, marginBottom: 8, color: "#000080", fontWeight: "bold" }}>Running AI Analysis…</div>
                <div style={{ margin: "0 auto 8px", width: "80%" }}>
                  <div className="win-progress-track">
                    <div className="win-progress-fill" style={{ width: "60%" }} />
                  </div>
                </div>
                <p style={{ fontSize: 10, color: "#808080" }}>EfficientNetB4 processing…</p>
              </div>
            )}

            {/* Error */}
            {result?.error && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: 8 }}>
                <span style={{ fontSize: 24 }}>⚠️</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: "bold", color: "#800000" }}>Analysis Failed</p>
                  <p style={{ fontSize: 11, marginTop: 4 }}>{result.error}</p>
                </div>
              </div>
            )}

            {/* Success */}
            {result && !result.error && top && (
              <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 6 }}>

                {/* Top result */}
                <fieldset className="win-groupbox">
                  <legend>{top.key === "Healthy" ? "Plant Status" : "⚠ Disease Detected"}</legend>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: "bold", color: "#000080" }}>{top.key}</p>
                      <p style={{ fontSize: 10, marginTop: 4, lineHeight: 1.4, color: "#404040" }}>{top.desc}</p>
                    </div>
                    <div className="win-inset" style={{
                      textAlign: "center", padding: "6px 12px", background: "#000080", color: "white", flexShrink: 0
                    }}>
                      <p style={{ fontSize: 18, fontWeight: "bold" }}>{result.confidence.toFixed(1)}%</p>
                      <p style={{ fontSize: 9, marginTop: 2 }}>CONFIDENCE</p>
                    </div>
                  </div>
                </fieldset>

                {/* All probabilities */}
                <fieldset className="win-groupbox">
                  <legend>All Disease Probabilities</legend>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {probs.map(([name, pct]) => {
                      const isTop = name === result.prediction;
                      return (
                        <div key={name} style={{
                          background: isTop ? "#000080" : "transparent",
                          color: isTop ? "white" : "inherit",
                          padding: "2px 4px",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                            <span style={{ fontSize: 10, fontWeight: isTop ? "bold" : "normal" }}>{name}</span>
                            <span style={{ fontSize: 10, fontWeight: "bold", fontFamily: "monospace" }}>{pct.toFixed(1)}%</span>
                          </div>
                          <div className="win-progress-track" style={{ height: 10 }}>
                            <div
                              className="bar-fill"
                              style={{
                                height: "100%",
                                width: `${Math.max(pct, 0.3)}%`,
                                background: isTop
                                  ? "repeating-linear-gradient(90deg, #00c0ff 0px, #00c0ff 8px, #0080c0 8px, #0080c0 10px)"
                                  : "repeating-linear-gradient(90deg, #808080 0px, #808080 8px, #606060 8px, #606060 10px)"
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Advice */}
                {top.key !== "Healthy" && (
                  <div style={{
                    background: "#ffffc0",
                    border: "1px solid #808000",
                    padding: "4px 8px",
                    fontSize: 10,
                    display: "flex",
                    gap: 6,
                    alignItems: "flex-start"
                  }}>
                    <span>💡</span>
                    <span><strong>Recommended Action:</strong> Contact your local agricultural extension officer. Isolate affected plants immediately to prevent spread.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model metrics strip */}
      <div className="win-window" style={{ padding: 0, overflow: "hidden" }}>
        <div className="win-titlebar" style={{ fontSize: 11 }}>📊 Model Performance Metrics</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {[
            { label: "Validation Accuracy", value: "86.73%",        sub: "4,280 held-out images"          },
            { label: "Weighted F1-Score",   value: "0.868",          sub: "Harmonic mean, 5 classes"       },
            { label: "Training Images",     value: "17,117",         sub: "Stratified 80/20 split"         },
            { label: "Architecture",        value: "EfficientNetB4", sub: "ImageNet pretrained + fine-tuned"},
          ].map(({ label, value, sub }, i) => (
            <div key={label} style={{
              padding: "6px 12px",
              borderRight: i < 3 ? "1px solid #808080" : "none",
              textAlign: "center",
              background: "var(--win-bg)",
            }}>
              <p style={{ fontSize: 15, fontWeight: "bold", color: "#000080" }}>{value}</p>
              <p style={{ fontSize: 10, fontWeight: "bold", marginTop: 2 }}>{label}</p>
              <p style={{ fontSize: 9, color: "#808080" }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
