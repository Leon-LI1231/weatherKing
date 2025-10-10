// src/App.jsx
import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState(""); // state to hold backend message

  // Function called on button click
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/hello");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const text = await response.text();
      setMessage(text);
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Failed to fetch data from backend");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Hello World!</h1>
      <button
        onClick={fetchData}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Get Backend Data
      </button>

      {/* Display message on the page */}
      {message && (
        <p style={{ marginTop: "20px", fontSize: "18px", color: "blue" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default App;
