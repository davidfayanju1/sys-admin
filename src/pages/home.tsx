// pages/Home.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import {
  ShoppingBag,
  Package,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
}

interface Feedback {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
}

const Home = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sample orders data
  const recentOrders: Order[] = [
    {
      id: "#ORD-001",
      customer: "Sarah Johnson",
      amount: 245.0,
      status: "delivered",
      date: "2024-05-15",
      items: 3,
    },
    {
      id: "#ORD-002",
      customer: "Michael Chen",
      amount: 432.0,
      status: "shipped",
      date: "2024-05-14",
      items: 2,
    },
    {
      id: "#ORD-003",
      customer: "Emma Wilson",
      amount: 178.0,
      status: "processing",
      date: "2024-05-14",
      items: 1,
    },
    {
      id: "#ORD-004",
      customer: "James Brown",
      amount: 567.0,
      status: "pending",
      date: "2024-05-13",
      items: 4,
    },
    {
      id: "#ORD-005",
      customer: "Olivia Martinez",
      amount: 89.0,
      status: "delivered",
      date: "2024-05-13",
      items: 1,
    },
    {
      id: "#ORD-006",
      customer: "William Taylor",
      amount: 324.0,
      status: "pending",
      date: "2024-05-12",
      items: 2,
    },
  ];

  // Sample feedback data
  const feedbacks: Feedback[] = [
    {
      id: 1,
      customer: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely love the dress! Perfect fit.",
      date: "2024-05-15",
      sentiment: "positive",
    },
    {
      id: 2,
      customer: "Michael Chen",
      rating: 4,
      comment: "Quality is great, shipping was fast.",
      date: "2024-05-14",
      sentiment: "positive",
    },
    {
      id: 3,
      customer: "Emma Wilson",
      rating: 3,
      comment: "Good product but sizing was off.",
      date: "2024-05-13",
      sentiment: "neutral",
    },
    {
      id: 4,
      customer: "James Brown",
      rating: 5,
      comment: "Excellent craftsmanship!",
      date: "2024-05-12",
      sentiment: "positive",
    },
    {
      id: 5,
      customer: "Olivia Martinez",
      rating: 2,
      comment: "Delayed shipping, not happy.",
      date: "2024-05-11",
      sentiment: "negative",
    },
    {
      id: 6,
      customer: "William Taylor",
      rating: 4,
      comment: "Good value for money.",
      date: "2024-05-10",
      sentiment: "positive",
    },
  ];

  // Calculate metrics
  const totalOrders = recentOrders.length;
  const pendingOrders = recentOrders.filter(
    (o) => o.status === "pending",
  ).length;
  const processingOrders = recentOrders.filter(
    (o) => o.status === "processing",
  ).length;
  const completedOrders = recentOrders.filter(
    (o) => o.status === "delivered",
  ).length;
  const totalRevenue = recentOrders.reduce(
    (sum, order) => sum + order.amount,
    0,
  );
  const averageOrderValue = totalRevenue / totalOrders;

  const positiveFeedbacks = feedbacks.filter(
    (f) => f.sentiment === "positive",
  ).length;
  const negativeFeedbacks = feedbacks.filter(
    (f) => f.sentiment === "negative",
  ).length;
  const averageRating =
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  const satisfactionRate = (positiveFeedbacks / feedbacks.length) * 100;

  // Weekly data for chart
  const weeklyData = [
    { day: "Mon", orders: 12, revenue: 2450 },
    { day: "Tue", orders: 18, revenue: 3890 },
    { day: "Wed", orders: 15, revenue: 3120 },
    { day: "Thu", orders: 22, revenue: 4780 },
    { day: "Fri", orders: 28, revenue: 6240 },
    { day: "Sat", orders: 24, revenue: 5150 },
    { day: "Sun", orders: 16, revenue: 3420 },
  ];

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "processing":
        return <RefreshCw className="w-3 h-3" />;
      case "shipped":
        return <Package className="w-3 h-3" />;
      case "delivered":
        return <CheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

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
              Welcome back! Here's your fashion brand performance overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-black/10 rounded-sm">
              {["week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
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
              className="p-2 border border-black/10 hover:border-black transition"
            >
              <RefreshCw
                className={`w-4 h-4 text-black/60 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white border border-black/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-black/5 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-black/60" />
              </div>
              <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5">
                +12%
              </span>
            </div>
            <p className="text-2xl font-light text-black">{totalOrders}</p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
              Total Orders
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white border border-black/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5">
                +5%
              </span>
            </div>
            <p className="text-2xl font-light text-black">
              {pendingOrders + processingOrders}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
              Pending Orders
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-black/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5">
                +18%
              </span>
            </div>
            <p className="text-2xl font-light text-black">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
              Total Revenue
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-black/10 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5">
                +8%
              </span>
            </div>
            <p className="text-2xl font-light text-black">
              {averageRating.toFixed(1)} / 5.0
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-black/40 mt-1">
              Avg Rating
            </p>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue & Orders Chart */}
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
                {weeklyData.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-[10px] text-black/40 w-8">
                      {data.day}
                    </span>
                    <div className="flex-1">
                      <div className="flex gap-1">
                        <div
                          className="h-8 bg-black transition-all duration-500"
                          style={{ width: `${(data.revenue / 6500) * 100}%` }}
                        />
                        <div
                          className="h-8 bg-black/30 transition-all duration-500"
                          style={{ width: `${(data.orders / 30) * 15}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-light">
                        ${data.revenue}
                      </span>
                      <span className="text-[9px] text-black/40">
                        {data.orders} orders
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white border border-black/10">
            <div className="p-5 border-b border-black/10">
              <h3 className="text-sm font-light tracking-wide">
                Customer Satisfaction
              </h3>
              <p className="text-[10px] text-black/40 mt-1">
                Feedback analysis
              </p>
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
                      <span className="text-[9px] text-black/40">
                        Satisfaction
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ThumbsUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-light">
                      {positiveFeedbacks}
                    </span>
                  </div>
                  <p className="text-[8px] uppercase text-black/40">Positive</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs font-light">
                      {feedbacks.length - positiveFeedbacks - negativeFeedbacks}
                    </span>
                  </div>
                  <p className="text-[8px] uppercase text-black/40">Neutral</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ThumbsDown className="w-3 h-3 text-red-600" />
                    <span className="text-xs font-light">
                      {negativeFeedbacks}
                    </span>
                  </div>
                  <p className="text-[8px] uppercase text-black/40">Negative</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders & Feedback Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Table */}
          <div className="bg-white border border-black/10">
            <div className="p-5 border-b border-black/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-light tracking-wide">
                  Recent Orders
                </h3>
                <p className="text-[10px] text-black/40 mt-1">
                  Latest transactions
                </p>
              </div>
              <button className="text-[9px] uppercase tracking-[0.15em] text-black/50 hover:text-black transition">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.1em] text-black/50 font-light">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.1em] text-black/50 font-light">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.1em] text-black/50 font-light">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-[9px] uppercase tracking-[0.1em] text-black/50 font-light">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-black/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs text-black/70">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-black/70">
                          {order.customer}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-black">
                          ${order.amount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-wide ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white border border-black/10">
            <div className="p-5 border-b border-black/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-light tracking-wide">
                  Recent Feedback
                </h3>
                <p className="text-[10px] text-black/40 mt-1">
                  Customer reviews
                </p>
              </div>
              <button className="text-[9px] uppercase tracking-[0.15em] text-black/50 hover:text-black transition">
                View All
              </button>
            </div>
            <div className="divide-y divide-black/5 max-h-[400px] overflow-y-auto">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-4 hover:bg-black/5 transition-colors"
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
                              className={`w-3 h-3 ${i < feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
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
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-black/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                Avg Order Value
              </p>
              <p className="text-xl font-light text-black mt-1">
                ${averageOrderValue.toFixed(2)}
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
                {Math.round((completedOrders / totalOrders) * 100)}%
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>

          <div className="bg-white border border-black/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-black/40">
                Response Time
              </p>
              <p className="text-xl font-light text-black mt-1">2.4 hrs</p>
            </div>
            <Clock className="w-5 h-5 text-blue-600" />
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
