// components/inventory/InventoryStats.tsx
import {
  Package,
  Layers,
  DollarSign,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { InventorySummary } from "../../types/inventory";

interface InventoryStatsProps {
  summary: InventorySummary | undefined;
  isLoading?: boolean;
}

const InventoryStats = ({ summary, isLoading }: InventoryStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100); // Assuming amount is in kobo/cents
  };

  const stats = [
    {
      label: "Total SKUs",
      value: summary?.totalSkus || 0,
      icon: Package,
      color: "text-gray-600",
    },
    {
      label: "Total Units",
      value: summary?.totalUnits || 0,
      icon: Layers,
      color: "text-gray-600",
    },
    {
      label: "Stock Value",
      value: summary?.stockValue || 0,
      icon: DollarSign,
      color: "text-gray-600",
      isCurrency: true,
    },
    {
      label: "Low Stock",
      value: summary?.lowStock || 0,
      icon: AlertTriangle,
      color: "text-yellow-600",
    },
    {
      label: "Out of Stock",
      value: summary?.outOfStock || 0,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 p-3 animate-pulse"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const displayValue = stat.isCurrency
          ? formatCurrency(stat.value)
          : stat.value.toLocaleString();

        return (
          <div key={stat.label} className="bg-white border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${stat.color}`} />
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
            <p className={`text-xl font-semibold ${stat.color}`}>
              {displayValue}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryStats;
