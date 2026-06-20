import { Trash2, Pencil } from "lucide-react";
import type { Variant } from "../../types/product";

interface VariantTableProps {
  variants: Variant[];
  editingIndex?: number;
  onEditVariant: (index: number) => void;
  onRemoveVariant: (index: number) => void;
}

const VariantTable = ({
  variants,
  editingIndex,
  onEditVariant,
  onRemoveVariant,
}: VariantTableProps) => {
  if (variants.length === 0) return null;

  return (
    <div className="border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs text-gray-500 font-normal">#</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500 font-normal">Color</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500 font-normal">Size</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500 font-normal">SKU</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500 font-normal">Price</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500 font-normal">Stock</th>
            <th className="px-3 py-2 text-center text-xs text-gray-500 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {variants.map((variant, idx) => {
            const isEditing = editingIndex === idx;
            return (
              <tr
                key={variant.id || idx}
                className={isEditing ? "bg-amber-50 border-l-2 border-l-amber-400" : ""}
              >
                <td className="px-3 py-2 text-xs text-gray-400">{idx + 1}</td>
                <td className="px-3 py-2 text-xs">{variant.color}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {(variant.sizes || []).map((s) => (
                      <span key={s} className="inline-flex px-1.5 py-0.5 bg-gray-100 text-[10px] font-medium text-gray-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-gray-500">{variant.sku}</td>
                <td className="px-3 py-2 text-xs font-medium">
                  ₦{(variant.price / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-3 py-2 text-xs text-gray-600">{variant.stock}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditVariant(idx)}
                      title="Edit variant"
                      className={`transition ${isEditing ? "text-amber-500" : "text-gray-400 hover:text-black"}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveVariant(idx)}
                      title="Remove variant"
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VariantTable;
