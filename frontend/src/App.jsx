// src/App.jsx
import React, { useState } from "react";

function App() {
  const [message, setMessage] = useState(""); // state to hold backend message

  // Function called on button click
  const fetchData = () => {
    setMessage("Need the Backend!");
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
