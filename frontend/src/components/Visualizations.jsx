import { TrendingUp, BarChart3, Layers, Award } from "lucide-react";

const CLASSES = [
  { name: "Cassava Mosaic Disease (CMD)",        short: "CMD",  count: 13158, pct: 61.5 },
  { name: "Healthy",                             short: "HLT",  count: 2577,  pct: 12.0 },
  { name: "Cassava Green Mottle (CGM)",          short: "CGM",  count: 2386,  pct: 11.1 },
  { name: "Cassava Brown Streak Disease (CBSD)", short: "CBSD", count: 2189,  pct: 10.2 },
  { name: "Cassava Bacterial Blight (CBB)",      short: "CBB",  count: 1087,  pct: 5.1  },
];

const RGB_DATA = [
  { name: "CBB",     red: 112, green: 98,  blue: 74  },
  { name: "CBSD",    red: 108, green: 102, blue: 71  },
  { name: "CGM",     red: 95,  green: 108, blue: 65  },
  { name: "CMD",     red: 99,  green: 105, blue: 68  },
  { name: "Healthy", red: 82,  green: 122, blue: 63  },
];

const EDGE_DATA = [
  { name: "Cassava Green Mottle (CGM)",          score: 0.0445 },
  { name: "Cassava Brown Streak Disease (CBSD)", score: 0.0428 },
  { name: "Cassava Mosaic Disease (CMD)",        score: 0.0398 },
  { name: "Cassava Bacterial Blight (CBB)",      score: 0.0312 },
  { name: "Healthy",                             score: 0.0271 },
];

const PER_CLASS = [
  { name: "Cassava Mosaic Disease (CMD)",        short: "CMD",  prec: 0.95, rec: 0.96, f1: 0.96, sup: 2632 },
  { name: "Cassava Green Mottle (CGM)",          short: "CGM",  prec: 0.78, rec: 0.76, f1: 0.77, sup: 477  },
  { name: "Cassava Brown Streak Disease (CBSD)", short: "CBSD", prec: 0.83, rec: 0.72, f1: 0.77, sup: 438  },
  { name: "Healthy",                             short: "HLT",  prec: 0.69, rec: 0.69, f1: 0.69, sup: 516  },
  { name: "Cassava Bacterial Blight (CBB)",      short: "CBB",  prec: 0.57, rec: 0.70, f1: 0.62, sup: 217  },
];

const TOP_METRICS = [
  { label: "Overall Accuracy",   value: "86.73%", sub: "Validation — 4,280 images"   },
  { label: "Weighted F1-Score",  value: "0.868",  sub: "All 5 disease classes"        },
  { label: "Weighted Precision", value: "0.870",  sub: "Positive predictive value"    },
  { label: "Weighted Recall",    value: "0.867",  sub: "Sensitivity across classes"   },
];

const maxEdge = Math.max(...EDGE_DATA.map(d => d.score));

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

