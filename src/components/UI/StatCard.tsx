import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Skeleton from "./Skeleton";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconBgColor?: string;
  iconColor?: string;
  delay?: number;
  loading?: boolean;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeType = "positive",
  iconBgColor = "bg-black/5",
  iconColor = "text-black/60",
  delay = 0,
  loading = false,
}: StatCardProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-black/10 p-5">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-14 h-5 rounded-sm" />
        </div>
        <Skeleton className="w-20 h-7 rounded-sm mb-2" />
        <Skeleton className="w-28 h-3 rounded-sm" />
      </div>
    );
  }

  const changeColors: Record<string, string> = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-black/50 bg-black/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-black/10 p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 ${iconBgColor} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {change && (
          <span
            className={`text-[10px] px-2 py-0.5 ${changeColors[changeType]}`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-light text-black">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
        {label}
      </p>
    </motion.div>
  );
};

export default StatCard;
