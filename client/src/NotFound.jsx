import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page" style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: "72px", margin: "0 0 10px 0", color: "#e63946" }}>404</h1>
      <h2 style={{ fontSize: "28px", marginBottom: "15px" }}>Page Not Found</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#111",
          color: "#fff",
          border: "none",
          padding: "12px 24px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Return to Home
      </button>
    </div>
  );
}

export default NotFound;
