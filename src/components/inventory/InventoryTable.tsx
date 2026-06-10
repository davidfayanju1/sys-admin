// components/inventory/InventoryTable.tsx
import { Edit, RefreshCw, Trash2 } from "lucide-react";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import type { InventoryItem } from "../../types/inventory";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

interface InventoryTableProps {
  inventory: InventoryItem[];
  totalRows: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPerRowsChange: (rowsPerPage: number) => void;
  onAdjustStock: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  isLoading?: boolean;
}

const InventoryTable = ({
  inventory,
  totalRows,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPerRowsChange,
  onAdjustStock,
  onEdit,
  onDelete,
  isLoading,
}: InventoryTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  };

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in_stock":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-green-100 text-green-700">
            In Stock
          </span>
        );
      case "low_stock":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-yellow-100 text-yellow-700">
            Low Stock
          </span>
        );
      case "out_of_stock":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-red-100 text-red-700">
            Out of Stock
          </span>
        );
      case "discontinued":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600">
            Discontinued
          </span>
        );
      default:
        return null;
    }
  };

  // Helper function to get serial number for a row
  const getSerialNumber = (row: InventoryItem) => {
    const index = inventory.findIndex((item) => item.id === row.id);
    return index !== -1 ? index + 1 + (currentPage - 1) * itemsPerPage : 0;
  };

  const columns: TableColumn<InventoryItem>[] = [
    {
      name: "#",
      selector: (row: InventoryItem) => getSerialNumber(row),
      sortable: false,
      width: "60px",
      center: true,
      cell: (row: InventoryItem) => (
        <span className="text-xs text-gray-400">{getSerialNumber(row)}</span>
      ),
    },
    {
      name: "Product",
      selector: (row: InventoryItem) => row.productName,
      sortable: true,
      width: "250px",
      cell: (row: InventoryItem) => (
        <div className="flex items-center gap-3">
          <img
            src={
              row.image ||
              "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image"
            }
            alt={row.productName}
            className="w-8 h-8 object-cover bg-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";
            }}
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {row.productName}
            </p>
            <p className="text-[10px] text-gray-400">
              {row.color} / {row.size}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "SKU",
      selector: (row: InventoryItem) => row.sku,
      sortable: true,
      width: "180px",
      cell: (row: InventoryItem) => (
        <span className="text-xs font-mono text-gray-600">{row.sku}</span>
      ),
    },
    {
      name: "Stock",
      selector: (row: InventoryItem) => row.stock,
      sortable: true,
      right: true,
      width: "100px",
      cell: (row: InventoryItem) => (
        <div>
          <p
            className={`text-sm font-medium ${row.stock <= row.reorderLevel && row.stock > 0 ? "text-yellow-600" : "text-gray-900"}`}
          >
            {row.stock} units
          </p>
          {row.stock <= row.reorderLevel && row.stock > 0 && (
            <p className="text-[9px] text-yellow-500">
              Reorder at {row.reorderLevel}
            </p>
          )}
        </div>
      ),
    },
    {
      name: "Available",
      selector: (row: InventoryItem) => row.availableStock,
      sortable: true,
      right: true,
      width: "100px",
      cell: (row: InventoryItem) => (
        <span className="text-sm text-gray-700">
          {row.availableStock} units
        </span>
      ),
    },
    {
      name: "Price",
      selector: (row: InventoryItem) => row.sellingPrice,
      sortable: true,
      right: true,
      width: "120px",
      cell: (row: InventoryItem) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(row.sellingPrice)}
          </p>
          <p className="text-[9px] text-gray-400">
            Cost: {formatCurrency(row.costPrice)}
          </p>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row: InventoryItem) => row.status,
      sortable: true,
      width: "100px",
      cell: (row: InventoryItem) => getStatusBadge(row.status),
    },
    {
      name: "Location",
      selector: (row: InventoryItem) => row.location,
      sortable: true,
      width: "120px",
      cell: (row: InventoryItem) => (
        <span className="text-xs text-gray-600">{row.location}</span>
      ),
    },
    {
      name: "Actions",
      right: true,
      width: "120px",
      cell: (row: InventoryItem) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onAdjustStock(row)}
            className="p-1 hover:bg-gray-100 transition"
            title="Adjust Stock"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="p-1 hover:bg-gray-100 transition"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1 hover:bg-gray-100 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
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

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
          <p className="text-sm text-black/40 mt-3 font-light">
            Loading inventory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={inventory}
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
            No inventory items found matching your criteria.
          </p>
        </div>
      }
    />
  );
};

export default InventoryTable;
