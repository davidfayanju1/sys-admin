// pages/Customers.tsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  TrendingUp,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  joinDate: string;
  totalSpent: number;
  totalOrders: number;
  averageOrderValue: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "vip";
  avatar?: string;
  favoriteCategory?: string;
  feedbacks?: {
    rating: number;
    comment: string;
    date: string;
  }[];
}

// Sample customers data
const sampleCustomers: Customer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+44 7911 123456",
    address: "123 Fashion Avenue",
    city: "London",
    country: "United Kingdom",
    joinDate: "2024-01-15",
    totalSpent: 12450,
    totalOrders: 23,
    averageOrderValue: 541,
    lastOrderDate: "2024-05-10",
    status: "vip",
    favoriteCategory: "Dresses",
    feedbacks: [
      {
        rating: 5,
        comment: "Absolutely love the quality!",
        date: "2024-05-10",
      },
      { rating: 4, comment: "Great shipping speed", date: "2024-04-15" },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+44 7911 234567",
    address: "456 High Street",
    city: "Manchester",
    country: "United Kingdom",
    joinDate: "2024-02-20",
    totalSpent: 5670,
    totalOrders: 12,
    averageOrderValue: 472,
    lastOrderDate: "2024-05-12",
    status: "active",
    favoriteCategory: "Outerwear",
    feedbacks: [
      { rating: 5, comment: "Perfect fit, will buy again", date: "2024-05-12" },
    ],
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    phone: "+44 7911 345678",
    address: "789 King's Road",
    city: "London",
    country: "United Kingdom",
    joinDate: "2024-03-05",
    totalSpent: 2340,
    totalOrders: 5,
    averageOrderValue: 468,
    lastOrderDate: "2024-05-08",
    status: "active",
    favoriteCategory: "Tops",
    feedbacks: [
      { rating: 4, comment: "Nice product, fast delivery", date: "2024-05-08" },
    ],
  },
  {
    id: "4",
    name: "James Brown",
    email: "james.brown@example.com",
    phone: "+44 7911 456789",
    address: "321 Park Lane",
    city: "Birmingham",
    country: "United Kingdom",
    joinDate: "2024-01-10",
    totalSpent: 8900,
    totalOrders: 18,
    averageOrderValue: 494,
    lastOrderDate: "2024-05-05",
    status: "vip",
    favoriteCategory: "Accessories",
    feedbacks: [
      { rating: 5, comment: "Excellent customer service", date: "2024-05-05" },
    ],
  },
  {
    id: "5",
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
    phone: "+44 7911 567890",
    address: "654 Queen Street",
    city: "Liverpool",
    country: "United Kingdom",
    joinDate: "2024-03-15",
    totalSpent: 890,
    totalOrders: 2,
    averageOrderValue: 445,
    lastOrderDate: "2024-05-01",
    status: "active",
    favoriteCategory: "Bottoms",
    feedbacks: [
      { rating: 3, comment: "Good quality but sizing off", date: "2024-05-01" },
    ],
  },
  {
    id: "6",
    name: "William Taylor",
    email: "william.taylor@example.com",
    phone: "+44 7911 678901",
    address: "987 Oxford Street",
    city: "London",
    country: "United Kingdom",
    joinDate: "2024-02-28",
    totalSpent: 1240,
    totalOrders: 3,
    averageOrderValue: 413,
    lastOrderDate: "2024-04-28",
    status: "inactive",
    favoriteCategory: "Footwear",
  },
  {
    id: "7",
    name: "Sophia Lee",
    email: "sophia.lee@example.com",
    phone: "+44 7911 789012",
    address: "147 Regent Street",
    city: "London",
    country: "United Kingdom",
    joinDate: "2024-04-01",
    totalSpent: 3450,
    totalOrders: 7,
    averageOrderValue: 492,
    lastOrderDate: "2024-05-14",
    status: "active",
    favoriteCategory: "Dresses",
    feedbacks: [
      {
        rating: 5,
        comment: "Beautiful dress, great fabric",
        date: "2024-05-14",
      },
    ],
  },
  {
    id: "8",
    name: "Daniel Kim",
    email: "daniel.kim@example.com",
    phone: "+44 7911 890123",
    address: "258 Bond Street",
    city: "Leeds",
    country: "United Kingdom",
    joinDate: "2024-01-05",
    totalSpent: 15670,
    totalOrders: 32,
    averageOrderValue: 489,
    lastOrderDate: "2024-05-13",
    status: "vip",
    favoriteCategory: "Outerwear",
    feedbacks: [
      { rating: 5, comment: "My go-to brand now", date: "2024-05-13" },
    ],
  },
];

