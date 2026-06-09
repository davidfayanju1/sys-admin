import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import Skeleton from "../UI/Skeleton";

interface SatisfactionChartProps {
  satisfactionRate: number;
  positiveFeedbacks: number;
  neutralFeedbacks: number;
  negativeFeedbacks: number;
  loading?: boolean;
}

const SatisfactionChart = ({
  satisfactionRate,
  positiveFeedbacks,
  neutralFeedbacks,
  negativeFeedbacks,
  loading = false,
}: SatisfactionChartProps) => {
  if (loading) {
    return (
      <div className="bg-white border border-black/10">
        <div className="p-5 border-b border-black/10">
          <Skeleton className="w-40 h-4 rounded-sm mb-2" />
          <Skeleton className="w-28 h-3 rounded-sm" />
        </div>
        <div className="p-5 flex flex-col items-center">
          <Skeleton className="w-32 h-32 rounded-full mb-6" />
          <div className="grid grid-cols-3 gap-3 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <Skeleton className="w-10 h-4 rounded-sm" />
                <Skeleton className="w-14 h-2 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-black/10">
      <div className="p-5 border-b border-black/10">
        <h3 className="text-sm font-light tracking-wide">
          Customer Satisfaction
        </h3>
        <p className="text-[10px] text-black/40 mt-1">Feedback analysis</p>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray={`${(satisfactionRate / 100) * 351.86} 351.86`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-light">
                  {Math.round(satisfactionRate)}%
                </span>
                <span className="text-[9px] text-black/40">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <ThumbsUp className="w-3 h-3 text-green-600" />
              <span className="text-xs font-light">{positiveFeedbacks}</span>
            </div>
            <p className="text-[8px] uppercase text-black/40">Positive</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-light">{neutralFeedbacks}</span>
            </div>
            <p className="text-[8px] uppercase text-black/40">Neutral</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <ThumbsDown className="w-3 h-3 text-red-600" />
              <span className="text-xs font-light">{negativeFeedbacks}</span>
            </div>
            <p className="text-[8px] uppercase text-black/40">Negative</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionChart;
