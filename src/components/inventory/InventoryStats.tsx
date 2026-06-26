import { Package, Layers, Coins, AlertTriangle, XCircle } from "lucide-react";
import type { InventorySummary } from "../../types/inventory";

interface InventoryStatsProps {
  summary: InventorySummary | undefined;
  isLoading?: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const InventoryStats = ({ summary, isLoading }: InventoryStatsProps) => {
  const stats = [
    { label: "Total Materials", value: summary?.totalItems ?? 0, icon: Package, color: "text-black/60", fmt: false },
    { label: "Total Units", value: summary?.totalUnits ?? 0, icon: Layers, color: "text-black/60", fmt: false },
    { label: "Stock Value", value: summary?.stockValue ?? 0, icon: Coins, color: "text-black/60", fmt: true },
    { label: "Low Stock", value: summary?.lowStock ?? 0, icon: AlertTriangle, color: "text-yellow-600", fmt: false },
    { label: "Out of Stock", value: summary?.outOfStock ?? 0, icon: XCircle, color: "text-red-600", fmt: false },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-black/10 p-4 animate-pulse">
            <div className="h-3 bg-black/5 rounded w-24 mb-3" />
            <div className="h-6 bg-black/5 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white border border-black/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <p className="text-[10px] uppercase tracking-widest text-black/40">{stat.label}</p>
            </div>
            <p className={`text-xl font-light ${stat.color}`}>
              {stat.fmt ? fmt(stat.value) : stat.value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryStats;
