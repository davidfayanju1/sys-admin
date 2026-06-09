// components/auth-guard/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token =
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  // FIXED: If NO token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If token exists, show the protected page
  return children;
};

export default ProtectedRoute;
