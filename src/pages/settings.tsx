// pages/Settings.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import {
  User,
  Store,
  Bell,
  Shield,
  Palette,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  CheckCircle,
  Camera,
  Truck,
  DollarSign,
  Percent,
  Globe,
  Clock,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  LogOut,
} from "lucide-react";

interface SettingSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    firstName: "Dele",
    lastName: "Teryima",
    email: "dele@teryima.com",
    phone: "+44 7911 123456",
    bio: "Fashion brand owner and creative director with 8+ years of experience in luxury fashion.",
    timezone: "Europe/London",
    language: "English",
    avatar: "/images/avatar-placeholder.png",
  });

  // Store Settings
  const [store, setStore] = useState({
    storeName: "TERYIMA FASHION HOUSE",
    storeEmail: "hello@teryima.com",
    storePhone: "+44 7911 123456",
    address: "123 Fashion Avenue",
    city: "London",
    postalCode: "WC1A 1AB",
    country: "United Kingdom",
    currency: "GBP",
    taxRate: 20,
    shippingFee: 5.99,
    freeShippingThreshold: 50,
    timezone: "Europe/London",
  });

  // Brand Settings
  const [brand, setBrand] = useState({
    logo: "/images/logo5.png",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#c4a747",
    fontHeading: "Times New Roman",
    fontBody: "Inter",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    lowStock: true,
    customerFeedback: false,
    marketingEmails: false,
    securityAlerts: true,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  const sections: SettingSection[] = [
    {
      id: "profile",
      name: "Profile",
      icon: <User className="w-4 h-4" />,
      description: "Your personal information",
    },
    {
      id: "store",
      name: "Store Settings",
      icon: <Store className="w-4 h-4" />,
      description: "Manage your store details",
    },
    {
      id: "brand",
      name: "Brand Identity",
      icon: <Palette className="w-4 h-4" />,
      description: "Customize your brand look",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      description: "Manage alerts and emails",
    },
    {
      id: "security",
      name: "Security",
      icon: <Shield className="w-4 h-4" />,
      description: "Password and security",
    },
  ];

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 1000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 border border-gray-200 flex items-center justify-center relative group">
                  <span className="text-2xl font-light text-gray-600">
                    {profile.firstName.charAt(0)}
                    {profile.lastName.charAt(0)}
                  </span>
                  <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                  <button className="mt-2 text-xs text-black border border-gray-200 px-3 py-1 hover:border-black transition">
                    Upload
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    setProfile({ ...profile, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    setProfile({ ...profile, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Timezone
                </label>
                <select
                  value={profile.timezone}
                  onChange={(e) =>
                    setProfile({ ...profile, timezone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
                >
                  <option>Europe/London</option>
                  <option>Europe/Paris</option>
                  <option>America/New_York</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Language
                </label>
                <select
                  value={profile.language}
                  onChange={(e) =>
                    setProfile({ ...profile, language: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
                >
                  <option>English</option>
                  <option>French</option>
                  <option>Spanish</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "store":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={store.storeName}
                  onChange={(e) =>
                    setStore({ ...store, storeName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Store Email
                </label>
                <input
                  type="email"
                  value={store.storeEmail}
                  onChange={(e) =>
                    setStore({ ...store, storeEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Store Phone
                </label>
                <input
                  type="tel"
                  value={store.storePhone}
                  onChange={(e) =>
                    setStore({ ...store, storePhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={store.address}
                  onChange={(e) =>
                    setStore({ ...store, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">City</label>
                <input
                  type="text"
                  value={store.city}
                  onChange={(e) => setStore({ ...store, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={store.postalCode}
                  onChange={(e) =>
                    setStore({ ...store, postalCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Country
                </label>
                <select
                  value={store.country}
                  onChange={(e) =>
                    setStore({ ...store, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
                >
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>France</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Currency
                </label>
                <select
                  value={store.currency}
                  onChange={(e) =>
                    setStore({ ...store, currency: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
                >
                  <option>GBP (£)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={store.taxRate}
                  onChange={(e) =>
                    setStore({ ...store, taxRate: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Shipping Fee (£)
                </label>
                <input
                  type="number"
                  value={store.shippingFee}
                  onChange={(e) =>
                    setStore({ ...store, shippingFee: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Free Shipping Threshold (£)
                </label>
                <input
                  type="number"
                  value={store.freeShippingThreshold}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      freeShippingThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                />
              </div>
            </div>
          </div>
        );

      case "brand":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Store Logo
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={brand.logo}
                    alt="Logo"
                    className="w-24 h-12 object-contain"
                  />
                  <button className="text-xs border border-gray-200 px-3 py-1 hover:border-black transition">
                    Change Logo
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 border border-gray-200"
                    style={{ backgroundColor: brand.primaryColor }}
                  />
                  <input
                    type="text"
                    value={brand.primaryColor}
                    onChange={(e) =>
                      setBrand({ ...brand, primaryColor: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 border border-gray-200"
                    style={{ backgroundColor: brand.secondaryColor }}
                  />
                  <input
                    type="text"
                    value={brand.secondaryColor}
                    onChange={(e) =>
                      setBrand({ ...brand, secondaryColor: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 border border-gray-200"
                    style={{ backgroundColor: brand.accentColor }}
                  />
                  <input
                    type="text"
                    value={brand.accentColor}
                    onChange={(e) =>
                      setBrand({ ...brand, accentColor: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Heading Font
                </label>
                <select
                  value={brand.fontHeading}
                  onChange={(e) =>
                    setBrand({ ...brand, fontHeading: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
                >
                  <option>Times New Roman</option>
                  <option>Playfair Display</option>
                  <option>Montserrat</option>
                  <option>Georgia</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Body Font
                </label>
                <select
                  value={brand.fontBody}
                  onChange={(e) =>
                    setBrand({ ...brand, fontBody: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
                >
                  <option>Inter</option>
                  <option>Helvetica</option>
                  <option>Arial</option>
                  <option>System UI</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">New Orders</p>
                <p className="text-xs text-gray-500">
                  Get notified when a new order is placed
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    newOrders: !notifications.newOrders,
                  })
                }
                className={`relative w-10 h-5 transition-colors ${notifications.newOrders ? "bg-black" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${notifications.newOrders ? "right-0.5" : "left-0.5"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Order Status Updates
                </p>
                <p className="text-xs text-gray-500">
                  Receive updates when order status changes
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    orderUpdates: !notifications.orderUpdates,
                  })
                }
                className={`relative w-10 h-5 transition-colors ${notifications.orderUpdates ? "bg-black" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${notifications.orderUpdates ? "right-0.5" : "left-0.5"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Low Stock Alerts
                </p>
                <p className="text-xs text-gray-500">
                  Alert when product stock is running low
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    lowStock: !notifications.lowStock,
                  })
                }
                className={`relative w-10 h-5 transition-colors ${notifications.lowStock ? "bg-black" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${notifications.lowStock ? "right-0.5" : "left-0.5"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Customer Feedback
                </p>
                <p className="text-xs text-gray-500">
                  Receive customer reviews and feedback
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    customerFeedback: !notifications.customerFeedback,
                  })
                }
                className={`relative w-10 h-5 transition-colors ${notifications.customerFeedback ? "bg-black" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${notifications.customerFeedback ? "right-0.5" : "left-0.5"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Marketing Emails
                </p>
                <p className="text-xs text-gray-500">
                  Weekly marketing insights and reports
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    marketingEmails: !notifications.marketingEmails,
                  })
                }
                className={`relative w-10 h-5 transition-colors ${notifications.marketingEmails ? "bg-black" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${notifications.marketingEmails ? "right-0.5" : "left-0.5"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Security Alerts
                </p>
                <p className="text-xs text-gray-500">
                  Important security notifications
                </p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    securityAlerts: !notifications.securityAlerts,
                  })
                }
                className={`relative w-10 h-5 transition-colors ${notifications.securityAlerts ? "bg-black" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${notifications.securityAlerts ? "right-0.5" : "left-0.5"}`}
                />
              </button>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Change Password
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={security.currentPassword}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={security.newPassword}
                    onChange={(e) =>
                      setSecurity({ ...security, newPassword: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
                <button className="text-sm border border-gray-200 px-4 py-1.5 hover:border-black transition">
                  Update Password
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Two-Factor Authentication
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Add an extra layer of security
                  </p>
                  <p className="text-xs text-gray-500">
                    Require a verification code when logging in
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSecurity({
                      ...security,
                      twoFactorEnabled: !security.twoFactorEnabled,
                    })
                  }
                  className={`relative w-10 h-5 transition-colors ${security.twoFactorEnabled ? "bg-black" : "bg-gray-300"}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white transition-transform ${security.twoFactorEnabled ? "right-0.5" : "left-0.5"}`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Active Sessions
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-700">Chrome on Windows</p>
                    <p className="text-[10px] text-gray-400">
                      London, United Kingdom • Last active 2 minutes ago
                    </p>
                  </div>
                  <button className="text-xs text-red-500 hover:text-red-600">
                    Revoke
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-gray-700">Safari on iPhone</p>
                    <p className="text-[10px] text-gray-400">
                      London, United Kingdom • Last active 2 days ago
                    </p>
                  </div>
                  <button className="text-xs text-red-500 hover:text-red-600">
                    Revoke
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-4">
                Danger Zone
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Delete Account</p>
                  <p className="text-xs text-gray-500">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button className="text-sm border border-red-200 text-red-600 px-4 py-1.5 hover:bg-red-50 transition">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Settings</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-gray-500 mt-3">
              Manage your account and store preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {showSaveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 text-green-600 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Settings saved</span>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>

        {/* Settings Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="border border-gray-200">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                    activeSection === section.id
                      ? "bg-black text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span
                    className={
                      activeSection === section.id
                        ? "text-white"
                        : "text-gray-400"
                    }
                  >
                    {section.icon}
                  </span>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${activeSection === section.id ? "text-white" : "text-gray-900"}`}
                    >
                      {section.name}
                    </p>
                    <p
                      className={`text-[10px] ${activeSection === section.id ? "text-white/60" : "text-gray-400"}`}
                    >
                      {section.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white border border-gray-200 p-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
