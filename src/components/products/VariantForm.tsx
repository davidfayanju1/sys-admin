// components/products/VariantForm.tsx
import { PlusCircle } from "lucide-react";
import type { Variant } from "../../types/product";

interface VariantFormProps {
  variant: Omit<Variant, "id">;
  onVariantChange: (variant: Omit<Variant, "id">) => void;
  onAddVariant: () => void;
}

const VariantForm = ({
  variant,
  onVariantChange,
  onAddVariant,
}: VariantFormProps) => {
  return (
    <div className="bg-gray-50 p-4 border border-gray-200 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Color"
          value={variant.color}
          onChange={(e) =>
            onVariantChange({ ...variant, color: e.target.value })
          }
          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
        />
        <input
          type="text"
          placeholder="Size"
          value={variant.size}
          onChange={(e) =>
            onVariantChange({ ...variant, size: e.target.value })
          }
          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
        />
        <input
          type="text"
          placeholder="SKU"
          value={variant.sku}
          onChange={(e) => onVariantChange({ ...variant, sku: e.target.value })}
          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
        />
        <input
          type="number"
          placeholder="Price (£)"
          value={variant.price || ""}
          onChange={(e) =>
            onVariantChange({ ...variant, price: parseFloat(e.target.value) })
          }
          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
        />
        <input
          type="number"
          placeholder="Stock"
          value={variant.stock || ""}
          onChange={(e) =>
            onVariantChange({ ...variant, stock: parseInt(e.target.value) })
          }
          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
        />
      </div>
      <button
        onClick={onAddVariant}
        className="mt-3 flex items-center gap-2 text-sm text-black border border-gray-200 px-4 py-2 hover:border-black transition"
      >
        <PlusCircle className="w-4 h-4" />
        Add Variant
      </button>
    </div>
  );
};

export default VariantForm;
