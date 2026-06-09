import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  ShoppingBag,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAuthStore } from "../store/authStore";
import StatCard from "../components/UI/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import SatisfactionChart from "../components/dashboard/SatisfactionChart";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import FeedbackList from "../components/dashboard/FeedbackList";

const Home = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useAuthStore();

  // Fetch data using react-query hook
  const {
    data: dashboardData,
    isLoading: isQueryLoading,
    refetch,
  } = useDashboardData();
  const isLoading = isQueryLoading || isRefreshing;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  console.log(dashboardData, "Dashboard data");

  // Safe defaults while loading or on empty states
  const kpis = dashboardData?.kpis || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    avgOrderValue: 0,
    avgRating: 0,
    positiveSentimentPercent: 0,
    lowStock: 0,
  };

  const recentOrders = dashboardData?.recentOrders || [];
  const feedbacks = dashboardData?.recentFeedback || [];
  const weeklyData = dashboardData?.salesChart || [];

  // Calculate completion rate safely
  const completionRate = kpis.totalOrders
    ? Math.round((kpis.deliveredOrders / kpis.totalOrders) * 100)
    : 0;

  // We need the raw counts of sentiments for the satisfaction chart.
  // If the API only provides a percent, we might use that instead, but we have `recentFeedback` to calculate it.
  const positiveFeedbacks = feedbacks.filter(
    (f) => f.sentiment === "positive",
  ).length;
  const negativeFeedbacks = feedbacks.filter(
    (f) => f.sentiment === "negative",
  ).length;
  const neutralFeedbacks =
    feedbacks.length - positiveFeedbacks - negativeFeedbacks;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">
              Dashboard
            </h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3">
              Welcome back, {user?.firstName || "Admin"}! Here's your brand
              performance overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-black/10 rounded-sm">
              {(["week", "month", "year"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition ${
                    timeRange === range
                      ? "bg-black text-white"
                      : "text-black/60 hover:text-black"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 border border-black/10 hover:border-black transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-black/60 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={kpis.totalOrders}
            change=""
            changeType="positive"
            delay={0}
            loading={isLoading}
          />
          <StatCard
            icon={Clock}
            label="Pending Orders"
            value={kpis.pendingOrders}
            change=""
            changeType="negative"
            delay={0.05}
            loading={isLoading}
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`₦${kpis.totalRevenue.toLocaleString()}`}
            change=""
            changeType="positive"
            delay={0.1}
            loading={isLoading}
          />
          <StatCard
            icon={Star}
            label="Avg Rating"
            value={`${kpis.avgRating.toFixed(1)} / 5.0`}
            change=""
            changeType="positive"
            delay={0.15}
            loading={isLoading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={weeklyData} loading={isLoading} />
          <SatisfactionChart
            satisfactionRate={kpis.positiveSentimentPercent || 0}
            positiveFeedbacks={positiveFeedbacks}
            neutralFeedbacks={neutralFeedbacks}
            negativeFeedbacks={negativeFeedbacks}
            loading={isLoading}
          />
        </div>

        {/* Recent Orders & Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrdersTable orders={recentOrders} loading={isLoading} />
          <FeedbackList feedbacks={feedbacks} loading={isLoading} />
        </div>

        {/* Quick Stats Row */}
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
              <p className="text-xl font-light text-black mt-1">
                {kpis.lowStock}
              </p>
            </div>
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-6">
          <p className="text-[9px] text-black/30">
            Last updated {new Date().toLocaleDateString()} • Data refreshes
            automatically
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
