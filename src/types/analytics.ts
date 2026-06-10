// types/analytics.ts
export interface MetricValue {
  value: number;
  change: number;
  changeType: "increase" | "decrease";
}

export interface AnalyticsSummary {
  totalRevenue: MetricValue;
  totalOrders: MetricValue;
  totalCustomers: MetricValue;
  conversionRate: MetricValue;
  avgOrderValue: MetricValue;
  returningRate: MetricValue;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  image: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orders: number;
  avatar?: string;
}

export interface AnalyticsData {
  range: "week" | "month" | "year";
  summary: AnalyticsSummary;
  chart: ChartDataPoint[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
}

export interface AnalyticsResponse {
  status: string;
  message: string;
  data: AnalyticsData;
}
