import { Star } from "lucide-react";
import Skeleton from "../UI/Skeleton";

export interface Feedback {
  id: string | number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
}

interface FeedbackListProps {
  feedbacks: Feedback[];
  loading?: boolean;
}

const FeedbackSkeleton = () => (
  <div className="divide-y divide-black/5">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <Skeleton className="w-28 h-4 rounded-sm" />
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="w-3 h-3 rounded-sm" />
                ))}
              </div>
              <Skeleton className="w-16 h-2 rounded-sm" />
            </div>
          </div>
          <Skeleton className="w-16 h-5 rounded-sm" />
        </div>
        <Skeleton className="w-full h-3 rounded-sm" />
        <Skeleton className="w-3/4 h-3 rounded-sm" />
      </div>
    ))}
  </div>
);

const FeedbackList = ({ feedbacks, loading = false }: FeedbackListProps) => {
  return (
    <div className="bg-white border border-black/10">
      <div className="p-5 border-b border-black/10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-light tracking-wide">Recent Feedback</h3>
          <p className="text-[10px] text-black/40 mt-1">Customer reviews</p>
        </div>
        <button className="text-[9px] uppercase tracking-[0.15em] text-black/50 hover:text-black transition">
          View All
        </button>
      </div>
      {loading ? (
        <FeedbackSkeleton />
      ) : feedbacks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-black/40 tracking-wide">No feedback yet</p>
        </div>
      ) : (
        <div className="divide-y divide-black/5 max-h-[400px] overflow-y-auto">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="p-4 hover:bg-black/2 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-light text-black">
                    {feedback.customer}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < feedback.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-black/40">
                      {feedback.date}
                    </span>
                  </div>
                </div>
                <div
                  className={`px-2 py-0.5 text-[8px] uppercase tracking-wide ${
                    feedback.sentiment === "positive"
                      ? "bg-green-50 text-green-700"
                      : feedback.sentiment === "negative"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {feedback.sentiment}
                </div>
              </div>
              <p className="text-xs text-black/60 line-clamp-2">
                {feedback.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
