// pages/Analytics.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award,
} from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Skeleton Components
const MetricCardSkeleton = () => (
  <div className="bg-white border border-gray-200 p-3 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="w-8 h-8 bg-gray-200 rounded" />
      <div className="w-10 h-3 bg-gray-200 rounded" />
    </div>
    <div className="h-6 bg-gray-200 rounded w-20 mb-1" />
    <div className="h-3 bg-gray-200 rounded w-16" />
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white border border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-48 animate-pulse" />
    </div>
    <div className="p-5">
      <div className="flex justify-between mb-2">
        <div className="h-3 bg-gray-200 rounded w-8 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
      </div>
      <div className="flex items-end justify-between h-64 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-gray-200 rounded animate-pulse"
              style={{ height: `${Math.random() * 80 + 20}%` }}
            />
            <div className="h-3 bg-gray-200 rounded w-6 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-3 border-t border-gray-200">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 text-center border-r border-gray-200 last:border-r-0"
        >
          <div className="h-3 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-24 mx-auto animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const TopProductsSkeleton = () => (
  <div className="bg-white border border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-5 bg-gray-200 rounded w-28 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-40 animate-pulse" />
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
    <div className="divide-y divide-gray-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex items-center gap-3 animate-pulse">
          <div className="w-6 h-4 bg-gray-200 rounded" />
          <div className="w-10 h-10 bg-gray-200 rounded" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TopCustomersSkeleton = () => (
  <div className="bg-white border border-gray-200">
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-5 bg-gray-200 rounded w-28 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-40 animate-pulse" />
        </div>
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
    <div className="divide-y divide-gray-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex items-center gap-3 animate-pulse">
          <div className="w-6 h-4 bg-gray-200 rounded" />
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-40" />
          </div>
          <div className="text-right">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-12 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [selectedMetric, setSelectedMetric] = useState<
    "revenue" | "orders" | "visitors"
  >("revenue");
  const [isExporting, setIsExporting] = useState(false);

  const { data: analytics, isLoading, error } = useAnalytics(timeRange);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return `${num}%`;
  };

  const getChangeIcon = (changeType: string, change: number) => {
    if (change === 0) return null;
    return changeType === "increase" ? (
      <ArrowUpRight className="w-3 h-3" />
    ) : (
      <ArrowDownRight className="w-3 h-3" />
    );
  };

  const getChangeColor = (changeType: string, change: number) => {
    if (change === 0) return "text-gray-400";
    return changeType === "increase" ? "text-green-600" : "text-red-600";
  };

  const getMetricCards = () => {
    if (!analytics) return [];

    return [
      {
        title: "Total Revenue",
        value: formatCurrency(analytics.summary.totalRevenue.value),
        change: analytics.summary.totalRevenue.change,
        changeType: analytics.summary.totalRevenue.changeType,
        icon: <DollarSign className="w-5 h-5" />,
        color: "bg-gray-50 text-gray-600",
      },
      {
        title: "Total Orders",
        value: formatNumber(analytics.summary.totalOrders.value),
        change: analytics.summary.totalOrders.change,
        changeType: analytics.summary.totalOrders.changeType,
        icon: <ShoppingBag className="w-5 h-5" />,
        color: "bg-gray-50 text-gray-600",
      },
      {
        title: "Total Customers",
        value: formatNumber(analytics.summary.totalCustomers.value),
        change: analytics.summary.totalCustomers.change,
        changeType: analytics.summary.totalCustomers.changeType,
        icon: <Users className="w-5 h-5" />,
        color: "bg-gray-50 text-gray-600",
      },
      {
        title: "Conversion Rate",
        value: formatPercentage(analytics.summary.conversionRate.value),
        change: analytics.summary.conversionRate.change,
        changeType: analytics.summary.conversionRate.changeType,
        icon: <Target className="w-5 h-5" />,
        color: "bg-gray-50 text-gray-600",
      },
      {
        title: "Avg Order Value",
        value: formatCurrency(analytics.summary.avgOrderValue.value),
        change: analytics.summary.avgOrderValue.change,
        changeType: analytics.summary.avgOrderValue.changeType,
        icon: <Activity className="w-5 h-5" />,
        color: "bg-gray-50 text-gray-600",
      },
      {
        title: "Returning Rate",
        value: formatPercentage(analytics.summary.returningRate.value),
        change: analytics.summary.returningRate.change,
        changeType: analytics.summary.returningRate.changeType,
        icon: <Award className="w-5 h-5" />,
        color: "bg-gray-50 text-gray-600",
      },
    ];
  };

  const getChartData = () => {
    if (!analytics) return [];
    return analytics.chart;
  };

  const getMaxValue = () => {
    const chartData = getChartData();
    if (selectedMetric === "revenue")
      return Math.max(...chartData.map((d) => d.revenue), 1);
    if (selectedMetric === "orders")
      return Math.max(...chartData.map((d) => d.orders), 1);
    return Math.max(...chartData.map((d) => d.visitors), 1);
  };

  const getBarHeight = (value: number) => {
    const max = getMaxValue();
    return max > 0 ? (value / max) * 100 : 0;
  };

  const getMetricValue = (day: any) => {
    if (selectedMetric === "revenue") return day.revenue;
    if (selectedMetric === "orders") return day.orders;
    return day.visitors;
  };

  const getMetricLabel = () => {
    if (selectedMetric === "revenue") return "Revenue (₦)";
    if (selectedMetric === "orders") return "Orders";
    return "Visitors";
  };

  const formatMetricValue = (value: number) => {
    if (selectedMetric === "revenue") return formatCurrency(value);
    return value.toLocaleString();
  };

  const handleExport = async () => {
    if (!analytics) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      const doc = new jsPDF({ orientation: "landscape" });

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`Analytics Report - ${timeRange.toUpperCase()}`, 14, 15);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Key Metrics Summary", 14, 35);

      const summaryData = [
        ["Metric", "Value", "Change"],
        [
          "Total Revenue",
          formatCurrency(analytics.summary.totalRevenue.value),
          `${analytics.summary.totalRevenue.changeType === "increase" ? "+" : "-"}${analytics.summary.totalRevenue.change}%`,
        ],
        [
          "Total Orders",
          analytics.summary.totalOrders.value.toString(),
          `${analytics.summary.totalOrders.changeType === "increase" ? "+" : "-"}${analytics.summary.totalOrders.change}%`,
        ],
        [
          "Total Customers",
          analytics.summary.totalCustomers.value.toString(),
          `${analytics.summary.totalCustomers.changeType === "increase" ? "+" : "-"}${analytics.summary.totalCustomers.change}%`,
        ],
        [
          "Conversion Rate",
          `${analytics.summary.conversionRate.value}%`,
          `${analytics.summary.conversionRate.changeType === "increase" ? "+" : "-"}${analytics.summary.conversionRate.change}%`,
        ],
        [
          "Avg Order Value",
          formatCurrency(analytics.summary.avgOrderValue.value),
          `${analytics.summary.avgOrderValue.changeType === "increase" ? "+" : "-"}${analytics.summary.avgOrderValue.change}%`,
        ],
        [
          "Returning Rate",
          `${analytics.summary.returningRate.value}%`,
          `${analytics.summary.returningRate.changeType === "increase" ? "+" : "-"}${analytics.summary.returningRate.change}%`,
        ],
      ];

      autoTable(doc, {
        head: [summaryData[0]],
        body: summaryData.slice(1),
        startY: 40,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      let finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text("Top Products", 14, finalY);

      const productData = [
        ["Product", "Sales", "Revenue", "Growth"],
        ...analytics.topProducts.map((p) => [
          p.name,
          p.sales.toString(),
          formatCurrency(p.revenue),
          `${p.growth}%`,
        ]),
      ];

      autoTable(doc, {
        head: [productData[0]],
        body: productData.slice(1),
        startY: finalY + 5,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      finalY = (doc as any).lastAutoTable.finalY + 10;
      if (analytics.topCustomers.length > 0) {
        doc.text("Top Customers", 14, finalY);

        const customerData = [
          ["Customer", "Orders", "Total Spent"],
          ...analytics.topCustomers.map((c) => [
            c.name,
            c.orders.toString(),
            formatCurrency(c.totalSpent),
          ]),
        ];

        autoTable(doc, {
          head: [customerData[0]],
          body: customerData.slice(1),
          startY: finalY + 5,
          styles: { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });
      }

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 20,
          doc.internal.pageSize.getHeight() - 10,
        );
        doc.text(
          "SysEmpire Fashion - Analytics Report",
          14,
          doc.internal.pageSize.getHeight() - 10,
        );
      }

      doc.save(`analytics_report_${timeRange}_${new Date().getTime()}.pdf`);
      toast.success("Analytics report exported successfully");
    } catch (error) {
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  const chartData = getChartData();
  const metrics = getMetricCards();
  const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500">Failed to load analytics data</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-black text-white text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                className={`px-3 py-1.5 text-xs transition ${
                  timeRange === "week"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1.5 text-xs transition ${
                  timeRange === "month"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange("year")}
                className={`px-3 py-1.5 text-xs transition ${
                  timeRange === "year"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Year
              </button>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting || !analytics}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-sm hover:border-black transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <>
            {/* Stats Cards Skeletons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>

            {/* Chart Skeleton */}
            <ChartSkeleton />

            {/* Two Column Layout Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopProductsSkeleton />
              <TopCustomersSkeleton />
            </div>
          </>
        ) : analytics ? (
          <>
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
                    {metric.change !== 0 && (
                      <div
                        className={`flex items-center gap-0.5 text-[10px] ${getChangeColor(
                          metric.changeType,
                          metric.change,
                        )}`}
                      >
                        {getChangeIcon(metric.changeType, metric.change)}
                        {Math.abs(metric.change)}%
                      </div>
                    )}
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
                    {timeRange === "week"
                      ? "7 days"
                      : timeRange === "month"
                        ? "4 weeks"
                        : "12 months"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedMetric("revenue")}
                    className={`px-3 py-1 text-xs transition ${
                      selectedMetric === "revenue"
                        ? "bg-black text-white"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    onClick={() => setSelectedMetric("orders")}
                    className={`px-3 py-1 text-xs transition ${
                      selectedMetric === "orders"
                        ? "bg-black text-white"
                        : "text-gray-500 hover:text-black"
                    }`}
                  >
                    Orders
                  </button>
                  <button
                    onClick={() => setSelectedMetric("visitors")}
                    className={`px-3 py-1 text-xs transition ${
                      selectedMetric === "visitors"
                        ? "bg-black text-white"
                        : "text-gray-500 hover:text-black"
                    }`}
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
                  {chartData.map((day, idx) => (
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
                        className={`w-full transition-all ${
                          selectedMetric === "revenue"
                            ? "bg-black"
                            : selectedMetric === "orders"
                              ? "bg-gray-600"
                              : "bg-gray-400"
                        }`}
                        style={{
                          height: `${getBarHeight(getMetricValue(day))}%`,
                          minHeight: "4px",
                        }}
                      />
                      <span className="text-[10px] text-gray-500">
                        {day.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 border-t border-gray-200">
                <div className="p-4 text-center border-r border-gray-200">
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <div className="p-4 text-center border-r border-gray-200">
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(totalOrders)}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500">Avg. Order Value</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(averageOrderValue)}
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
                  {analytics.topProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      className="p-4 flex items-center gap-3 hover:bg-gray-50 transition"
                    >
                      <div className="text-sm font-medium text-gray-400 w-6">
                        {idx + 1}
                      </div>
                      <img
                        src={
                          product.image ||
                          "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
                        }
                        alt={product.name}
                        className="w-10 h-10 object-cover bg-gray-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";
                        }}
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
                          {formatCurrency(product.revenue)}
                        </p>
                        {product.growth > 0 && (
                          <div className="flex items-center justify-end gap-1 text-[10px] text-green-600">
                            <ArrowUpRight className="w-3 h-3" />+
                            {product.growth}%
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {analytics.topProducts.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-xs text-gray-400">
                        No product data available
                      </p>
                    </div>
                  )}
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
                  {analytics.topCustomers.map((customer, idx) => (
                    <div
                      key={customer.id}
                      className="p-4 flex items-center gap-3 hover:bg-gray-50 transition"
                    >
                      <div className="text-sm font-medium text-gray-400 w-6">
                        {idx + 1}
                      </div>
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full">
                        <span className="text-sm font-medium text-gray-600">
                          {customer.avatar || customer.name.charAt(0)}
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
                          {formatCurrency(customer.totalSpent)}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {customer.orders} orders
                        </p>
                      </div>
                    </div>
                  ))}
                  {analytics.topCustomers.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-xs text-gray-400">
                        No customer data available
                      </p>
                    </div>
                  )}
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
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
