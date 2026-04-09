import { useState, useEffect } from "react";
import Scanner from "./Scanner";
import "./App.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [mode, setMode] = useState("teacher"); // teacher or student
  const [qr, setQr] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      const res = await fetch(`${API_BASE_URL}/api/qr/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lectureId: "math101" })
      });

      const data = await res.json();
      setQr(data.qr);
    };

    if (mode === "teacher") {
      generateQR();

      const interval = setInterval(() => {
        generateQR();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-title">QR Attendance System</h1>
        <p className="app-subtitle">Seamless tracking for modern classrooms</p>
      </header>

      <div className="controls">
        <button 
          className={`btn ${mode === "teacher" ? "btn-primary active" : "btn-secondary"}`} 
          onClick={() => setMode("teacher")}
        >
          Teacher View
        </button>
        <button 
          className={`btn ${mode === "student" ? "btn-primary active" : "btn-secondary"}`} 
          onClick={() => setMode("student")}
        >
          Student View
        </button>
      </div>

      <article className="glass-panel">
        {mode === "teacher" && (
          <div className="qr-container">
            <h2 className="qr-title">Scan this QR code to mark your attendance</h2>
            {qr ? (
              <div className="qr-image-wrapper">
                <img src={qr} alt="Attendance QR Code" />
              </div>
            ) : (
              <p className="placeholder-text">Generating fresh QR code...</p>
            )}
          </div>
        )}

        {mode === "student" && <Scanner />}
      </article>
    </main>
  );
}

export default App;