// components/common/Sidebar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  ClipboardList,
  Tags,
  X,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const mainMenu = [
    {
      category: "MAIN",
      items: [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/home",
          active: location.pathname === "/home",
        },
        {
          icon: ClipboardList,
          label: "Orders",
          path: "/orders",
          active: location.pathname === "/orders",
        },
        {
          icon: ShoppingBag,
          label: "Products",
          path: "/products",
          active: location.pathname === "/products",
        },
        {
          icon: Tags,
          label: "Inventory",
          path: "/inventory",
          active: location.pathname === "/inventory",
        },
      ],
    },
    {
      category: "CUSTOMERS",
      items: [
        {
          icon: Users,
          label: "Customers",
          path: "/customers",
          active: location.pathname === "/customers",
        },
      ],
    },
    {
      category: "ANALYTICS",
      items: [
        {
          icon: TrendingUp,
          label: "Analytics",
          path: "/analytics",
          active: location.pathname === "/analytics",
        },
        {
          icon: Settings,
          label: "Settings",
          path: "/settings",
          active: location.pathname === "/settings",
        },
      ],
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Call logout endpoint
      await api.post("/auth/logout");

      // Clear all storage
      sessionStorage.clear();
      localStorage.clear();

      // Clear axios default header
      delete api.defaults.headers.common["Authorization"];

      // Clear Zustand store
      logout();

      // Show success toast
      toast.success("Logged out successfully", {
        duration: 3000,
        position: "bottom-right",
      });

      // Close modal
      setIsLogoutModalOpen(false);

      // Redirect to login page
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error: any) {
      console.error("Logout error:", error);

      // Even if API call fails, clear local session
      sessionStorage.clear();
      localStorage.clear();
      delete api.defaults.headers.common["Authorization"];
      logout();

      toast.error("Logged out, but server error occurred", {
        duration: 4000,
        position: "bottom-right",
      });

      setIsLogoutModalOpen(false);

      setTimeout(() => {
        navigate("/");
      }, 500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Listen for sidebar toggle events from Topbar
  if (typeof window !== "undefined") {
    window.addEventListener("toggleSidebar", () => {
      setIsOpen(!isOpen);
    });
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-[80px] px-2 flex items-center border-b border-black/10">
        <Link to="/home" className="block" onClick={() => setIsOpen(false)}>
          <div className="flex items-center gap-2">
            <div>
              <img
                src="/images/logo_dark.png"
                alt=""
                className="h-14 object-contain"
              />
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {mainMenu.map((section, idx) => (
          <div key={idx} className="mb-6">
            <p className="text-[8px] tracking-[0.2em] uppercase text-black/30 px-4 mb-2">
              {section.category}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 transition-all duration-200 ${
                      item.active ? "bg-black text-white" : "hover:bg-black/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-4 h-4 ${item.active ? "text-white" : "text-black/50"}`}
                      />
                      <span
                        className={`text-[11px] tracking-[0.1em] font-light ${
                          item.active ? "text-white" : "text-black/70"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {item.active && (
                      <div className="w-1 h-1 bg-white rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-black/10">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-black/5 transition-all duration-200 text-black/60"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[11px] tracking-[0.1em] font-light">
            Logout
          </span>
        </button>
      </div>
    </>
  );

  // Logout Modal Component
  const LogoutModal = () => {
    if (!isLogoutModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => !isLoggingOut && setIsLogoutModalOpen(false)}
        />

        {/* Modal */}
        <div className="relative bg-white w-full max-w-md mx-4 p-6 border border-black/10">
          {/* Close button */}
          <button
            onClick={() => !isLoggingOut && setIsLogoutModalOpen(false)}
            className="absolute top-4 right-4 text-black/40 hover:text-black/60 transition-colors"
            disabled={isLoggingOut}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-5 h-5 text-black/60" />
            </div>
            <h3 className="text-lg font-light text-black tracking-tight">
              Sign Out
            </h3>
            <p className="text-xs text-black/40 mt-2 tracking-wide">
              Are you sure you want to sign out of your account?
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              disabled={isLoggingOut}
              className="flex-1 py-3 border border-black/20 text-black/60 text-sm uppercase tracking-wider hover:border-black/40 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <svg
                    className="animate-spin h-3 w-3 text-white"
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
                  <span>Signing out...</span>
                </>
              ) : (
                "Sign Out"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Slide out */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-black/10 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-black/60" />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar - Always visible */}
      <aside className="hidden lg:flex lg:w-72 bg-white border-r border-black/10 flex-col">
        <SidebarContent />
      </aside>

      {/* Logout Modal */}
      <LogoutModal />
    </>
  );
};

export default Sidebar;
