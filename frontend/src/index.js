import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles/index.css"; // optional, can remove or keep

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
