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

export default function Visualizations() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* Heading */}
      <div style={{
        background: "#000080", color: "white",
        padding: "3px 8px", fontSize: 11, fontWeight: "bold",
        borderLeft: "3px solid #4080ff"
      }}>
        📊 Data Insights & Model Performance — Feature analysis from 21,397 images.
      </div>

      {/* Top metrics */}
      <div className="win-window" style={{ padding: 0, overflow: "hidden" }}>
        <div className="win-titlebar" style={{ fontSize: 11 }}>📈 Model Evaluation Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
          {TOP_METRICS.map(({ label, value, sub }, i) => (
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

      {/* Feature 1 — Class Distribution */}
      <div className="win-window" style={{ overflow: "hidden" }}>
        <div className="win-titlebar" style={{ fontSize: 11 }}>
          📊 Feature 1 — Class Distribution
          <div className="win-titlebar-buttons">
            <div className="win-btn-chrome">?</div>
          </div>
        </div>
        <div style={{ padding: 8 }}>
          <p style={{ fontSize: 10, marginBottom: 6, color: "#808080" }}>Severe imbalance: CMD accounts for 61.5% of all samples</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {CLASSES.map(({ name, short, count, pct }) => (
              <div key={short}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <span style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <span className="win-inset" style={{ padding: "1px 5px", fontSize: 9, fontWeight: "bold", background: "#c0c0c0" }}>
                      {short}
                    </span>
                    {name}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: "bold", fontFamily: "monospace" }}>
                    {pct}% · {count.toLocaleString()}
                  </span>
                </div>
                <div className="win-progress-track" style={{ height: 12 }}>
                  <div className="bar-fill" style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #4080c0 8px, #4080c0 10px)"
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 8,
            padding: 6,
            background: "#ffffc0",
            border: "1px solid #808000",
            fontSize: 10,
            lineHeight: 1.4,
          }}>
            <strong>💡 Why this matters:</strong> CMD (61.5%) vastly outnumbers CBB (5.1%). Without correction, the model defaults to predicting CMD on every image. We applied stratified splitting and class-weighted loss — giving CBB a weight of <strong>3.93×</strong> versus CMD's 0.33×.
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>

        {/* Feature 2 — RGB */}
        <div className="win-window" style={{ overflow: "hidden" }}>
          <div className="win-titlebar" style={{ fontSize: 11 }}>
            🎨 Feature 2 — Mean RGB Color
            <div className="win-titlebar-buttons">
              <div className="win-btn-chrome">?</div>
            </div>
          </div>
          <div style={{ padding: 8 }}>
            <p style={{ fontSize: 10, marginBottom: 6, color: "#808080" }}>Color signature per disease class</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {RGB_DATA.map(({ name, red, green, blue }) => (
                <div key={name}>
                  <p style={{ fontSize: 10, fontWeight: "bold", marginBottom: 2 }}>{name}</p>
                  {[
                    { l: "R", v: red   },
                    { l: "G", v: green },
                    { l: "B", v: blue  },
                  ].map(({ l, v }) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                      <span style={{ fontSize: 9, fontWeight: "bold", width: 12 }}>{l}</span>
                      <div className="win-progress-track" style={{ flex: 1, height: 10 }}>
                        <div className="bar-fill" style={{
                          height: "100%",
                          width: `${(v / 255) * 100}%`,
                          background: "repeating-linear-gradient(90deg, #808080 0px, #808080 6px, #606060 6px, #606060 8px)"
                        }} />
                      </div>
                      <span style={{ fontSize: 9, fontWeight: "bold", fontFamily: "monospace", width: 28, textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 8,
              padding: 6,
              background: "#e0f0ff",
              border: "1px solid #0000c0",
              fontSize: 10,
              lineHeight: 1.4,
            }}>
              <strong>Insight:</strong> Healthy leaves peak in the green channel (122). Diseased leaves show elevated red (112 for CBB) — browning and necrosis visible at the pixel level.
            </div>
          </div>
        </div>

        {/* Feature 3 — Edge density */}
        <div className="win-window" style={{ overflow: "hidden" }}>
          <div className="win-titlebar" style={{ fontSize: 11 }}>
            📐 Feature 3 — Edge Density
            <div className="win-titlebar-buttons">
              <div className="win-btn-chrome">?</div>
            </div>
          </div>
          <div style={{ padding: 8 }}>
            <p style={{ fontSize: 10, marginBottom: 6, color: "#808080" }}>Texture complexity via Canny edge detection</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {EDGE_DATA.map(({ name, score }) => (
                <div key={name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 10 }}>{name}</span>
                    <span style={{ fontSize: 10, fontWeight: "bold", fontFamily: "monospace" }}>{score.toFixed(4)}</span>
                  </div>
                  <div className="win-progress-track" style={{ height: 10 }}>
                    <div className="bar-fill" style={{
                      height: "100%",
                      width: `${(score / maxEdge) * 100}%`,
                      background: "repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #4080c0 8px, #4080c0 10px)"
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 8,
              padding: 6,
              background: "#e0f0ff",
              border: "1px solid #0000c0",
              fontSize: 10,
              lineHeight: 1.4,
            }}>
              <strong>Insight:</strong> CGM and CBSD show the highest edge density — irregular spots and lesions produce complex textures. Healthy leaves score lowest (0.0271) with smooth, uniform surfaces.
            </div>
          </div>
        </div>
      </div>

      {/* Per-class performance table */}
      <div className="win-window" style={{ overflow: "hidden" }}>
        <div className="win-titlebar" style={{ fontSize: 11 }}>
          🏆 Per-Class Model Performance
          <div className="win-titlebar-buttons">
            <div className="win-btn-chrome">?</div>
          </div>
        </div>
        <div style={{ padding: 8 }}>
          <p style={{ fontSize: 10, marginBottom: 6, color: "#808080" }}>
            CMD leads at F1 0.96 — CBB is hardest at F1 0.62 due to limited training data
          </p>
          <div className="win-inset" style={{ overflowX: "auto", background: "white" }}>
            <table className="win-table" style={{ fontSize: 10 }}>
              <thead>
                <tr>
                  <th>Class</th>
                  <th style={{ textAlign: "center" }}>Precision</th>
                  <th style={{ textAlign: "center" }}>Recall</th>
                  <th style={{ textAlign: "center" }}>F1</th>
                  <th style={{ textAlign: "center" }}>Support</th>
                  <th style={{ minWidth: 120 }}>F1 Score</th>
                </tr>
              </thead>
              <tbody>
                {PER_CLASS.map(({ name, short, prec, rec, f1, sup }) => (
                  <tr key={short}>
                    <td>
                      <span className="win-inset" style={{ padding: "1px 4px", fontSize: 9, fontWeight: "bold", background: "#c0c0c0", marginRight: 4 }}>
                        {short}
                      </span>
                      {name}
                    </td>
                    <td style={{ textAlign: "center", fontFamily: "monospace" }}>{prec.toFixed(2)}</td>
                    <td style={{ textAlign: "center", fontFamily: "monospace" }}>{rec.toFixed(2)}</td>
                    <td style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "bold" }}>{f1.toFixed(2)}</td>
                    <td style={{ textAlign: "center", fontFamily: "monospace" }}>{sup.toLocaleString()}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div className="win-progress-track" style={{ flex: 1, height: 10 }}>
                          <div className="bar-fill" style={{
                            height: "100%",
                            width: `${f1 * 100}%`,
                            background: "repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #4080c0 8px, #4080c0 10px)"
                          }} />
                        </div>
                        <span style={{ fontSize: 9, fontWeight: "bold", fontFamily: "monospace" }}>
                          {(f1 * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{
            marginTop: 8,
            padding: 6,
            background: "#e0f0ff",
            border: "1px solid #0000c0",
            fontSize: 10,
            lineHeight: 1.4,
          }}>
            <strong>Key finding:</strong> The model performs best on CMD (most training samples) and worst on CBB (fewest samples), directly demonstrating the impact of training data volume on per-class performance.
          </div>
        </div>
      </div>

    </div>
  );
}