export default function Visualizations() {
  return (
    <div className="space-y-6">

      {/* Heading */}
      <div>
        <h2 className="text-3xl font-black text-white">Data Insights & Model Performance</h2>
        <p className="text-white/60 text-lg mt-1">
          Feature analysis from 21,397 images and full evaluation of the trained EfficientNetB4 model.
        </p>
      </div>

      {/* Top metrics — same style as detection page */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TOP_METRICS.map(({ label, value, sub }) => (
          <div key={label} className="bg-white/10 backdrop-blur rounded-2xl border border-white/15 p-5 text-white">
            <p className="text-2xl font-black">{value}</p>
            <p className="text-white/80 font-semibold text-sm mt-1">{label}</p>
            <p className="text-white/40 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Feature 1 — Class Distribution */}
      <SectionCard icon={BarChart3} title="Feature 1 — Class Distribution" subtitle="Severe imbalance: CMD accounts for 61.5% of all samples">
        <div className="space-y-4">
          {CLASSES.map(({ name, short, count, pct }) => (
            <div key={short} className="flex items-center gap-5">
              <span className="w-14 shrink-0 text-center text-xs font-black text-slate-500 bg-slate-100 py-1.5 rounded-lg">
                {short}
              </span>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-700">{name}</span>
                  <span className="text-sm font-black text-slate-900 tabular-nums">{pct}% &nbsp;·&nbsp; {count.toLocaleString()}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
          <p className="font-bold text-slate-800 text-sm mb-1">Why this matters</p>
          <p className="text-slate-500 text-sm leading-relaxed">
            CMD (61.5%) vastly outnumbers CBB (5.1%). Without correction, the model defaults to predicting CMD on every image.
            We applied stratified splitting and class-weighted loss — giving CBB a weight of <strong className="text-slate-700">3.93×</strong> versus CMD's 0.33×.
          </p>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Feature 2 — RGB */}
        <SectionCard icon={Layers} title="Feature 2 — Mean RGB Color" subtitle="Color signature per disease class">
          <div className="space-y-5">
            {RGB_DATA.map(({ name, red, green, blue }) => (
              <div key={name}>
                <p className="text-sm font-bold text-slate-700 mb-2">{name}</p>
                <div className="space-y-1.5">
                  {[
                    { l: "R", v: red   },
                    { l: "G", v: green },
                    { l: "B", v: blue  },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 w-5">{l}</span>
                      <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-700 rounded-full bar-fill" style={{ width: `${(v / 255) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 w-8 text-right tabular-nums">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-slate-500 text-sm leading-relaxed">
              <strong className="text-slate-700">Insight:</strong> Healthy leaves peak in the green channel (122). Diseased leaves show elevated red (112 for CBB) — browning and necrosis visible at the pixel level.
            </p>
          </div>
        </SectionCard>

        {/* Feature 3 — Edge density */}
        <SectionCard icon={TrendingUp} title="Feature 3 — Edge Density" subtitle="Texture complexity via Canny edge detection">
          <div className="space-y-4">
            {EDGE_DATA.map(({ name, score }) => (
              <div key={name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-700">{name}</span>
                  <span className="text-sm font-black text-slate-900 tabular-nums">{score.toFixed(4)}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-800 rounded-full bar-fill"
                    style={{ width: `${(score / maxEdge) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-slate-500 text-sm leading-relaxed">
              <strong className="text-slate-700">Insight:</strong> CGM and CBSD show the highest edge density — irregular spots and lesions produce complex textures. Healthy leaves score lowest (0.0271) with smooth, uniform surfaces.
            </p>
          </div>
        </SectionCard>
      </div>

      {/* Per-class performance table */}
      <SectionCard icon={Award} title="Per-Class Model Performance" subtitle="CMD leads at F1 0.96 — CBB is hardest at F1 0.62 due to limited training data">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="text-left pb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Class</th>
                <th className="text-center pb-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Precision</th>
                <th className="text-center pb-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Recall</th>
                <th className="text-center pb-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">F1</th>
                <th className="text-center pb-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Support</th>
                <th className="text-left pb-4 pl-4 text-xs font-black text-slate-400 uppercase tracking-widest w-36">F1 Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PER_CLASS.map(({ name, short, prec, rec, f1, sup }) => (
                <tr key={short} className="hover:bg-slate-50 transition">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{short}</span>
                      <span className="font-semibold text-slate-800 text-sm">{name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-sm font-semibold text-slate-700">{prec.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center font-mono text-sm font-semibold text-slate-700">{rec.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center font-mono text-sm font-black text-slate-900">{f1.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center font-mono text-sm text-slate-500">{sup.toLocaleString()}</td>
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-800 rounded-full bar-fill" style={{ width: `${f1 * 100}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 font-bold tabular-nums w-8">{(f1 * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-slate-400 text-sm">
            <strong className="text-slate-600">Key finding:</strong> The model performs best on CMD (most training samples) and worst on CBB (fewest samples), directly demonstrating the impact of training data volume on per-class performance.
          </p>
        </div>
      </SectionCard>

    </div>
  );
}
