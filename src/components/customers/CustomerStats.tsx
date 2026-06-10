// components/customers/CustomerStats.tsx
import { Users, UserCheck, Star, DollarSign, TrendingUp } from "lucide-react";
import type { CustomerSummary } from "../../types/customer";

interface CustomerStatsProps {
  summary: CustomerSummary | undefined;
  isLoading?: boolean;
}

const CustomerStats = ({ summary, isLoading }: CustomerStatsProps) => {
  const stats = [
    {
      label: "Total Customers",
      value: summary?.total || 0,
      icon: Users,
      color: "text-gray-600",
    },
    {
      label: "Active",
      value: summary?.active || 0,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      label: "VIP Members",
      value: summary?.vip || 0,
      icon: Star,
      color: "text-amber-600",
    },
    {
      label: "Total Revenue",
      value: summary?.totalRevenue || 0,
      icon: DollarSign,
      color: "text-gray-600",
      isCurrency: true,
    },
    {
      label: "Avg. Order Value",
      value: summary?.avgOrderValue || 0,
      icon: TrendingUp,
      color: "text-gray-600",
      isCurrency: true,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

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

export default CustomerStats;
