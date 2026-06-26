// components/common/Topbar.tsx
import { User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Topbar = () => {
  const { user } = useAuthStore();

  const toggleSidebar = () => {
    const event = new CustomEvent("toggleSidebar");
    window.dispatchEvent(event);
  };

  return (
    <>
      <header className="border-b border-black/10 h-20 px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Left - Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-black/5 transition-colors rounded-md"
        >
          <Menu className="w-4 h-4 text-black/60" />
        </button>

        {/* Right Icons */}
        <div className="flex ml-auto items-center gap-1 md:gap-3">
          <Link to="/settings" className="ml-1">
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-[10px] tracking-[0.1em] uppercase text-black/60 font-light">
                  {user?.fullName || "Current User"}
                </p>
                <p className="text-[8px] tracking-[0.15em] uppercase text-black/30">
                  {user?.role || "Current Role"}
                </p>
              </div>
              <div className="w-7 h-7 md:w-8 md:h-8 border border-black/20 rounded-full overflow-hidden flex items-center justify-center hover:bg-black/5 transition-colors">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-black/60" />
                )}
              </div>
            </div>
          </Link>
        </div>
      </header>
    </>
  );
};

export default Topbar;
