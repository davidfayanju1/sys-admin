// pages/Orders.tsx - With sharp corners (your brand style)
import { useState, useMemo } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed";
  items: number;
}

const ordersData: Order[] = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    date: "2024-05-15",
    amount: 245.0,
    status: "delivered",
    paymentStatus: "paid",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Michael Chen",
    date: "2024-05-14",
    amount: 432.0,
    status: "shipped",
    paymentStatus: "paid",
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "Emma Wilson",
    date: "2024-05-14",
    amount: 178.0,
    status: "processing",
    paymentStatus: "pending",
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "James Brown",
    date: "2024-05-13",
    amount: 567.0,
    status: "pending",
    paymentStatus: "pending",
    items: 4,
  },
  {
    id: "ORD-005",
    customer: "Olivia Martinez",
    date: "2024-05-13",
    amount: 89.0,
    status: "delivered",
    paymentStatus: "paid",
    items: 1,
  },
  {
    id: "ORD-006",
    customer: "William Taylor",
    date: "2024-05-12",
    amount: 324.0,
    status: "pending",
    paymentStatus: "failed",
    items: 2,
  },
  {
    id: "ORD-007",
    customer: "Sophia Lee",
    date: "2024-05-11",
    amount: 129.0,
    status: "shipped",
    paymentStatus: "paid",
    items: 1,
  },
  {
    id: "ORD-008",
    customer: "Daniel Kim",
    date: "2024-05-10",
    amount: 890.0,
    status: "processing",
    paymentStatus: "paid",
    items: 5,
  },
];

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const config = {
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    },
    processing: {
      icon: Package,
      label: "Processing",
      className: "bg-blue-100 text-blue-700",
    },
    shipped: {
      icon: Truck,
      label: "Shipped",
      className: "bg-purple-100 text-purple-700",
    },
    delivered: {
      icon: CheckCircle,
      label: "Delivered",
      className: "bg-green-100 text-green-700",
    },
    cancelled: {
      icon: XCircle,
      label: "Cancelled",
      className: "bg-red-100 text-red-700",
    },
  };
  const { icon: Icon, label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: Order["paymentStatus"] }) => {
  const config = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium ${config[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Order>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredData = useMemo(() => {
    return ordersData.filter(
      (item) =>
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Date",
      "Items",
      "Amount",
      "Status",
      "Payment",
    ];
    const rows = filteredData.map((order) => [
      order.id,
      order.customer,
      order.date,
      order.items,
      `₦${order.amount}`,
      order.status,
      order.paymentStatus,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSortIcon = (field: keyof Order) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Orders</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-gray-500 mt-3">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-black transition text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/90 transition text-sm">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Stats Summary - NO rounded corners */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-xl font-semibold">{ordersData.length}</p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-xl font-semibold text-yellow-600">
              {ordersData.filter((o) => o.status === "pending").length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Shipped</p>
            <p className="text-xl font-semibold text-purple-600">
              {ordersData.filter((o) => o.status === "shipped").length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Delivered</p>
            <p className="text-xl font-semibold text-green-600">
              {ordersData.filter((o) => o.status === "delivered").length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-xl font-semibold">
              ₦
              {ordersData
                .reduce((sum, o) => sum + o.amount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search Bar - NO rounded corners */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:outline-none focus:border-black text-sm"
          />
        </div>

        {/* Table - NO rounded corners */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    onClick={() => handleSort("id")}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 cursor-pointer hover:text-black"
                  >
                    Order ID {getSortIcon("id")}
                  </th>
                  <th
                    onClick={() => handleSort("customer")}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 cursor-pointer hover:text-black"
                  >
                    Customer {getSortIcon("customer")}
                  </th>
                  <th
                    onClick={() => handleSort("date")}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 cursor-pointer hover:text-black"
                  >
                    Date {getSortIcon("date")}
                  </th>
                  <th
                    onClick={() => handleSort("items")}
                    className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 cursor-pointer hover:text-black"
                  >
                    Items {getSortIcon("items")}
                  </th>
                  <th
                    onClick={() => handleSort("amount")}
                    className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 cursor-pointer hover:text-black"
                  >
                    Amount {getSortIcon("amount")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.customer}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">
                      {order.items}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      ₦{order.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1 hover:bg-gray-100 transition">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination - NO rounded corners */}
          {sortedData.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
                {sortedData.length} orders
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
