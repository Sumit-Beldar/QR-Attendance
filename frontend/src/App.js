import { useState, useEffect } from "react";
import Scanner from "./Scanner";

function App() {
  const [mode, setMode] = useState("teacher"); // teacher or student
  const [qr, setQr] = useState("");

  const generateQR = async () => {
    const res = await fetch("http://localhost:5000/api/qr/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lectureId: "math101" })
    });

    const data = await res.json();
    setQr(data.qr);
  };

  useEffect(() => {
    if (mode === "teacher") {
      generateQR();

      const interval = setInterval(() => {
        generateQR();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>QR Attendance System</h1>

      {/* Mode Switch */}
      <button onClick={() => setMode("teacher")}>Teacher View</button>
      <button onClick={() => setMode("student")}>Student View</button>

      {/* Teacher View */}
      {mode === "teacher" && (
        <div>
          <h2>Scan this QR</h2>
          {qr && <img src={qr} alt="QR Code" />}
        </div>
      )}

      {/* Student View */}
      {mode === "student" && <Scanner />}
    </div>
  );
}

export default App;