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
  ShoppingBag,
} from "lucide-react";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
const DataTable = (DataTableComponent as any).default || DataTableComponent;
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useOrders, useOrderSummary, type Order } from "../hooks/useOrders";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import Skeleton from "../components/UI/Skeleton";
import StatCard from "../components/UI/StatCard";

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<
    string,
    { icon: any; label: string; className: string }
  > = {
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

  const statusConfig = config[status.toLowerCase()] || {
    icon: Clock,
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  const { icon: Icon, label, className } = statusConfig;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-wide font-medium ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: string }) => {
  const config: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };

  const className = config[status.toLowerCase()] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex px-2 py-1 text-[9px] uppercase tracking-wide font-medium ${className}`}
    >
      {status}
    </span>
  );
};

// Custom styles for DataTable
const customStyles = {
  table: {
    style: {
      backgroundColor: "transparent",
      borderRadius: "0px",
    },
  },
  headRow: {
    style: {
      backgroundColor: "rgba(0, 0, 0, 0.03)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
      minHeight: "42px",
      borderRadius: "0px",
    },
  },
  headCells: {
    style: {
      fontSize: "9px",
      fontWeight: "300",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color: "rgba(0, 0, 0, 0.5)",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      minHeight: "48px",
      borderBottom: "1px solid rgba(0, 0, 0, 0.04)",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.02)",
      },
      transition: "background-color 0.15s ease",
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  pagination: {
    style: {
      fontSize: "11px",
      fontWeight: "300",
      color: "rgba(0, 0, 0, 0.5)",
      borderTop: "1px solid rgba(0, 0, 0, 0.06)",
      minHeight: "48px",
    },
    pageButtonsStyle: {
      borderRadius: "0px",
      height: "32px",
      width: "32px",
      padding: "4px",
      cursor: "pointer",
      transition: "0.2s",
      fill: "rgba(0, 0, 0, 0.4)",
      "&:hover:not(:disabled)": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        fill: "rgba(0, 0, 0, 0.8)",
      },
      "&:disabled": {
        cursor: "default",
        fill: "rgba(0, 0, 0, 0.15)",
      },
    },
  },
  noData: {
    style: {
      padding: "32px",
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      fontWeight: "300",
    },
  },
};

const TableSkeleton = () => (
  <div className="p-5 space-y-4">
    <div className="flex items-center gap-6 pb-3 border-b border-black/5">
      <Skeleton className="w-16 h-3 rounded-sm" />
      <Skeleton className="flex-1 h-3 rounded-sm max-w-[100px]" />
      <Skeleton className="w-8 h-3 rounded-sm" />
      <Skeleton className="w-14 h-3 rounded-sm" />
      <Skeleton className="w-16 h-3 rounded-sm" />
      <Skeleton className="w-16 h-3 rounded-sm" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-6">
        <Skeleton className="w-16 h-4 rounded-sm" />
        <Skeleton className="flex-1 h-4 rounded-sm max-w-[120px]" />
        <Skeleton className="w-8 h-4 rounded-sm" />
        <Skeleton className="w-16 h-4 rounded-sm" />
        <Skeleton className="w-20 h-4 rounded-sm" />
        <Skeleton className="w-20 h-5 rounded-sm" />
      </div>
    ))}
  </div>
);

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch orders from API
  const { data: ordersResponse, isLoading: ordersLoading } = useOrders(
    currentPage,
    rowsPerPage,
    searchTerm,
  );
  const orders = ordersResponse?.data || [];
  const meta = ordersResponse?.meta || { total: 0 };

  // Fetch summary stats
  const { data: summaryResponse, isLoading: summaryLoading } =
    useOrderSummary();
  const summary = summaryResponse?.data || {
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    paid: 0,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const columns: TableColumn<Order>[] = useMemo(
    () => [
      {
        name: "Order ID",
        selector: (row) => row.id,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/70 font-light">{row.id}</span>
        ),
        width: "150px",
      },
      {
        name: "Customer",
        selector: (row) => row.customer,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/70 font-light">
            {row.customer}
          </span>
        ),
      },
      {
        name: "Date",
        selector: (row) => row.date,
        sortable: true,
        cell: (row) => (
          <span className="text-xs text-black/50 font-light">
            {new Date(row.date).toLocaleDateString()}
          </span>
        ),
      },
      {
        name: "Items",
        selector: (row) => row.items,
        sortable: true,
        center: true,
        cell: (row) => (
          <span className="text-xs text-black/50 font-light">{row.items}</span>
        ),
        width: "80px",
      },
      {
        name: "Amount",
        selector: (row) => row.amount,
        sortable: true,
        right: true,
        cell: (row) => (
          <span className="text-xs font-medium text-black">
            ₦
            {Number(row.amount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        cell: (row) => <StatusBadge status={row.status} />,
      },
      {
        name: "Payment",
        selector: (row) => row.paymentStatus,
        sortable: true,
        cell: (row) => <PaymentBadge status={row.paymentStatus} />,
      },
      {
        name: "Actions",
        center: true,
        cell: (row) => (
          <button
            onClick={() => setSelectedOrderId(row._id)}
            className="p-1.5 hover:bg-black/5 transition-colors text-black/60 hover:text-black"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
        width: "80px",
      },
    ],
    [],
  );

  const handleExport = () => {
    if (!orders.length) return;

    const doc = new jsPDF();

    const headers = [
      "Order ID",
      "Customer",
      "Date",
      "Items",
      "Amount (Naira)",
      "Status",
      "Payment",
    ];

    const rows = orders.map((order) => [
      order.id,
      order.customer,
      new Date(order.date).toLocaleDateString(),
      order.items,
      Number(order.amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      order.status,
      order.paymentStatus,
    ]);

    doc.setFontSize(16);
    doc.text("Orders Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [headers],
      body: rows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
    });

    doc.save(`orders_export_${new Date().getTime()}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">
              Orders
            </h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-black border border-black/10 hover:border-black transition text-sm text-black/70 hover:text-black"
            >
              <Download className="w-4 h-4" color="white" />
              <span className="font-light text-white">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={summary.total}
            loading={summaryLoading}
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={summary.pending}
            delay={0.05}
            loading={summaryLoading}
          />
          <StatCard
            icon={Package}
            label="Processing"
            value={summary.processing}
            delay={0.1}
            loading={summaryLoading}
          />
          <StatCard
            icon={Truck}
            label="Shipped"
            value={summary.shipped}
            delay={0.15}
            loading={summaryLoading}
          />
          <StatCard
            icon={CheckCircle}
            label="Delivered"
            value={summary.delivered}
            delay={0.2}
            loading={summaryLoading}
          />
        </div>

        {/* Search Bar */}
        <div className="flex justify-between items-center bg-white border border-black/10 p-4">
          <form onSubmit={handleSearch} className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/30" />
            <input
              type="text"
              placeholder="Search by customer or order ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black/10 focus:outline-none focus:border-black/30 transition-colors text-sm font-light bg-transparent"
            />
            <button type="submit" className="hidden" />
          </form>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-black/10">
          {ordersLoading ? (
            <TableSkeleton />
          ) : (
            <DataTable
              columns={columns}
              data={orders}
              customStyles={customStyles}
              pagination
              paginationServer
              paginationTotalRows={meta.total}
              onChangePage={(page: number) => setCurrentPage(page)}
              onChangeRowsPerPage={(newPerPage: number, page: number) => {
                setRowsPerPage(newPerPage);
                setCurrentPage(page);
              }}
              paginationPerPage={rowsPerPage}
              paginationRowsPerPageOptions={[10, 20, 50]}
              highlightOnHover
              responsive
              persistTableHead
              noDataComponent={
                <div className="py-12 text-center">
                  <p className="text-xs text-black/40 tracking-wide">
                    No orders found matching your criteria.
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>

      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default Orders;
