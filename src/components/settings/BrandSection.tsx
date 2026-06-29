import { useRef } from "react";
import { RefreshCw } from "lucide-react";

interface BrandSectionProps {
  brand: any;
  onBrandChange: (brand: any) => void;
  onLogoSelect: (file: File) => void;
  isUploading: boolean;
}

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 border border-gray-200 p-0.5 cursor-pointer bg-white"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm font-mono"
        maxLength={7}
      />
    </div>
  </div>
);

const BrandSection = ({
  brand,
  onBrandChange,
  onLogoSelect,
  isUploading,
}: BrandSectionProps) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const set = (key: string, value: string) =>
    onBrandChange({ ...brand, [key]: value });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Logo */}
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-2">Store Logo</label>
          <div className="flex items-center gap-4">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt="Logo"
                className="w-24 h-12 object-contain border border-gray-100"
              />
            ) : (
              <div className="w-24 h-12 bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                No logo
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => logoInputRef.current?.click()}
                className="text-xs text-black border border-gray-200 px-3 py-1 hover:border-black transition disabled:opacity-40 flex items-center gap-1.5"
              >
                {isUploading && <RefreshCw className="w-3 h-3 animate-spin" />}
                {isUploading ? "Uploading…" : brand.logo ? "Change Logo" : "Upload Logo"}
              </button>
              {brand.logo && (
                <button
                  type="button"
                  onClick={() => onBrandChange({ ...brand, logo: "" })}
                  className="text-[10px] text-red-400 hover:text-red-600 text-left transition"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onLogoSelect(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        {/* Colors */}
        <ColorField
          label="Primary Color"
          value={brand.primaryColor || "#000000"}
          onChange={(v) => set("primaryColor", v)}
        />
        <ColorField
          label="Secondary Color"
          value={brand.secondaryColor || "#ffffff"}
          onChange={(v) => set("secondaryColor", v)}
        />
        <ColorField
          label="Accent Color"
          value={brand.accentColor || "#c4a747"}
          onChange={(v) => set("accentColor", v)}
        />

        {/* Fonts */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">Heading Font</label>
          <select
            value={brand.fontHeading || "Times New Roman"}
            onChange={(e) => set("fontHeading", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
          >
            <option>Times New Roman</option>
            <option>Playfair Display</option>
            <option>Montserrat</option>
            <option>Georgia</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Body Font</label>
          <select
            value={brand.fontBody || "Inter"}
            onChange={(e) => set("fontBody", e.target.value)}
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
};

export default BrandSection;