const Customers = () => {
  const [customers] = useState<Customer[]>(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);
      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (
        sortField === "totalSpent" ||
        sortField === "totalOrders" ||
        sortField === "averageOrderValue"
      ) {
        aVal = aVal as number;
        bVal = bVal as number;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [customers, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Customer) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getStatusBadge = (status: Customer["status"]) => {
    switch (status) {
      case "vip":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-amber-100 text-amber-700">
            VIP
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-green-100 text-green-700">
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Stats calculations
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const vipCustomers = customers.filter((c) => c.status === "vip").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  //   const averageCustomerValue = totalRevenue / totalCustomers;
  const averageOrderValue =
    customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / totalCustomers;

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Customers</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-gray-500 mt-3">
              Manage your customer base, view profiles, and track engagement
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition">
            <UserPlus className="w-4 h-4" />
            Export List
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Total Customers</p>
            </div>
            <p className="text-xl font-semibold">{totalCustomers}</p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-green-500" />
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <p className="text-xl font-semibold text-green-600">
              {activeCustomers}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-amber-500" />
              <p className="text-xs text-gray-500">VIP Members</p>
            </div>
            <p className="text-xl font-semibold text-amber-600">
              {vipCustomers}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Total Revenue</p>
            </div>
            <p className="text-xl font-semibold">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Avg. Order Value</p>
            </div>
            <p className="text-xl font-semibold">
              {formatCurrency(averageOrderValue)}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-black outline-none text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
          >
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Customers Table */}
        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Customer {getSortIcon("name")}
                </th>
                <th
                  onClick={() => handleSort("totalSpent")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Total Spent {getSortIcon("totalSpent")}
                </th>
                <th
                  onClick={() => handleSort("totalOrders")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Orders {getSortIcon("totalOrders")}
                </th>
                <th
                  onClick={() => handleSort("averageOrderValue")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Avg. Order {getSortIcon("averageOrderValue")}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th
                  onClick={() => handleSort("lastOrderDate")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Last Order {getSortIcon("lastOrderDate")}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {customer.email}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {customer.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(customer.totalSpent)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-700">
                        {customer.totalOrders}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {formatCurrency(customer.averageOrderValue)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {customer.city}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">
                      {formatDate(customer.lastOrderDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(customer.status)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-1 hover:bg-gray-100 transition"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}{" "}
              of {filteredCustomers.length} customers
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

        {/* Customer Details Modal */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto py-8"
              onClick={() => setSelectedCustomer(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                      <span className="text-xl font-light text-gray-600">
                        {selectedCustomer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-light">
                        {selectedCustomer.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Customer since {formatDate(selectedCustomer.joinDate)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-1 hover:bg-gray-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {selectedCustomer.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {selectedCustomer.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {selectedCustomer.address}, {selectedCustomer.city},{" "}
                          {selectedCustomer.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Statistics */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Order Statistics
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 text-center">
                        <p className="text-2xl font-light">
                          {selectedCustomer.totalOrders}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          Total Orders
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 text-center">
                        <p className="text-2xl font-light">
                          {formatCurrency(selectedCustomer.totalSpent)}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          Total Spent
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 text-center">
                        <p className="text-2xl font-light">
                          {formatCurrency(selectedCustomer.averageOrderValue)}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          Avg. Order
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Favorite Category */}
                  {selectedCustomer.favoriteCategory && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Favorite Category
                      </h4>
                      <p className="text-sm text-gray-700">
                        {selectedCustomer.favoriteCategory}
                      </p>
                    </div>
                  )}

                  {/* Feedback History */}
                  {selectedCustomer.feedbacks &&
                    selectedCustomer.feedbacks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Feedback History
                        </h4>
                        <div className="space-y-3">
                          {selectedCustomer.feedbacks.map((feedback, idx) => (
                            <div
                              key={idx}
                              className="border border-gray-100 p-3"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < feedback.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[10px] text-gray-400">
                                  {formatDate(feedback.date)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                {feedback.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Last Order Info */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Last order: {formatDate(selectedCustomer.lastOrderDate)}
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-black transition">
                    Send Email
                  </button>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
