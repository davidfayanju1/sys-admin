// components/products/VariantTable.tsx
import { Trash2 } from "lucide-react";
import type { Variant } from "../../types/product";

interface VariantTableProps {
  variants: Variant[];
  onRemoveVariant: (index: number) => void;
}

const VariantTable = ({ variants, onRemoveVariant }: VariantTableProps) => {
  if (variants.length === 0) return null;

  return (
    <div className="border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs text-gray-500">Color</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500">Size</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500">SKU</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500">Price</th>
            <th className="px-3 py-2 text-left text-xs text-gray-500">Stock</th>
            <th className="px-3 py-2 text-center text-xs text-gray-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {variants.map((variant, idx) => (
            <tr key={variant.id}>
              <td className="px-3 py-2">{variant.color}</td>
              <td className="px-3 py-2">{variant.size}</td>
              <td className="px-3 py-2 font-mono text-xs">{variant.sku}</td>
              <td className="px-3 py-2">
                ₦
                {(variant.price / 100).toFixed(2)}
              </td>
              <td className="px-3 py-2">{variant.stock}</td>
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => onRemoveVariant(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantTable;
