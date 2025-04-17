import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NotificationsProvider } from "./contexts/NotificationsContext.tsx";
import { TodosProvider } from "./contexts/TodosContext.tsx";
import { ScreenSizeProvider } from "./contexts/ScreenSizeContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NotificationsProvider>
      <TodosProvider>
        <ScreenSizeProvider>
          <App />
        </ScreenSizeProvider>
      </TodosProvider>
    </NotificationsProvider>
  </StrictMode>
);
