import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import EnrollModalProvider from "./context/EnrollModalProvider";
import SiteModeProvider from "./context/SiteModeProvider";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SiteModeProvider>
        <EnrollModalProvider>
          <App />
        </EnrollModalProvider>
      </SiteModeProvider>
    </BrowserRouter>
  </StrictMode>,
);