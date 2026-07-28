import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./styles/dashboard.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/login.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />

        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);