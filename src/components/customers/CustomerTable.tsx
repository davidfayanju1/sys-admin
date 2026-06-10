// components/customers/CustomerTable.tsx
import { Eye, ShoppingBag, MapPin, User } from "lucide-react";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import type { Customer } from "../../types/customer";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

interface CustomerTableProps {
  customers: Customer[];
  totalRows: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPerRowsChange: (rowsPerPage: number) => void;
  onViewCustomer: (customer: Customer) => void;
  isLoading?: boolean;
}

// Skeleton row component
const SkeletonRow = () => (
  <div className="flex items-center px-4 py-3 border-b border-gray-100">
    <div className="w-12">
      <div className="h-3 bg-gray-200 rounded animate-pulse w-6" />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-1" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-48" />
          <div className="h-2 bg-gray-200 rounded animate-pulse w-32 mt-1" />
        </div>
      </div>
    </div>
    <div className="w-28 text-right">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto" />
    </div>
    <div className="w-20 text-center">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-8 mx-auto" />
    </div>
    <div className="w-28 text-right">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto" />
    </div>
    <div className="w-32">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
    </div>
    <div className="w-28">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
    </div>
    <div className="w-24">
      <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
    </div>
    <div className="w-28">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
    </div>
  </div>
);

const CustomerTable = ({
  customers,
  totalRows,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPerRowsChange,
  onViewCustomer,
  isLoading,
}: CustomerTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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

  const columns: TableColumn<Customer>[] = [
    {
      name: "S/N",
      selector: (row: Customer) => {
        // Find the index of the current row in the customers array
        const index = customers.findIndex((c) => c.id === row.id);
        return index !== -1 ? index + 1 + (currentPage - 1) * itemsPerPage : 0;
      },
      sortable: false,
      width: "60px",
      center: true,
      cell: (row: Customer) => {
        const index = customers.findIndex((c) => c.id === row.id);
        return (
          <span className="text-xs text-gray-400">
            {index !== -1 ? index + 1 + (currentPage - 1) * itemsPerPage : 0}
          </span>
        );
      },
    },
    {
      name: "Customer",
      selector: (row: Customer) => row.name,
      sortable: true,
      width: "280px",
      cell: (row: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{row.name}</p>
            <p className="text-[11px] text-gray-500">{row.email}</p>
            <p className="text-[10px] text-gray-400">{row.phone}</p>
          </div>
        </div>
      ),
    },
    {
      name: "Total Spent",
      selector: (row: Customer) => row.totalSpent,
      sortable: true,
      right: true,
      width: "130px",
      cell: (row: Customer) => (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(row.totalSpent)}
        </span>
      ),
    },
    {
      name: "Orders",
      selector: (row: Customer) => row.totalOrders,
      sortable: true,
      center: true,
      width: "100px",
      cell: (row: Customer) => (
        <div className="flex items-center gap-1 justify-center">
          <ShoppingBag className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-700">{row.totalOrders}</span>
        </div>
      ),
    },
    {
      name: "Avg. Order",
      selector: (row: Customer) => row.averageOrderValue,
      sortable: true,
      right: true,
      width: "130px",
      cell: (row: Customer) => (
        <span className="text-sm text-gray-700">
          {formatCurrency(row.averageOrderValue)}
        </span>
      ),
    },
    {
      name: "Location",
      selector: (row: Customer) => row.city,
      sortable: true,
      width: "120px",
      cell: (row: Customer) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600">{row.city}</span>
        </div>
      ),
    },
    {
      name: "Last Order",
      selector: (row: Customer) => row.lastOrderDate,
      sortable: true,
      width: "110px",
      cell: (row: Customer) => (
        <span className="text-xs text-gray-600">
          {formatDate(row.lastOrderDate)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Customer) => row.status,
      sortable: true,
      width: "90px",
      cell: (row: Customer) => getStatusBadge(row.status),
    },
    {
      name: "Action",
      right: true,
      width: "150px",
      cell: (row: Customer) => (
        <button
          onClick={() => onViewCustomer(row)}
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all w-full"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
      ),
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

  // Skeleton loader for the table
  const SkeletonLoader = () => (
    <div className="bg-white border border-gray-200">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex">
          <div className="w-12">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-6" />
          </div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
          <div className="w-28">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          </div>
          <div className="w-20">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-12 mx-auto" />
          </div>
          <div className="w-28">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16 ml-auto" />
          </div>
          <div className="w-32">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
          <div className="w-28">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
          </div>
          <div className="w-24">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
          </div>
          <div className="w-28">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-16 ml-auto" />
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <DataTable
      columns={columns}
      data={customers}
      customStyles={customStyles}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      onChangePage={onPageChange}
      onChangeRowsPerPage={onPerRowsChange}
      paginationPerPage={itemsPerPage}
      paginationRowsPerPageOptions={[10, 20, 30, 50]}
      highlightOnHover
      responsive
      persistTableHead
      noDataComponent={
        <div className="py-12 text-center">
          <p className="text-xs text-black/40 tracking-wide">
            No customers found matching your criteria.
          </p>
        </div>
      }
    />
  );
};

export default CustomerTable;
