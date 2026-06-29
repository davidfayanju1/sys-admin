import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import { User, Shield, Save, RefreshCw, CheckCircle } from "lucide-react";
import {
  useSettings,
  useUpdateSettings,
  useChangePassword,
} from "../hooks/useSettings";
import { useUploadMedia } from "../hooks/useMedia";
import { toast } from "sonner";
import ProfileSection from "../components/settings/ProfileSection";
import StoreSection from "../components/settings/StoreSection";
import BrandSection from "../components/settings/BrandSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import SecuritySection from "../components/settings/SecuritySection";

interface SettingSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const SettingsSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6">
    <div className="lg:w-64 shrink-0">
      <div className="border border-gray-200">
        {[1, 2].map((i) => (
          <div key={i} className="px-4 py-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-2 bg-gray-200 rounded w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 bg-white border border-gray-200 p-6">
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-3 bg-gray-200 rounded w-20 mb-1" />
              <div className="h-9 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const sections: SettingSection[] = [
  {
    id: "profile",
    name: "Profile",
    icon: <User className="w-4 h-4" />,
    description: "Your personal information",
  },
  // {
  //   id: "store",
  //   name: "Store Settings",
  //   icon: <Store className="w-4 h-4" />,
  //   description: "Manage your store details",
  // },
  // {
  //   id: "brand",
  //   name: "Brand Identity",
  //   icon: <Palette className="w-4 h-4" />,
  //   description: "Customize your brand look",
  // },
  // {
  //   id: "notifications",
  //   name: "Notifications",
  //   icon: <Bell className="w-4 h-4" />,
  //   description: "Manage alerts and emails",
  // },
  {
    id: "security",
    name: "Security",
    icon: <Shield className="w-4 h-4" />,
    description: "Password and security",
  },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [profile, setProfile] = useState<any>({});
  const [store, setStore] = useState<any>({});
  const [brand, setBrand] = useState<any>({});
  const [notifications, setNotifications] = useState<any>({});
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { data: settings, isLoading, error } = useSettings();
  const updateSettings = useUpdateSettings();
  const changePassword = useChangePassword();
  const uploadMedia = useUploadMedia();

  useEffect(() => {
    if (settings) {
      if (settings.profile) setProfile(settings.profile);
      if (settings.store) setStore(settings.store);
      if (settings.brand) setBrand(settings.brand);
      if (settings.notifications) setNotifications(settings.notifications);
    }
  }, [settings]);

  const handleImageUpload = (file: File, onSuccess: (url: string) => void) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    uploadMedia.mutate(fd, {
      onSuccess: (res) => {
        onSuccess(res.data.url);
        toast.success("Image uploaded");
      },
      onError: () => toast.error("Upload failed. Please try again."),
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const updateData: any = {};
    switch (activeSection) {
      case "profile":       updateData.profile = profile;             break;
      case "store":         updateData.store = store;                 break;
      case "brand":         updateData.brand = brand;                 break;
      case "notifications": updateData.notifications = notifications; break;
    }
    await updateSettings.mutateAsync(updateData);
    setIsSaving(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleChangePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (security.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    await changePassword.mutateAsync({
      currentPassword: security.currentPassword,
      newPassword: security.newPassword,
    });
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleTwoFactorToggle = async () => {
    await updateSettings.mutateAsync({
      security: { twoFactorEnabled: !settings?.security?.twoFactorEnabled },
    });
  };

  const renderSection = () => {
    if (isLoading) return <SettingsSkeleton />;

    switch (activeSection) {
      case "profile":
        return (
          <ProfileSection
            profile={profile}
            onProfileChange={setProfile}
            onAvatarSelect={(file) =>
              handleImageUpload(file, (url) => setProfile({ ...profile, avatar: url }))
            }
            isUploading={uploadMedia.isPending}
          />
        );
      case "store":
        return <StoreSection store={store} onStoreChange={setStore} />;
      case "brand":
        return (
          <BrandSection
            brand={brand}
            onBrandChange={setBrand}
            onLogoSelect={(file) =>
              handleImageUpload(file, (url) => setBrand({ ...brand, logo: url }))
            }
            isUploading={uploadMedia.isPending}
          />
        );
      case "notifications":
        return (
          <NotificationsSection
            notifications={notifications}
            onNotificationsChange={setNotifications}
          />
        );
      case "security":
        return (
          <SecuritySection
            security={security}
            onSecurityChange={setSecurity}
            onChangePassword={handleChangePassword}
            isChangingPassword={changePassword.isPending}
            twoFactorEnabled={!!settings?.security?.twoFactorEnabled}
            onTwoFactorToggle={handleTwoFactorToggle}
          />
        );
      default:
        return null;
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500">Failed to load settings</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-black text-white text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            {activeSection !== "security" && (
              <button
                onClick={handleSaveSettings}
                disabled={isSaving || updateSettings.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition disabled:opacity-50"
              >
                {isSaving || updateSettings.isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Settings Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
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
                      activeSection === section.id ? "text-white" : "text-gray-400"
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
