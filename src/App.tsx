import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Home from "./pages/home";
import Orders from "./pages/orders";
import Products from "./pages/products";
import Inventory from "./pages/inventory";
import Customers from "./pages/customers";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster
          theme="dark"
          position="bottom-right"
          richColors
          toastOptions={{
            duration: 4000,
            style: {
              background: "black",
              color: "white",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: "300",
              letterSpacing: "0.1em",
              fontSize: "11px",
            },
            classNames: {
              toast:
                "!bg-black !text-white !border-white/10 !rounded-none ![font-weight:300] !tracking-[0.1em] !text-[11px] ![font-family:'Inter',sans-serif]",
              description: "!text-white/60 ![font-weight:300]",
              actionButton:
                "!bg-white !text-black !rounded-none ![font-weight:300]",
              cancelButton:
                "!bg-black !text-white !rounded-none !border-white/20 ![font-weight:300]",
              success: "!bg-green-900 !border-green-700 !text-white",
              error: "!bg-red-900 !border-red-700 !text-white",
              warning: "!bg-amber-900 !border-amber-700 !text-white",
              info: "!bg-blue-900 !border-blue-700 !text-white",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
