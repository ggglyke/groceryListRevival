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

// Basename pour le Router : vide en prod (chemins relatifs), "/groceryList" en dev
const basename = process.env.REACT_APP_ROUTER_BASENAME || "";

root.render(
  <CookiesProvider defaultSetOptions={{ path: "/", sameSite: "lax" }}>
    <AuthProvider>
      <Router basename={basename}>
        <App />
      </Router>
    </AuthProvider>
  </CookiesProvider>
);

reportWebVitals();
