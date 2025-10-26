import React from "react";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import "./scss/main.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <CookiesProvider defaultSetOptions={{ path: "/", sameSite: "lax" }}>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </CookiesProvider>
);

reportWebVitals();
