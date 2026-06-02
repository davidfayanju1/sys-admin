import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post("/auth/login", payload);
      return response.data;
    },
    onSuccess: (response: any) => {
      const token = response?.data?.token;
      const user = response?.data?.user;

      console.log(response?.data, "Login response");

      if (token && user) {
        sessionStorage.setItem("accessToken", token);
        setUser(user);

        toast.success(
          `Welcome back, ${user.name || user.email || "Stylist"}!`,
          {
            duration: 4000,
            position: "bottom-right",
          },
        );

        setTimeout(() => {
          navigate("/home");
        }, 500);
      } else {
        toast.error("Authentication failed. Missing token or user data.", {
          duration: 4000,
          position: "bottom-right",
        });
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid email or password.";

      toast.error(message, {
        duration: 4000,
        position: "bottom-right",
      });

      console.log(message, "Message");

      // Reset mutation to allow new attempts
      loginMutation.reset();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    // Reset any previous error state before new mutation
    loginMutation.reset();

    // Proceed with login
    loginMutation.mutate({ email, password });
  };

  const isLoading = loginMutation.isPending;

  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-24 w-full">
        <div className="max-w-md mx-auto">
          {/* Logo on top */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img src="/images/logo_dark.png" alt="Logo" className="h-20" />
            </div>
            <div className="w-12 h-px bg-black/15 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-light text-black tracking-tight font-['Times_New_Roman',serif]">
              Welcome Back
            </h1>
            <p className="text-xs text-black/40 mt-3 tracking-[0.15em] uppercase font-['Times_New_Roman',serif]">
              Enter your world of style
            </p>
            <div className="w-12 h-px bg-black/15 mx-auto mt-6" />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 text-sm text-black border border-black/20 rounded-none outline-none focus:border-black/60 transition-colors font-light placeholder:text-black/20"
                  placeholder="name@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-24 py-3 text-sm text-black border border-black/20 rounded-none outline-none focus:border-black/60 transition-colors font-light placeholder:text-black/20"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 underline underline-offset-4 transition-colors font-['Times_New_Roman',serif]"
                  disabled={isLoading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-[9px] underline tracking-[0.15em] uppercase text-black/30 hover:text-black/60 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 hover:bg-black/80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                    Signing In...
                  </span>
                </>
              ) : (
                <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-12">
            <p className="text-[9px] tracking-[0.15em] text-black/40 uppercase">
              New to SYS EMPIRE?{" "}
              <Link
                to="/signup"
                className="text-black/70 underline hover:text-black transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Decorative element */}
          <div className="flex justify-center mt-12">
            <Heart className="w-3 h-3 text-black/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
