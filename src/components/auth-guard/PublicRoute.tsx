// components/auth-guard/PublicRoute.jsx
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token =
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  // If token exists, redirect to home page immediately
  if (token) {
    return <Navigate to="/home" replace />;
  }

  // If no token, show the login/signup page
  return children;
};

export default PublicRoute;
