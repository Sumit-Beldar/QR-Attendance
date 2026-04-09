import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function Scanner() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 5, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const data = JSON.parse(decodedText);

          const res = await fetch(`${API_BASE_URL}/api/qr/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              lectureId: data.lectureId,
              token: data.token,
              studentId: "stu123" // later from login
            })
          });

          const result = await res.json();
          alert(result.message);

        } catch (err) {
          alert("Invalid QR format");
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => scanner.clear().catch(e => console.log(e));
  }, []);

  return (
    <div className="qr-container">
      <h2 className="qr-title">Position QR Code in Frame</h2>
      <div id="reader" style={{ width: "100%", maxWidth: "400px" }}></div>
    </div>
  );
}

export default Scanner;