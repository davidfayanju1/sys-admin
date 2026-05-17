// components/common/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
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
  MessageSquare,
  X,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
        // {
        //   icon: MessageSquare,
        //   label: "Reviews",
        //   path: "/reviews",
        //   active: location.pathname === "/reviews",
        // },
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
        <Link
          to="/dashboard"
          className="block"
          onClick={() => setIsOpen(false)}
        >
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
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-black/5 transition-all duration-200 text-black/60">
          <LogOut className="w-4 h-4" />
          <span className="text-[11px] tracking-[0.1em] font-light">
            Logout
          </span>
        </button>
      </div>
    </>
  );

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
    </>
  );
};

export default Sidebar;
