// components/products/ProductTableRow.tsx
import { Edit, Copy, Trash2 } from "lucide-react";
import type { Product } from "../../types/product";
import RowActionMenu from "../UI/RowActionMenu";

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDuplicate: (id: string) => void;
  onDelete: (product: Product) => void;
}

const ProductTableRow = ({
  product,
  onEdit,
  onDuplicate,
  onDelete,
}: ProductTableRowProps) => {
  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-green-100 text-green-700">
            Active
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600">
            Draft
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-red-100 text-red-700">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  const getTotalStock = (variants: Product["variants"]) => {
    return variants.reduce((sum, v) => sum + v.stock, 0);
  };

  const getPriceRange = (variants: Product["variants"]) => {
    const prices = variants.map((v) => v.price / 100);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const currency = "₦";
    return min === max
      ? `${currency}${min.toFixed(2)}`
      : `${currency}${min.toFixed(2)} - ${currency}${max.toFixed(2)}`;
  };

  const getVariantSummary = (variants: Product["variants"]) => {
    const colors = [...new Set(variants.map((v) => v.color))];
    const sizes = [...new Set(variants.flatMap((v) => v.sizes || []))];
    return `${colors.length} color${colors.length !== 1 ? "s" : ""} • ${sizes.length} size${sizes.length !== 1 ? "s" : ""}`;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={
              product.primaryImage ||
              "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
            }
            alt={product.title}
            className="w-10 h-10 object-cover bg-gray-100"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{product.title}</p>
            <p className="text-[10px] text-gray-400 max-w-xs truncate">
              {product.description}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-xs text-gray-600">
          {product.variants.length} variants
        </p>
        <p className="text-[9px] text-gray-400">
          {getVariantSummary(product.variants)}
        </p>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-gray-900">
          {getPriceRange(product.variants)}
        </span>
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-sm ${getTotalStock(product.variants) === 0 ? "text-red-500" : "text-gray-600"}`}
        >
          {getTotalStock(product.variants)} units
        </span>
      </td>
      <td className="px-4 py-3">{getStatusBadge(product.status)}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end">
          <RowActionMenu
            actions={[
              { icon: Edit, label: "Edit", onClick: () => onEdit(product) },
              { icon: Copy, label: "Duplicate", onClick: () => onDuplicate(product.id) },
              { icon: Trash2, label: "Delete", onClick: () => onDelete(product), destructive: true },
            ]}
          />
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
