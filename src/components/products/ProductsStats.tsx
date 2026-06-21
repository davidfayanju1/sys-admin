// components/products/ProductStats.tsx
import { Package, ShoppingBag, Layers, AlertTriangle } from "lucide-react";
import type { ProductSummary } from "../../services/productService";

interface ProductStatsProps {
  summary: ProductSummary | undefined;
  isLoading?: boolean;
}

const ProductStats = ({ summary, isLoading }: ProductStatsProps) => {
  const stats = [
    {
      label: "Total Products",
      value: summary?.total || 0,
      icon: Package,
      color: "text-gray-600",
    },
    {
      label: "Active",
      value: summary?.active || 0,
      icon: ShoppingBag,
      color: "text-gray-600",
    },
    {
      label: "Total Variants",
      value: summary?.totalVariants || 0,
      icon: Layers,
      color: "text-gray-600",
    },
    {
      label: "Low Stock (<5)",
      value: summary?.lowStock || 0,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 p-3 animate-pulse"
          >
            <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-xl font-semibold mt-1 ${stat.color}`}>
              {stat.value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ProductStats;
