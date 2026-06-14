import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Skeleton from "../UI/Skeleton";

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
  items: number;
}

const DataTable = (DataTableComponent as any).default || DataTableComponent;

const getStatusColor = (status: Order["status"]): string => {
  const colors: Record<Order["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const StatusIcon = ({ status }: { status: Order["status"] }) => {
  const icons: Record<Order["status"], React.ReactNode> = {
    pending: <Clock className="w-3 h-3" />,
    processing: <RefreshCw className="w-3 h-3" />,
    shipped: <Package className="w-3 h-3" />,
    delivered: <CheckCircle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  };
  return <>{icons[status] || <AlertCircle className="w-3 h-3" />}</>;
};

const columns: TableColumn<Order>[] = [
  {
    name: "Order ID",
    selector: (row) => row.id,
    sortable: true,
    cell: (row) => (
      <span className="text-xs text-black/70 font-light">{row.id}</span>
    ),
    width: "120px",
  },
  {
    name: "Customer",
    selector: (row) => row.customer,
    sortable: true,
    cell: (row) => (
      <span className="text-xs text-black/70 font-light">{row.customer}</span>
    ),
  },
  {
    name: "Items",
    selector: (row) => row.items,
    sortable: true,
    cell: (row) => (
      <span className="text-xs text-black/50 font-light">{row.items}</span>
    ),
    width: "80px",
  },
  {
    name: "Amount",
    selector: (row) => row.amount,
    sortable: true,
    cell: (row) => (
      <span className="text-xs font-medium text-black">
        ₦{row.amount.toFixed(2)}
      </span>
    ),
    width: "110px",
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
    width: "120px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    cell: (row) => (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-wide ${getStatusColor(row.status)}`}
      >
        <StatusIcon status={row.status} />
        {row.status}
      </span>
    ),
    width: "130px",
  },
];

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
        cursor: "pointer",
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

// Skeleton shown during loading
const TableSkeleton = () => (
  <div className="p-5 space-y-4">
    {/* Skeleton header row */}
    <div className="flex items-center gap-6 pb-3 border-b border-black/5">
      <Skeleton className="w-16 h-3 rounded-sm" />
      <Skeleton className="flex-1 h-3 rounded-sm max-w-[100px]" />
      <Skeleton className="w-8 h-3 rounded-sm" />
      <Skeleton className="w-14 h-3 rounded-sm" />
      <Skeleton className="w-16 h-3 rounded-sm" />
      <Skeleton className="w-16 h-3 rounded-sm" />
    </div>
    {/* Skeleton data rows */}
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

interface RecentOrdersTableProps {
  orders: Order[];
  loading?: boolean;
}

const RecentOrdersTable = ({
  orders,
  loading = false,
}: RecentOrdersTableProps) => {
  return (
    <div className="bg-white border border-black/10">
      <div className="p-5 border-b border-black/10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-light tracking-wide">Recent Orders</h3>
          <p className="text-[10px] text-black/40 mt-1">Latest transactions</p>
        </div>
        <button className="text-[9px] uppercase tracking-[0.15em] text-black/50 hover:text-black transition">
          View All
        </button>
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          customStyles={customStyles}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10]}
          highlightOnHover
          responsive
          persistTableHead
          noDataComponent={
            <div className="py-8 text-center">
              <p className="text-xs text-black/40 tracking-wide">
                No orders found
              </p>
            </div>
          }
        />
      )}
    </div>
  );
};

export default RecentOrdersTable;
