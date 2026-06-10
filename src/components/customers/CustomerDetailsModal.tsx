// components/customers/CustomerDetailsModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Star,
  ShoppingBag,
  DollarSign,
  Calendar,
  Tag,
  Award,
  Heart,
  MessageCircle,
  Package,
  TrendingUp,
  UserCheck,
  Clock,
  CreditCard,
} from "lucide-react";
import type { Customer, OrderSummary } from "../../types/customer";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isLoading?: boolean;
  onClose: () => void;
}

const CustomerDetailsModal = ({
  customer,
  isLoading,
  onClose,
}: CustomerDetailsModalProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vip":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 text-amber-700">
            <Award className="w-3 h-3" />
            VIP Member
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700">
            <UserCheck className="w-3 h-3" />
            Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      delivered: "bg-green-100 text-green-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      pending: "bg-yellow-100 text-yellow-700",
      cancelled: "bg-red-100 text-red-700",
    };
    const colorClass =
      statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
    return (
      <span
        className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${colorClass}`}
      >
        {status || "Pending"}
      </span>
    );
  };

  // Orders table columns for react-data-table-component
  const orderColumns: TableColumn<OrderSummary>[] = [
    {
      name: "Order ID",
      selector: (row: OrderSummary) => row.id,
      sortable: true,
      width: "120px",
      cell: (row: OrderSummary) => (
        <span className="font-mono text-xs">{row.id?.slice(-8) || "N/A"}</span>
      ),
    },
    {
      name: "Date",
      selector: (row: OrderSummary) => row.date,
      sortable: true,
      width: "120px",
      cell: (row: OrderSummary) => (
        <span className="text-xs text-gray-600">{formatDate(row.date)}</span>
      ),
    },
    {
      name: "Amount",
      selector: (row: OrderSummary) => row.amount,
      sortable: true,
      right: true,
      width: "100px",
      cell: (row: OrderSummary) => (
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: OrderSummary) => row.status,
      sortable: true,
      center: true,
      width: "100px",
      cell: (row: OrderSummary) => getOrderStatusBadge(row.status),
    },
  ];

  const orderCustomStyles = {
    table: {
      style: {
        backgroundColor: "transparent",
        borderRadius: "0px",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
        minHeight: "36px",
      },
    },
    headCells: {
      style: {
        fontSize: "9px",
        fontWeight: "600",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
        color: "#6b7280",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
    rows: {
      style: {
        minHeight: "40px",
        borderBottom: "1px solid #f3f4f6",
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "12px",
        paddingRight: "12px",
      },
    },
  };

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="p-5 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 animate-pulse rounded" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 animate-pulse rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
        </div>
      </div>

      {/* Contact Info Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-32 mb-3" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-64" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-56" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-72" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-32 mb-3" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-48" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-40" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-36" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-50 p-3 text-center">
            <div className="w-4 h-4 bg-gray-200 animate-pulse rounded mx-auto mb-2" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-16 mx-auto mb-1" />
            <div className="h-2 bg-gray-200 animate-pulse rounded w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Orders Table Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-32" />
        <div className="border border-gray-200">
          <div className="bg-gray-50 p-3">
            <div className="flex gap-4">
              <div className="h-3 bg-gray-200 animate-pulse rounded w-20" />
              <div className="h-3 bg-gray-200 animate-pulse rounded w-20" />
              <div className="h-3 bg-gray-200 animate-pulse rounded w-16 ml-auto" />
              <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 border-t border-gray-100">
              <div className="flex gap-4">
                <div className="h-3 bg-gray-200 animate-pulse rounded w-20" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-16 ml-auto" />
                <div className="h-5 bg-gray-200 animate-pulse rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {customer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <>
                {/* Modal Header */}
                <div className="p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                      <span className="text-xl font-light text-gray-600">
                        {customer?.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-light">{customer?.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          Customer since {formatDate(customer?.joinDate || "")}
                        </p>
                        {getStatusBadge(customer?.status || "")}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-6">
                  {/* Contact Information & Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        Contact Information
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {customer?.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {customer?.phone}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <span className="text-gray-700">
                            {customer?.address}, {customer?.city},{" "}
                            {customer?.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        Preferences & Activity
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            Favorite Category:{" "}
                            <span className="font-medium">
                              {customer?.favoriteCategory || "N/A"}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            Status:{" "}
                            <span className="font-medium capitalize">
                              {customer?.status}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            Last Active:{" "}
                            {formatDate(customer?.lastOrderDate || "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Statistics */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      Order Statistics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 text-center">
                        <ShoppingBag className="w-4 h-4 text-gray-400 mx-auto mb-2" />
                        <p className="text-2xl font-light">
                          {customer?.totalOrders || 0}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          Total Orders
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 text-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mx-auto mb-2" />
                        <p className="text-2xl font-light">
                          {formatCurrency(customer?.totalSpent || 0)}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          Total Spent
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 text-center">
                        <CreditCard className="w-4 h-4 text-gray-400 mx-auto mb-2" />
                        <p className="text-2xl font-light">
                          {formatCurrency(customer?.averageOrderValue || 0)}
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          Avg. Order Value
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 text-center">
                        <Clock className="w-4 h-4 text-gray-400 mx-auto mb-2" />
                        <p className="text-2xl font-light">
                          {Math.floor(
                            (Date.now() -
                              new Date(customer?.joinDate || "").getTime()) /
                              (1000 * 60 * 60 * 24 * 30),
                          )}{" "}
                          months
                        </p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          Customer Tenure
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order History - Using react-data-table-component */}
                  {customer?.orders && customer.orders.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        Order History ({customer.orders.length})
                      </h4>
                      <DataTable
                        columns={orderColumns}
                        data={customer.orders}
                        customStyles={orderCustomStyles}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 15]}
                        highlightOnHover
                        responsive
                        noDataComponent={
                          <div className="py-8 text-center">
                            <p className="text-xs text-black/40 tracking-wide">
                              No orders found
                            </p>
                          </div>
                        }
                      />
                    </div>
                  )}

                  {/* Feedback History */}
                  {customer?.feedbacks && customer.feedbacks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        Customer Feedback ({customer.feedbacks.length})
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {customer.feedbacks.map((feedback, idx) => (
                          <div key={idx} className="border border-gray-100 p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < feedback.rating
                                        ? "fill-amber-500 text-amber-500"
                                        : "text-gray-300"
                                    }`}
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
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-black transition">
                    Send Email
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomerDetailsModal;
