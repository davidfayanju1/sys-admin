import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, User, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    role: false,
  });

  const roles = [
    { value: "client", label: "Client - Shop and order custom wear" },
    { value: "editor", label: "Editor - Manage content and collections" },
    { value: "admin", label: "Admin - Full access to dashboard" },
    { value: "superadmin", label: "Super Admin - Complete platform control" },
  ];

  // Clear specific field error when user types
  const handleFieldChange = (
    field: keyof FieldErrors,
    value: string,
    setter: (value: string) => void,
  ) => {
    setter(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateField = (
    field: keyof FieldErrors,
    value: string,
  ): string | undefined => {
    switch (field) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2)
          return "First name must be at least 2 characters";
        return undefined;
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.trim().length < 2)
          return "Last name must be at least 2 characters";
        return undefined;
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return undefined;
      case "phone":
        if (!value.trim()) return "Phone number is required";
        const phoneRegex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value) && value.replace(/\D/g, "").length < 10) {
          return "Please enter a valid phone number";
        }
        return undefined;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return undefined;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== password) return "Passwords do not match";
        return undefined;
      case "role":
        if (!value) return "Please select a role";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleFieldBlur = (field: keyof FieldErrors, value: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateAllFields = (): boolean => {
    const errors: FieldErrors = {};

    errors.firstName = validateField("firstName", firstName);
    errors.lastName = validateField("lastName", lastName);
    errors.email = validateField("email", email);
    errors.phone = validateField("phone", phone);
    errors.password = validateField("password", password);
    errors.confirmPassword = validateField("confirmPassword", confirmPassword);
    errors.role = validateField("role", role);

    setFieldErrors(errors);
    setTouchedFields({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      role: true,
    });

    return !Object.values(errors).some((error) => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      toast.error("Please fix the errors before continuing", {
        duration: 4000,
        position: "bottom-right",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });

      const user = response?.data?.data?.user;
      const token = response?.data?.data?.token;

      console.log(response.data, "Credentials");

      if (user && token) {
        sessionStorage.setItem("accessToken", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);

        toast.success(`Welcome to SYS EMPIRE, ${firstName}!`, {
          duration: 4000,
          position: "bottom-right",
        });

        setTimeout(() => {
          navigate("/home");
        }, 500);
      } else {
        // toast.error("Registration failed. Missing user data or token.", {
        //   duration: 4000,
        //   position: "bottom-right",
        // });

        toast.success(`Welcome to SYS EMPIRE, ${firstName}!`, {
          duration: 4000,
          position: "bottom-right",
        });

        setTimeout(() => {
          navigate("/home");
        }, 500);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed. Please try again.";

      toast.error(errorMessage, {
        duration: 4000,
        position: "bottom-right",
      });

      // Handle duplicate email error
      if (
        errorMessage.toLowerCase().includes("email") ||
        error?.response?.data?.field === "email"
      ) {
        setFieldErrors((prev) => ({ ...prev, email: errorMessage }));
        setTouchedFields((prev) => ({ ...prev, email: true }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get border color based on error and touched state
  const getBorderClass = (field: keyof FieldErrors) => {
    if (touchedFields[field] && fieldErrors[field]) {
      return "border-red-500 focus:border-red-500";
    }
    return "border-black/20 focus:border-black/60";
  };

  // Get role display name
  // const getRoleLabel = (roleValue: string) => {
  //   const found = roles.find((r) => r.value === roleValue);
  //   return found ? found.label : roleValue;
  // };

  return (
    <section className="bg-white min-h-screen flex items-center justify-center py-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full">
        <div className="max-w-md mx-auto">
          {/* Logo on top */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/images/logo_dark.png"
                alt="Logo"
                className="h-20 object-contain"
              />
            </div>
            <div className="w-12 h-px bg-black/15 mx-auto mb-4" />
            <h1 className="text-3xl font-light text-black tracking-tight font-['Times_New_Roman',serif]">
              Create Account
            </h1>
            <p className="text-xs text-black/40 mt-2 tracking-[0.15em] uppercase font-['Times_New_Roman',serif]">
              Join the SYS EMPIRE world of style
            </p>
            <div className="w-12 h-px bg-black/15 mx-auto mt-4" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields (Side by Side) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) =>
                      handleFieldChange(
                        "firstName",
                        e.target.value,
                        setFirstName,
                      )
                    }
                    onBlur={() => handleFieldBlur("firstName", firstName)}
                    className={`w-full pl-9 pr-4 py-3 text-sm text-black border rounded-none outline-none transition-colors font-light placeholder:text-black/20 ${getBorderClass("firstName")}`}
                    placeholder="Isabella"
                    disabled={isLoading}
                  />
                </div>
                {touchedFields.firstName && fieldErrors.firstName && (
                  <p className="text-[9px] text-red-500 mt-1 tracking-wide">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      handleFieldChange("lastName", e.target.value, setLastName)
                    }
                    onBlur={() => handleFieldBlur("lastName", lastName)}
                    className={`w-full pl-9 pr-4 py-3 text-sm text-black border rounded-none outline-none transition-colors font-light placeholder:text-black/20 ${getBorderClass("lastName")}`}
                    placeholder="Omotola"
                    disabled={isLoading}
                  />
                </div>
                {touchedFields.lastName && fieldErrors.lastName && (
                  <p className="text-[9px] text-red-500 mt-1 tracking-wide">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

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
                  onChange={(e) =>
                    handleFieldChange("email", e.target.value, setEmail)
                  }
                  onBlur={() => handleFieldBlur("email", email)}
                  className={`w-full pl-9 pr-4 py-3 text-sm text-black border rounded-none outline-none transition-colors font-light placeholder:text-black/20 ${getBorderClass("email")}`}
                  placeholder="name@example.com"
                  disabled={isLoading}
                />
              </div>
              {touchedFields.email && fieldErrors.email && (
                <p className="text-[9px] text-red-500 mt-1 tracking-wide">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    handleFieldChange("phone", e.target.value, setPhone)
                  }
                  onBlur={() => handleFieldBlur("phone", phone)}
                  className={`w-full pl-9 pr-4 py-3 text-sm text-black border rounded-none outline-none transition-colors font-light placeholder:text-black/20 ${getBorderClass("phone")}`}
                  placeholder="+2348161525506"
                  disabled={isLoading}
                />
              </div>
              {touchedFields.phone && fieldErrors.phone && (
                <p className="text-[9px] text-red-500 mt-1 tracking-wide">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                Account Type
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <select
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (fieldErrors.role) {
                      setFieldErrors((prev) => ({ ...prev, role: undefined }));
                    }
                  }}
                  onBlur={() => handleFieldBlur("role", role)}
                  className={`w-full pl-9 pr-4 py-3 text-sm text-black border rounded-none outline-none transition-colors font-light appearance-none bg-white ${getBorderClass("role")}`}
                  disabled={isLoading}
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              {touchedFields.role && fieldErrors.role && (
                <p className="text-[9px] text-red-500 mt-1 tracking-wide">
                  {fieldErrors.role}
                </p>
              )}
              <p className="text-[8px] text-black/30 mt-1 tracking-wide">
                A verification email will be sent to your email address
              </p>
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
                  onChange={(e) =>
                    handleFieldChange("password", e.target.value, setPassword)
                  }
                  onBlur={() => handleFieldBlur("password", password)}
                  className={`w-full pl-9 pr-24 py-3 text-sm text-black border rounded-none outline-none transition-colors font-light placeholder:text-black/20 ${getBorderClass("password")}`}
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
              {touchedFields.password && fieldErrors.password && (
                <p className="text-[9px] text-red-500 mt-1 tracking-wide">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-['Times_New_Roman',serif]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    handleFieldChange(
                      "confirmPassword",
                      e.target.value,
                      setConfirmPassword,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur("confirmPassword", confirmPassword)
                  }
                  className={`w-full pl-9 pr-24 py-3 text-sm text-black border rounded-none outline-none transition-colors font-light placeholder:text-black/20 ${getBorderClass("confirmPassword")}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/60 underline underline-offset-4 transition-colors font-['Times_New_Roman',serif]"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {touchedFields.confirmPassword && fieldErrors.confirmPassword && (
                <p className="text-[9px] text-red-500 mt-1 tracking-wide">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 hover:bg-black/80 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
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
                    Creating Account...
                  </span>
                </>
              ) : (
                <span className="text-[10px] tracking-[0.2em] uppercase font-['Times_New_Roman',serif]">
                  Sign Up
                </span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-[9px] tracking-[0.15em] text-black/40 uppercase font-['Times_New_Roman',serif]">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-black/70 underline hover:text-black transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Decorative element */}
          <div className="flex justify-center mt-8">
            <Heart className="w-3 h-3 text-black/10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
