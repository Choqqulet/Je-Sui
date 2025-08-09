import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import WalletRootProvider from "./wallet/WalletProvider";
import "./index.css";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletRootProvider>
      <App />
    </WalletRootProvider>
  </React.StrictMode>
);
