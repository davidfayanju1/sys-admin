import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export interface DashboardResponse {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    pendingOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    avgOrderValue: number;
    avgRating: number;
    positiveSentimentPercent: number;
    lowStock: number;
  };
  recentOrders: Array<{
    id: string;
    customer: string;
    date: string;
    amount: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus: string;
    items: number;
    _id: string;
  }>;
  recentFeedback: Array<{
    id: number | string;
    customer: string;
    rating: number;
    comment: string;
    date: string;
    sentiment: "positive" | "neutral" | "negative";
  }>;
  salesChart: Array<{
    day: string;
    orders: number;
    revenue: number;
  }>;
  orderPipeline: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
}

const fetchDashboardData = async (): Promise<DashboardResponse> => {
  const response = await api.get("/dashboard");
  return response.data?.data || response.data;
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
  });
};
