// pages/Analytics.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Eye,
  Star,
  Clock,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
  Zap,
} from "lucide-react";

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color: string;
}

interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  image: string;
}

interface TopCustomer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orders: number;
  avatar: string;
}

// Sample data
const weeklySalesData: DailySales[] = [
  { date: "Mon", revenue: 2450, orders: 28, visitors: 245 },
  { date: "Tue", revenue: 3890, orders: 42, visitors: 312 },
  { date: "Wed", revenue: 3120, orders: 35, visitors: 289 },
  { date: "Thu", revenue: 4780, orders: 51, visitors: 401 },
  { date: "Fri", revenue: 6240, orders: 68, visitors: 523 },
  { date: "Sat", revenue: 5150, orders: 56, visitors: 478 },
  { date: "Sun", revenue: 3420, orders: 38, visitors: 298 },
];

const monthlySalesData: DailySales[] = [
  { date: "Week 1", revenue: 15890, orders: 178, visitors: 1256 },
  { date: "Week 2", revenue: 18750, orders: 201, visitors: 1489 },
  { date: "Week 3", revenue: 21240, orders: 235, visitors: 1678 },
  { date: "Week 4", revenue: 24580, orders: 267, visitors: 1890 },
];

const topProducts: TopProduct[] = [
  {
    id: "1",
    name: "Oversized Cotton Tee",
    sales: 234,
    revenue: 10530,
    growth: 23,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
  },
  {
    id: "2",
    name: "Cargo Utility Pants",
    sales: 189,
    revenue: 16821,
    growth: 45,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100",
  },
  {
    id: "3",
    name: "Cropped Denim Jacket",
    sales: 156,
    revenue: 17160,
    growth: 12,
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=100",
  },
  {
    id: "4",
    name: "Silk Midi Dress",
    sales: 145,
    revenue: 18850,
    growth: 67,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100",
  },
  {
    id: "5",
    name: "Leather Crossbody Bag",
    sales: 123,
    revenue: 9840,
    growth: 34,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100",
  },
];

