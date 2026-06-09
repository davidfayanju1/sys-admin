// components/products/ProductSearchFilters.tsx
import { Search } from "lucide-react";

interface ProductSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const ProductSearchFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: ProductSearchFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-black outline-none text-sm"
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );
};

export default ProductSearchFilters;
