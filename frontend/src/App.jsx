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
    <div className="page-bg" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header uptime={uptime} isOnline={isOnline} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="fade-in" key={activeTab}>
          {activeTab === "detection"  && <DiseaseDetection apiUrl={API_URL} />}
          {activeTab === "retraining" && <Retraining apiUrl={API_URL} />}
          {activeTab === "insights"   && <Visualizations />}
        </div>
      </main>
    </div>
  );
}
