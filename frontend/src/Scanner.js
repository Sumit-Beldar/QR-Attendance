import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function Scanner() {
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

          const res = await fetch("http://localhost:5000/api/qr/verify", {
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
          alert("Invalid QR");
        }
      },
      (error) => {
        console.log(error);
      }
    );

    return () => scanner.clear();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan QR</h2>
      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
    </div>
  );
}

export default Scanner;