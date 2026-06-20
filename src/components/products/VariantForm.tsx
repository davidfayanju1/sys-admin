import { useState } from "react";
import { PlusCircle, Wand2, X, ChevronDown, HelpCircle, Check } from "lucide-react";
import type { Variant } from "../../types/product";

export const SIZES = ["SM", "MD", "LG", "L", "XL", "2XL", "3XL"] as const;

const SIZE_GUIDE = [
  { size: "SM",  chest: "86–91",   waist: "71–76",   hips: "91–96"  },
  { size: "MD",  chest: "96–101",  waist: "81–86",   hips: "99–104" },
  { size: "LG",  chest: "107–112", waist: "91–96",   hips: "107–112"},
  { size: "L",   chest: "107–112", waist: "91–96",   hips: "107–112"},
  { size: "XL",  chest: "117–122", waist: "101–106", hips: "117–122"},
  { size: "2XL", chest: "127–132", waist: "111–116", hips: "127–132"},
  { size: "3XL", chest: "137–142", waist: "121–126", hips: "137–142"},
];

const generateSKU = (color: string, size: string): string => {
  const c = (color || "XXX").replace(/\s+/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const s = (size || "XX").replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 3).padEnd(2, "X");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${c}-${s}-${rand}`;
};

interface VariantFormProps {
  variant: Omit<Variant, "id">;
  onVariantChange: (variant: Omit<Variant, "id">) => void;
  onAddVariant: () => void;
  isEditing?: boolean;
  editingIndex?: number;
  onUpdateVariant?: () => void;
  onCancelEdit?: () => void;
}

const VariantForm = ({
  variant,
  onVariantChange,
  onAddVariant,
  isEditing = false,
  editingIndex,
  onUpdateVariant,
  onCancelEdit,
}: VariantFormProps) => {
  const [showGuide, setShowGuide] = useState(false);

  const inputCls =
    "w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white";

  return (
    <div className="border border-gray-200 mb-4 overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <p className="text-xs font-medium text-gray-700">
          {isEditing ? `Editing Variant #${(editingIndex ?? 0) + 1}` : "Add Variant"}
        </p>
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-black transition"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Row 1: Color + Size */}
        <div className="grid grid-cols-2 gap-3">
          {/* Color */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
              Color
            </label>
            <input
              type="text"
              placeholder="e.g. Midnight Black"
              value={variant.color}
              onChange={(e) => onVariantChange({ ...variant, color: e.target.value })}
              className={inputCls}
            />
          </div>

          {/* Size */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase tracking-wider text-gray-400">
                Size
              </label>
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-black transition"
              >
                <HelpCircle className="w-3 h-3" />
                Size Guide
              </button>
            </div>
            <div className="relative">
              <select
                value={variant.size}
                onChange={(e) => onVariantChange({ ...variant, size: e.target.value })}
                className={`${inputCls} appearance-none pr-8 cursor-pointer`}
              >
                <option value="">Select size…</option>
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Size Guide */}
        {showGuide && (
          <div className="border border-gray-200 bg-white">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
              <p className="text-[10px] uppercase tracking-wider font-medium text-gray-600">
                Size Guide — Measurements in cm
              </p>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-gray-400 hover:text-black transition"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Size</th>
                  <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Chest</th>
                  <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Waist</th>
                  <th className="px-3 py-1.5 text-left text-gray-500 font-normal">Hips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {SIZE_GUIDE.map((row) => (
                  <tr
                    key={row.size}
                    className={variant.size === row.size ? "bg-black text-white" : "hover:bg-gray-50"}
                  >
                    <td className="px-3 py-1.5 font-medium">{row.size}</td>
                    <td className="px-3 py-1.5">{row.chest}</td>
                    <td className="px-3 py-1.5">{row.waist}</td>
                    <td className="px-3 py-1.5">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-3 py-2 text-[9px] text-gray-400 border-t border-gray-100">
              All measurements are approximate. Fit may vary by style.
            </p>
          </div>
        )}

        {/* Row 2: SKU + Price + Stock */}
        <div className="grid grid-cols-3 gap-3">
          {/* SKU */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
              SKU
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="Auto or type…"
                value={variant.sku}
                onChange={(e) => onVariantChange({ ...variant, sku: e.target.value })}
                className="flex-1 min-w-0 px-3 py-2 border border-gray-200 border-r-0 focus:border-black outline-none text-sm font-mono"
              />
              <button
                type="button"
                title="Generate SKU"
                onClick={() =>
                  onVariantChange({
                    ...variant,
                    sku: generateSKU(variant.color, variant.size),
                  })
                }
                className="px-2.5 border border-gray-200 bg-gray-50 hover:bg-black hover:text-white hover:border-black transition text-gray-500 shrink-0"
              >
                <Wand2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
              Price (₦)
            </label>
            <input
              type="number"
              placeholder="0"
              min={0}
              value={variant.price || ""}
              onChange={(e) =>
                onVariantChange({ ...variant, price: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1">
              Stock
            </label>
            <input
              type="number"
              placeholder="0"
              min={0}
              value={variant.stock || ""}
              onChange={(e) =>
                onVariantChange({ ...variant, stock: parseInt(e.target.value) || 0 })
              }
              className={inputCls}
            />
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-1">
          {isEditing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancelEdit}
                className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-2 text-gray-600 hover:border-black transition"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                type="button"
                onClick={onUpdateVariant}
                className="flex items-center gap-1.5 text-xs bg-black text-white px-4 py-2 hover:bg-black/80 transition"
              >
                <Check className="w-3.5 h-3.5" />
                Update Variant
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAddVariant}
              className="flex items-center gap-2 text-xs border border-gray-200 px-4 py-2 hover:border-black transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Variant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantForm;
