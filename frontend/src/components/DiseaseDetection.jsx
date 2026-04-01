import { useState, useRef } from "react";
import axios from "axios";
import { UploadCloud, X, AlertTriangle, CheckCircle, Leaf, Info, Camera } from "lucide-react";

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
      setResult({ error: "Could not reach the backend. Make sure the API is running on port 8000." });
    }
    setLoading(false);
  };

  const top   = result && !result.error ? classMap[result.prediction] : null;
  const probs = result?.all_probabilities
    ? Object.entries(result.all_probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="space-y-6">

      {/* Section heading */}
      <div>
        <h2 className="text-3xl font-black text-white">Leaf Disease Analysis</h2>
        <p className="text-white/60 text-lg mt-1">Upload a cassava leaf photo to get an instant AI diagnosis.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Upload card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
              <Camera className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload Leaf Image</h3>
              <p className="text-slate-400 text-sm">JPG, PNG or WEBP</p>
            </div>
          </div>

          <div className="p-8">
            <input type="file" ref={inputRef} onChange={e => processFile(e.target.files?.[0])} accept="image/*" className="hidden" />

            {!preview ? (
              <div
                onDragOver={e => { e.preventDefault(); setDrag(true);  }}
                onDragLeave={e => { e.preventDefault(); setDrag(false); }}
                onDrop={e => { e.preventDefault(); setDrag(false); processFile(e.dataTransfer.files?.[0]); }}
                onClick={() => inputRef.current.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                  drag ? "border-slate-400 bg-slate-50" : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-xl font-bold text-slate-700 mb-2">
                  {drag ? "Drop your image here" : "Drag & drop your leaf photo"}
                </p>
                <p className="text-slate-400 text-base">
                  or <span className="text-slate-700 font-semibold underline underline-offset-2">click to browse</span> your files
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {["Well-lit photo", "Single leaf", "Full leaf in frame"].map(tip => (
                    <div key={tip} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-slate-500 text-xs font-semibold">— {tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                  <img src={preview} alt="Preview" className="w-full h-72 object-cover" />
                  <button
                    onClick={clear}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-lg font-medium max-w-[80%] truncate">
                    {file?.name}
                  </div>
                </div>

                <button
                  onClick={predict}
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-base font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spin" />Analyzing leaf…</>
                    : <><Leaf className="w-4 h-4" />Analyze for Disease</>
                  }
                </button>

                <button onClick={clear} className="w-full text-slate-400 hover:text-slate-600 font-semibold text-sm py-2 transition">
                  Upload a different image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Diagnosis Results</h3>
              <p className="text-slate-400 text-sm">All 5 class probabilities</p>
            </div>
          </div>

          <div className="p-8">
            {/* Empty */}
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-lg font-bold text-slate-400">No analysis yet</p>
                <p className="text-slate-300 text-sm mt-1">Upload a leaf image to begin</p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <span className="w-10 h-10 border-3 border-slate-200 border-t-slate-700 rounded-full spin" />
                </div>
                <p className="text-lg font-bold text-slate-700">Running AI Analysis</p>
                <p className="text-slate-400 text-sm mt-1">EfficientNetB4 processing…</p>
              </div>
            )}

            {/* Error */}
            {result?.error && (
              <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-800">Analysis Failed</p>
                  <p className="text-red-600 text-sm mt-1">{result.error}</p>
                </div>
              </div>
            )}

            {/* Success */}
            {result && !result.error && top && (
              <div className="space-y-6 fade-in">

                {/* Top result */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        {top.key === "Healthy" ? "Plant Status" : "Disease Detected"}
                      </p>
                      <p className="text-2xl font-black text-slate-900">{top.key}</p>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-xs">{top.desc}</p>
                    </div>
                    <div className="shrink-0 text-center bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                      <p className="text-3xl font-black text-slate-900">{result.confidence.toFixed(1)}%</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-0.5">Confidence</p>
                    </div>
                  </div>
                </div>

                {/* All probabilities */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">All Disease Probabilities</p>
                  </div>
                  <div className="space-y-3">
                    {probs.map(([name, pct]) => {
                      const isTop = name === result.prediction;
                      return (
                        <div key={name} className={`rounded-xl p-4 ${isTop ? "bg-slate-900 text-white" : "bg-slate-50"}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-bold ${isTop ? "text-white" : "text-slate-600"}`}>{name}</span>
                            <span className={`text-base font-black tabular-nums ${isTop ? "text-white" : "text-slate-700"}`}>
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                          <div className={`h-2 rounded-full overflow-hidden ${isTop ? "bg-white/20" : "bg-slate-200"}`}>
                            <div
                              className={`h-full rounded-full bar-fill ${isTop ? "bg-white" : "bg-slate-400"}`}
                              style={{ width: `${Math.max(pct, 0.3)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Advice */}
                {top.key !== "Healthy" && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <p className="font-bold text-slate-700 text-sm mb-1">Recommended Action</p>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Contact your local agricultural extension officer. Isolate affected plants immediately to prevent spread.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model metrics strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Validation Accuracy", value: "86.73%",        sub: "4,280 held-out images"          },
          { label: "Weighted F1-Score",   value: "0.868",          sub: "Harmonic mean, 5 classes"       },
          { label: "Training Images",     value: "17,117",         sub: "Stratified 80 / 20 split"       },
          { label: "Architecture",        value: "EfficientNetB4", sub: "ImageNet pretrained + fine-tuned"},
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-5 text-white">
            <p className="text-2xl font-black">{value}</p>
            <p className="text-white/80 font-semibold text-sm mt-1">{label}</p>
            <p className="text-white/40 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
