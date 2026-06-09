import Skeleton from "../UI/Skeleton";

export interface WeeklyData {
  day: string;
  orders: number;
  revenue: number;
}

interface RevenueChartProps {
  data: WeeklyData[];
  loading?: boolean;
}

const RevenueChart = ({ data, loading = false }: RevenueChartProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-black/10">
        <div className="p-5 border-b border-black/10">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="w-36 h-4 rounded-sm mb-2" />
              <Skeleton className="w-48 h-3 rounded-sm" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="w-16 h-3 rounded-sm" />
              <Skeleton className="w-16 h-3 rounded-sm" />
            </div>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {[75, 60, 85, 45, 90, 70, 55].map((width, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-3 rounded-sm" />
              <div className="flex-1">
                <Skeleton
                  className="h-8 rounded-sm"
                  style={{ width: `${width}%` }}
                />
              </div>
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="w-12 h-3 rounded-sm" />
                <Skeleton className="w-16 h-2 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const maxRevenue =
    data.length > 0 ? Math.max(...data.map((d) => d.revenue)) : 1;

  return (
    <div className="bg-white border border-black/10">
      <div className="p-5 border-b border-black/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-light tracking-wide">
              Revenue & Orders
            </h3>
            <p className="text-[10px] text-black/40 mt-1">
              Weekly performance overview
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black" />
              <span className="text-[8px] uppercase text-black/50">
                Revenue
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black/30" />
              <span className="text-[8px] uppercase text-black/50">
                Orders
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-[10px] text-black/40 w-8">{item.day}</span>
              <div className="flex-1">
                <div className="flex gap-1">
                  <div
                    className="h-8 bg-black transition-all duration-500"
                    style={{
                      width: `${(item.revenue / (maxRevenue * 1.1)) * 100}%`,
                    }}
                  />
                  <div
                    className="h-8 bg-black/30 transition-all duration-500"
                    style={{ width: `${(item.orders / 30) * 15}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-light">₦{item.revenue}</span>
                <span className="text-[9px] text-black/40">
                  {item.orders} orders
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
