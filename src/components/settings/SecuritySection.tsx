import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SecurityForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecuritySectionProps {
  security: SecurityForm;
  onSecurityChange: (s: SecurityForm) => void;
  onChangePassword: () => void;
  isChangingPassword: boolean;
  twoFactorEnabled: boolean;
  onTwoFactorToggle: () => void;
}

const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const SecuritySection = ({
  security,
  onSecurityChange,
  onChangePassword,
  isChangingPassword,
  twoFactorEnabled,
  onTwoFactorToggle,
}: SecuritySectionProps) => {
  const set = (key: keyof SecurityForm, value: string) =>
    onSecurityChange({ ...security, [key]: value });

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Change Password</h4>
        <div className="space-y-3">
          <PasswordField
            label="Current Password"
            value={security.currentPassword}
            onChange={(v) => set("currentPassword", v)}
            placeholder="Enter current password"
          />
          <PasswordField
            label="New Password"
            value={security.newPassword}
            onChange={(v) => set("newPassword", v)}
            placeholder="Enter new password"
          />
          <PasswordField
            label="Confirm New Password"
            value={security.confirmPassword}
            onChange={(v) => set("confirmPassword", v)}
            placeholder="Confirm new password"
          />
          <button
            onClick={onChangePassword}
            disabled={isChangingPassword}
            className="text-sm border border-gray-200 px-4 py-1.5 hover:border-black transition disabled:opacity-50"
          >
            {isChangingPassword ? "Updating…" : "Update Password"}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Two-Factor Authentication
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">Add an extra layer of security</p>
            <p className="text-xs text-gray-500">
              Require a verification code when logging in
            </p>
          </div>
          <button
            type="button"
            onClick={onTwoFactorToggle}
            role="switch"
            aria-checked={twoFactorEnabled}
            className={`relative w-10 h-5 shrink-0 transition-colors ${twoFactorEnabled ? "bg-black" : "bg-gray-300"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${twoFactorEnabled ? "right-0.5" : "left-0.5"}`}
            />
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Active Sessions</h4>
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-700">Current Session</p>
            <p className="text-[10px] text-gray-400">This device · Active now</p>
          </div>
          <span className="text-xs text-green-600">Current</span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Danger Zone</h4>
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
};

export default SecuritySection;
