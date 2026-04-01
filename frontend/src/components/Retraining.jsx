import { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, X, CheckCircle, AlertTriangle, RefreshCw, Database, Zap } from "lucide-react";

const STEPS = [
  { n: "01", icon: UploadCloud, title: "Select Images",  desc: "Drag & drop or click to add multiple cassava leaf photos from your device."   },
  { n: "02", icon: Database,    title: "Data Saved",     desc: "Images are stored in the database and logged for traceability."               },
  { n: "03", icon: Zap,         title: "Model Retrains", desc: "The pipeline fine-tunes the model in the background — no waiting required."   },
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
    <div className="space-y-6">

      <div>
        <h2 className="text-3xl font-black text-white">Retrain the Model</h2>
        <p className="text-white/60 text-lg mt-1">Upload new field images to continuously improve detection accuracy.</p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map(({ n, icon: Icon, title, desc }) => (
          <div key={n} className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-6 text-white">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Step {n}</p>
            <p className="text-base font-bold mb-2">{title}</p>
            <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Upload card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Upload Training Images</h3>
          <p className="text-slate-400 text-sm mt-0.5">Multiple files supported</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true);  }}
            onDragLeave={e => { e.preventDefault(); setDrag(false); }}
            onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
              drag ? "border-slate-400 bg-slate-50" : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
            }`}
          >
            <input type="file" ref={inputRef} onChange={e => addFiles(e.target.files)} accept="image/*" multiple className="hidden" />
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
              <UploadCloud className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-700 mb-2">
              {drag ? "Drop images here" : "Drag & drop multiple images"}
            </p>
            <p className="text-slate-400 text-base">
              or <span className="text-slate-700 font-semibold underline underline-offset-2">click to select files</span>
            </p>
            <p className="text-slate-300 text-sm mt-2">JPG, PNG supported — multiple files allowed</p>
          </div>

          {/* File preview grid */}
          {files.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-slate-700">
                  {files.length} image{files.length > 1 ? "s" : ""} selected
                </p>
                <button onClick={reset} className="text-sm text-slate-400 hover:text-red-500 font-semibold transition">Clear all</button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-52 overflow-y-auto pr-1">
                {files.map((f, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                    <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition" />
                    <button
                      onClick={e => { e.stopPropagation(); remove(i); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-slate-500 opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trigger button */}
          <button
            onClick={handleRetrain}
            disabled={!files.length || busy}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-base font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
          >
            {busy
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />{phase === "uploading" ? "Uploading images…" : "Starting retraining…"}</>
              : <><RefreshCw className="w-4 h-4" />Upload & Trigger Retraining</>
            }
          </button>

          {/* Status message */}
          {phase && (
            <div className={`flex items-start gap-3 p-5 rounded-2xl border fade-in ${
              phase === "success" ? "bg-slate-50 border-slate-200" :
              phase === "error"   ? "bg-red-50 border-red-200"     :
                                    "bg-slate-50 border-slate-200"
            }`}>
              {phase === "success" && <CheckCircle  className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />}
              {phase === "error"   && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5"  />}
              {busy                && <span className="w-5 h-5 border-2 border-slate-200 border-t-slate-600 rounded-full spin shrink-0 mt-0.5" />}
              <div>
                <p className={`font-bold text-sm ${phase === "error" ? "text-red-700" : "text-slate-900"}`}>
                  {phase === "success" ? "Retraining Started" : phase === "error" ? "Error Occurred" : "In Progress"}
                </p>
                <p className={`text-sm mt-0.5 ${phase === "error" ? "text-red-600" : "text-slate-500"}`}>{msg}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