const topCustomers: TopCustomer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    totalSpent: 12450,
    orders: 23,
    avatar: "SJ",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    totalSpent: 8750,
    orders: 18,
    avatar: "MC",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@example.com",
    totalSpent: 5670,
    orders: 12,
    avatar: "EW",
  },
  {
    id: "4",
    name: "James Brown",
    email: "james@example.com",
    totalSpent: 4320,
    orders: 9,
    avatar: "JB",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    email: "olivia@example.com",
    totalSpent: 3450,
    orders: 7,
    avatar: "OM",
  },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [selectedMetric, setSelectedMetric] = useState<
    "revenue" | "orders" | "visitors"
  >("revenue");
  const [isExporting, setIsExporting] = useState(false);

  const salesData = timeRange === "week" ? weeklySalesData : monthlySalesData;

  const metrics: MetricCard[] = [
    {
      title: "Total Revenue",
      value: "$24,890",
      change: 18.5,
      changeType: "increase",
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Orders",
      value: "318",
      change: 12.3,
      changeType: "increase",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Customers",
      value: "2,847",
      change: 8.2,
      changeType: "increase",
      icon: <Users className="w-5 h-5" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: 1.5,
      changeType: "decrease",
      icon: <Target className="w-5 h-5" />,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Avg Order Value",
      value: "$78.27",
      change: 5.4,
      changeType: "increase",
      icon: <Activity className="w-5 h-5" />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Returning Rate",
      value: "42%",
      change: 2.1,
      changeType: "increase",
      icon: <Award className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const getMaxValue = () => {
    if (selectedMetric === "revenue")
      return Math.max(...salesData.map((d) => d.revenue));
    if (selectedMetric === "orders")
      return Math.max(...salesData.map((d) => d.orders));
    return Math.max(...salesData.map((d) => d.visitors));
  };

  const getBarHeight = (value: number) => {
    const max = getMaxValue();
    return (value / max) * 100;
  };

  const getMetricValue = (day: DailySales) => {
    if (selectedMetric === "revenue") return day.revenue;
    if (selectedMetric === "orders") return day.orders;
    return day.visitors;
  };

  const getMetricLabel = () => {
    if (selectedMetric === "revenue") return "Revenue (£)";
    if (selectedMetric === "orders") return "Orders";
    return "Visitors";
  };

  const formatMetricValue = (value: number) => {
    if (selectedMetric === "revenue") return `£${value.toLocaleString()}`;
    return value.toLocaleString();
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Report exported successfully!");
    }, 1500);
  };

  // Calculate totals
  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  //   const totalVisitors = salesData.reduce((sum, d) => sum + d.visitors, 0);
  const averageOrderValue = totalRevenue / totalOrders;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Analytics</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-gray-500 mt-3">
              Track your store performance and customer insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-gray-200">
              <button
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1.5 text-xs transition ${timeRange === "week" ? "bg-black text-white" : "text-gray-600 hover:text-black"}`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1.5 text-xs transition ${timeRange === "month" ? "bg-black text-white" : "text-gray-600 hover:text-black"}`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange("year")}
                className={`px-3 py-1.5 text-xs transition ${timeRange === "year" ? "bg-black text-white" : "text-gray-600 hover:text-black"}`}
              >
                Year
              </button>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-sm hover:border-black transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-gray-200 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 ${metric.color}`}>{metric.icon}</div>
                <div
                  className={`flex items-center gap-0.5 text-[10px] ${metric.changeType === "increase" ? "text-green-600" : "text-red-600"}`}
                >
                  {metric.changeType === "increase" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {metric.change}%
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {metric.value}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                {metric.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Performance Overview
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">
                Total {getMetricLabel().toLowerCase()} over the last{" "}
                {timeRange === "week" ? "7 days" : "4 weeks"}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedMetric("revenue")}
                className={`px-3 py-1 text-xs transition ${selectedMetric === "revenue" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSelectedMetric("orders")}
                className={`px-3 py-1 text-xs transition ${selectedMetric === "orders" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
              >
                Orders
              </button>
              <button
                onClick={() => setSelectedMetric("visitors")}
                className={`px-3 py-1 text-xs transition ${selectedMetric === "visitors" ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
              >
                Visitors
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="p-5">
            <div className="flex justify-between mb-2 text-xs text-gray-400">
              <span>0</span>
              <span>{formatMetricValue(getMaxValue())}</span>
            </div>
            <div className="flex items-end justify-between h-64 gap-2">
              {salesData.map((day, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${getBarHeight(getMetricValue(day))}%`,
                    }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className={`w-full transition-all ${selectedMetric === "revenue" ? "bg-black" : selectedMetric === "orders" ? "bg-gray-600" : "bg-gray-400"}`}
                    style={{
                      height: `${getBarHeight(getMetricValue(day))}%`,
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-[10px] text-gray-500">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 border-t border-gray-200">
            <div className="p-4 text-center border-r border-gray-200">
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900">
                £{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-4 text-center border-r border-gray-200">
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-lg font-semibold text-gray-900">
                {totalOrders}
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-gray-500">Avg. Order Value</p>
              <p className="text-lg font-semibold text-gray-900">
                £{averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Top Products
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Best performing products this period
                  </p>
                </div>
                <Package className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {topProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="p-4 flex items-center gap-3 hover:bg-gray-50 transition"
                >
                  <div className="text-sm font-medium text-gray-400 w-6">
                    {idx + 1}
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      £{product.revenue.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-green-600">
                      <ArrowUpRight className="w-3 h-3" />+{product.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Top Customers
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Highest spending customers
                  </p>
                </div>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {topCustomers.map((customer, idx) => (
                <div
                  key={customer.id}
                  className="p-4 flex items-center gap-3 hover:bg-gray-50 transition"
                >
                  <div className="text-sm font-medium text-gray-400 w-6">
                    {idx + 1}
                  </div>
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {customer.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {customer.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      £{customer.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {customer.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Page Views</span>
            </div>
            <p className="text-2xl font-light">24,892</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +15.3% vs last period
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">Avg. Rating</span>
            </div>
            <p className="text-2xl font-light">4.8 / 5.0</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +0.3 vs last period
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-50">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-xs text-gray-500">Avg. Response Time</span>
            </div>
            <p className="text-2xl font-light">2.4 hrs</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-green-600">
              <ArrowDownRight className="w-3 h-3" />
              -0.8 hrs vs last period
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-gray-500">Bounce Rate</span>
            </div>
            <p className="text-2xl font-light">34.2%</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-green-600">
              <ArrowDownRight className="w-3 h-3" />
              -5.1% vs last period
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-4">
          <p className="text-[9px] text-gray-300">
            Data updated in real-time • Last sync:{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
