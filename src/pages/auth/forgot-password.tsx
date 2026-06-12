import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../lib/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await api.post("/auth/forgot-password", payload);
      return response.data;
    },
    onSuccess: (response: any) => {
      toast.success(
        response?.message || "Password reset link sent to your email!",
        {
          duration: 5000,
          position: "bottom-right",
        },
      );

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send reset link. Please try again.";

      toast.error(message, {
        duration: 4000,
        position: "bottom-right",
      });

      forgotPasswordMutation.reset();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    forgotPasswordMutation.reset();
    forgotPasswordMutation.mutate({ email });
  };

  const isLoading = forgotPasswordMutation.isPending;

  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-24 w-full">
        <div className="max-w-md mx-auto">
          {/* Back to Login Link */}
          <div className="mb-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Login
            </Link>
          </div>

          {/* Logo on top */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img src="/images/logo_dark.png" alt="Logo" className="h-20" />
            </div>
            <div className="w-12 h-px bg-black/15 mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-light text-black tracking-tight font-['Times_New_Roman',serif]">
              Forgot Password?
            </h1>
            <p className="text-xs text-black/40 mt-3 tracking-[0.15em] uppercase font-['Times_New_Roman',serif]">
              We'll send you a reset link
            </p>
            <div className="w-12 h-px bg-black/15 mx-auto mt-6" />
          </div>

          {/* Forgot Password Form */}
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
                  autoFocus
                />
              </div>
              <p className="text-[8px] text-black/25 mt-2 tracking-wide">
                Enter the email address associated with your account
              </p>
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
                    Sending...
                  </span>
                </>
              ) : (
                <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                  Send Reset Link
                </span>
              )}
            </button>
          </form>

          {/* Back to Login Link at bottom */}
          <div className="text-center mt-12">
            <p className="text-[9px] tracking-[0.15em] text-black/40 uppercase">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-black/70 underline hover:text-black transition-colors"
              >
                Sign In
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

export default ForgotPassword;
