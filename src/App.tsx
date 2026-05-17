import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Home from "./pages/home";
import Orders from "./pages/orders";
import Products from "./pages/products";
import Inventory from "./pages/inventory";
import Customers from "./pages/customers";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App;
