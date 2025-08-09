// frontend/src/components/Connect.tsx
import React from "react";

export default function Connect() {
  return (
    <button
      onClick={() => alert("Wallet connect flow will be implemented here")}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Connect Wallet
    </button>
  );
}