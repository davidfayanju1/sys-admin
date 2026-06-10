// hooks/useAnalytics.ts
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";

export const useAnalytics = (range: "week" | "month" | "year") => {
  return useQuery({
    queryKey: ["analytics", range],
    queryFn: () => analyticsService.getAnalytics(range),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
