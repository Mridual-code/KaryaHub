import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./styles/dashboard.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/login.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/layout.css";
import {
  ThemeProvider,
  useTheme,
} from "./context/ThemeContext";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles/attendance.css";
import "./styles/employees.css";
import "./styles/reports.css";
import "./styles/notifications.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>

    <ThemeProvider>

      <AuthProvider>

        <BrowserRouter>

          <App />

          <ToastContainer
            position="top-right"
            autoClose={2500}
          />

        </BrowserRouter>

      </AuthProvider>

    </ThemeProvider>

  </StrictMode>
);