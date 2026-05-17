import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    navigate("/home");
    console.log("Login attempted with:", { email, password });
  };

  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-24 w-full">
        <div className="max-w-md mx-auto">
          {/* Logo on top */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img src="/images/logo_dark.png" alt="" className="h-20" />
              {/* <Heart className="w-8 h-8 text-black/40" /> */}
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
          <form onSubmit={handleSubmit} className="">
            {/* Email Field */}
            <div className="mb-8">
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
                  //   required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="">
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
                  //   required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 underline underline-offset-4 transition-colors font-['Times_New_Roman',serif]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-8">
              <Link
                to="/forgot-password"
                className="text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button - Filled */}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 hover:bg-black/80 transition-colors duration-300"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                Sign In
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-[8px] tracking-[0.2em] uppercase text-black/30 ">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          {/* Social Login */}
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 border border-black/20 hover:border-black/50 transition-all text-[9px] tracking-[0.15em] uppercase text-black/60 hover:text-black">
              Google
            </button>
            <button className="px-6 py-3 border border-black/20 hover:border-black/50 transition-all text-[9px] tracking-[0.15em] uppercase text-black/60 hover:text-black">
              Apple
            </button>
          </div>

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
