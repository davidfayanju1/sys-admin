// services/analyticsService.ts
import api from "../lib/axios";
import type { AnalyticsData } from "../types/analytics";

export const analyticsService = {
  getAnalytics: async (
    range: "week" | "month" | "year" = "week",
  ): Promise<AnalyticsData> => {
    const response = await api.get(`/analytics?range=${range}`);
    return response.data.data;
  },
};
