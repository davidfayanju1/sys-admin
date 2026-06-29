import { useRef } from "react";
import { Camera, RefreshCw } from "lucide-react";

interface ProfileSectionProps {
  profile: any;
  onProfileChange: (profile: any) => void;
  onAvatarSelect: (file: File) => void;
  isUploading: boolean;
}

const ProfileSection = ({
  profile,
  onProfileChange,
  onAvatarSelect,
  isUploading,
}: ProfileSectionProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const set = (key: string, value: string) =>
    onProfileChange({ ...profile, [key]: value });

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 bg-gray-100 border border-gray-200 flex items-center justify-center relative group cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-light text-gray-600">
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              {isUploading ? (
                <RefreshCw className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">JPG, PNG or WebP. Max size 10MB.</p>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => avatarInputRef.current?.click()}
              className="mt-2 text-xs text-black border border-gray-200 px-3 py-1 hover:border-black transition disabled:opacity-40"
            >
              {isUploading ? "Uploading…" : "Upload Photo"}
            </button>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onAvatarSelect(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">First Name</label>
          <input
            type="text"
            value={profile.firstName || ""}
            onChange={(e) => set("firstName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Last Name</label>
          <input
            type="text"
            value={profile.lastName || ""}
            onChange={(e) => set("lastName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={profile.email || ""}
            disabled
            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 outline-none text-sm cursor-not-allowed"
          />
          <p className="text-[9px] text-gray-400 mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Phone</label>
          <input
            type="tel"
            value={profile.phone || ""}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Bio</label>
          <textarea
            value={profile.bio || ""}
            onChange={(e) => set("bio", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Timezone</label>
          <select
            value={profile.timezone || "Europe/London"}
            onChange={(e) => set("timezone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
          >
            <option>Europe/London</option>
            <option>Europe/Paris</option>
            <option>America/New_York</option>
            <option>Asia/Tokyo</option>
            <option>Africa/Lagos</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Language</label>
          <select
            value={profile.language || "English"}
            onChange={(e) => set("language", e.target.value)}
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
};

export default ProfileSection;
