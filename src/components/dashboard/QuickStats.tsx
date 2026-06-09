import { CheckCircle, Star, TrendingUp } from "lucide-react";

interface KPIProps {
  avgOrderValue: number;
  lowStock: number;
}

interface QuickStatsProps {
  kpis: KPIProps;
  completionRate: number;
}

const QuickStats = ({ kpis, completionRate }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white border border-black/10 p-5 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Avg Order Value
          </p>
          <p className="text-xl font-light text-black mt-1">
            ₦{kpis?.avgOrderValue?.toLocaleString()}.00
          </p>
        </div>
        <TrendingUp className="w-5 h-5 text-green-600" />
      </div>

      <div className="bg-white border border-black/10 p-5 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Completion Rate
          </p>
          <p className="text-xl font-light text-black mt-1">
            {completionRate}%
          </p>
        </div>
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>

      <div className="bg-white border border-black/10 p-5 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
            Low Stock Items
          </p>
          <p className="text-xl font-light text-black mt-1">{kpis.lowStock}</p>
        </div>
        <Star className="w-5 h-5 text-yellow-600" />
      </div>
    </div>
  );
};

export default QuickStats;
