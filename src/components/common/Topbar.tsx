// components/common/Topbar.tsx
import { Search, User, Heart, ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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

        {/* Search - Desktop */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/30" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="w-full pl-10 pr-4 py-2 border border-black/10 bg-white focus:outline-none focus:border-black/30 transition-colors text-sm font-light"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Search - Mobile Button */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="lg:hidden p-2 hover:bg-black/5 transition-colors rounded-md"
          >
            <Search className="w-4 h-4 text-black/60" />
          </button>

          <Link
            to="/wishlist"
            className="p-2 hover:bg-black/5 transition-colors relative rounded-md"
          >
            <Heart className="w-4 h-4 text-black/60" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full"></span>
          </Link>

          <Link
            to="/cart"
            className="p-2 hover:bg-black/5 transition-colors relative rounded-md"
          >
            <ShoppingBag className="w-4 h-4 text-black/60" />
            <span className="absolute -top-1 -right-1 text-[8px] text-black/60 font-light">
              3
            </span>
          </Link>

          <Link
            to="/profile"
            className="ml-1 md:ml-2 pl-1 md:pl-2 border-l border-black/10"
          >
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <p className="text-[10px] tracking-[0.1em] uppercase text-black/60 font-light">
                  Dele Teryima
                </p>
                <p className="text-[8px] tracking-[0.15em] uppercase text-black/30">
                  Admin
                </p>
              </div>
              <div className="w-7 h-7 md:w-8 md:h-8 border border-black/20 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors">
                <User className="w-3.5 h-3.5 text-black/60" />
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile Search Modal */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 lg:hidden">
          <div className="p-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 hover:bg-black/5 rounded-md"
              >
                <svg
                  className="w-5 h-5 text-black/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/30" />
                <input
                  type="text"
                  placeholder="Search orders, products, customers..."
                  className="w-full pl-10 pr-4 py-2 border border-black/10 bg-white focus:outline-none focus:border-black/30 text-sm font-light"
                  autoFocus
                />
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[9px] tracking-[0.1em] uppercase text-black/30 mb-4">
              Recent Searches
            </p>
            <div className="space-y-3">
              {[
                "Summer Collection 2024",
                "Order #ORD-001",
                "Sarah Johnson",
              ].map((search, idx) => (
                <button
                  key={idx}
                  className="block w-full text-left text-sm text-black/60 py-2 hover:text-black"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
