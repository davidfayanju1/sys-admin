import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent wheel from changing number input values globally
const preventNumberInputWheel = (e: WheelEvent) => {
  const target = e.target as HTMLElement;
  if (target && (target as HTMLInputElement).type === "number") {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
};

// Add event listener to catch wheel events
document.addEventListener("wheel", preventNumberInputWheel, { passive: false });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
