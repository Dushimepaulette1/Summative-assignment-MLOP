import { useState, useRef } from "react";
import axios from "axios";

const STEPS = [
  { n: "01", icon: "📁", title: "Select Images",  desc: "Drag & drop or click Browse to add multiple cassava leaf photos." },
  { n: "02", icon: "💾", title: "Data Saved",     desc: "Images are stored in the database and logged for traceability."  },
  { n: "03", icon: "⚡", title: "Model Retrains", desc: "The pipeline fine-tunes the model in the background."            },
];

export default function Retraining({ apiUrl }) {
  const [files, setFiles]   = useState([]);
  const [drag, setDrag]     = useState(false);
  const [phase, setPhase]   = useState(null);
  const [msg, setMsg]       = useState("");
  const inputRef            = useRef(null);

  const addFiles = (incoming) => {
    const imgs = Array.from(incoming).filter(f => f.type.startsWith("image/"));
    if (imgs.length) setFiles(p => [...p, ...imgs]);
  };
  const remove = (i) => setFiles(p => p.filter((_, j) => j !== i));
  const reset  = () => { setFiles([]); setPhase(null); setMsg(""); };

  const handleRetrain = async () => {
    if (!files.length) return;
    setPhase("uploading");
    setMsg(`Uploading ${files.length} image${files.length > 1 ? "s" : ""}…`);
    const fd = new FormData();
    files.forEach(f => fd.append("files", f));
    try {
      await axios.post(`${apiUrl}/upload_retrain_data`, fd);
      setPhase("retraining");
      setMsg("Files saved. Triggering retraining pipeline…");
      await axios.post(`${apiUrl}/trigger_retrain`);
      setPhase("success");
      setMsg(`${files.length} image${files.length > 1 ? "s" : ""} uploaded. Retraining is running in the background.`);
      setFiles([]);
    } catch {
      setPhase("error");
      setMsg("Something went wrong. Make sure the backend is running and try again.");
    }
  };

  const busy = phase === "uploading" || phase === "retraining";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Section heading */}
      <div style={{
        background: "#000080", color: "white",
        padding: "3px 8px", fontSize: 11, fontWeight: "bold",
        borderLeft: "3px solid #4080ff"
      }}>
        🔄 Retrain the Model — Upload new field images to continuously improve detection accuracy.
      </div>

      {/* Steps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {STEPS.map(({ n, icon, title, desc }) => (
          <div key={n} className="win-window" style={{ padding: 0, overflow: "hidden" }}>
            <div className="win-titlebar" style={{ fontSize: 11 }}>
              {icon} Step {n} — {title}
            </div>
            <div style={{ padding: "6px 10px", fontSize: 10, lineHeight: 1.5, color: "#404040" }}>
              {desc}
            </div>
          </div>
        ))}
      </div>

      {/* Upload window */}
      <div className="win-window" style={{ overflow: "hidden" }}>
        <div className="win-titlebar" style={{ fontSize: 11 }}>
          📂 Upload Training Images
          <div className="win-titlebar-buttons">
            <div className="win-btn-chrome">?</div>
          </div>
        </div>
        <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Drop zone */}
          <div
            className={`win-dropzone${drag ? " drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true);  }}
            onDragLeave={e => { e.preventDefault(); setDrag(false); }}
            onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current.click()}
            style={{ minHeight: 120 }}
          >
            <input type="file" ref={inputRef} onChange={e => addFiles(e.target.files)} accept="image/*" multiple className="hidden" />
            <div style={{ fontSize: 32, marginBottom: 6, userSelect: "none" }}>📁</div>
            <p style={{ fontSize: 11, fontWeight: "bold", marginBottom: 4, color: "#000080" }}>
              {drag ? "Release to add images" : "Drag & drop multiple images here"}
            </p>
            <p style={{ fontSize: 10, color: "#808080", marginBottom: 8 }}>— or —</p>
            <button
              className="win-btn primary"
              onClick={e => { e.stopPropagation(); inputRef.current.click(); }}
            >
              Browse…
            </button>
            <p style={{ fontSize: 10, color: "#808080", marginTop: 6 }}>JPG, PNG supported</p>
          </div>

          {/* File preview */}
          {files.length > 0 && (
            <fieldset className="win-groupbox">
              <legend>{files.length} image{files.length > 1 ? "s" : ""} selected</legend>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                <button className="win-btn" onClick={reset} style={{ fontSize: 10 }}>Remove All</button>
              </div>
              <div className="win-inset" style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
                gap: 4,
                padding: 4,
                maxHeight: 180,
                overflowY: "auto",
                background: "white",
              }}>
                {files.map((f, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block", border: "1px solid #808080" }}
                    />
                    <button
                      onClick={e => { e.stopPropagation(); remove(i); }}
                      className="win-btn"
                      style={{
                        position: "absolute", top: 0, right: 0,
                        padding: "0 3px", fontSize: 9, lineHeight: 1.4,
                        background: "#c0c0c0", border: "1px solid #808080"
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* Trigger button */}
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className="win-btn primary"
              onClick={handleRetrain}
              disabled={!files.length || busy}
              style={{ flex: 1, justifyContent: "center", fontSize: 11 }}
            >
              {busy
                ? <><span className="spin" style={{ display: "inline-block", width: 10, height: 10, border: "2px solid #808080", borderTopColor: "#000", borderRadius: "50%" }} />
                    {phase === "uploading" ? " Uploading images…" : " Starting retraining…"}
                  </>
                : "🔄 Upload & Trigger Retraining"
              }
            </button>
            <button className="win-btn" onClick={reset} disabled={busy} style={{ fontSize: 11 }}>Reset</button>
          </div>

          {/* Progress bar when busy */}
          {busy && (
            <div>
              <p style={{ fontSize: 10, color: "#000080", marginBottom: 3 }}>{msg}</p>
              <div className="win-progress-track">
                <div className="win-progress-fill" style={{ width: phase === "retraining" ? "80%" : "40%" }} />
              </div>
            </div>
          )}

          {/* Status message */}
          {phase && !busy && (
            <div className="fade-in" style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "6px 8px",
              background: phase === "success" ? "#e0ffe0" : "#ffe0e0",
              border: `1px solid ${phase === "success" ? "#008000" : "#800000"}`,
              fontSize: 11,
            }}>
              <span>{phase === "success" ? "✅" : "❌"}</span>
              <div>
                <p style={{ fontWeight: "bold", color: phase === "success" ? "#004000" : "#800000" }}>
                  {phase === "success" ? "Retraining Started Successfully" : "Error Occurred"}
                </p>
                <p style={{ marginTop: 2, color: "#404040" }}>{msg}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
