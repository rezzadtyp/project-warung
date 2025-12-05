import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppKitProvider } from "./providers/AppKitProvider.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import 'regenerator-runtime';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppKitProvider>
        <App />
      </AppKitProvider>
    </ThemeProvider>
  </StrictMode>
);
