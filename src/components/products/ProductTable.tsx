// components/products/ProductTable.tsx
import { Edit, Copy, Trash2, Package, Eye } from "lucide-react";
import DataTableComponent, {
  type TableColumn,
} from "react-data-table-component";
import type { Product } from "../../types/product";

// Use the same pattern as Orders.tsx
const DataTable = (DataTableComponent as any).default || DataTableComponent;

interface ProductTableProps {
  products: Product[];
  totalRows: number;
  currentPage?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPerRowsChange: (rowsPerPage: number) => void;
  onEdit: (product: Product) => void;
  onDuplicate: (id: string) => void;
  onDelete: (product: Product) => void;
  isLoading?: boolean;
}

const ProductTable = ({
  products,
  totalRows,
  // currentPage,
  itemsPerPage,
  onPageChange,
  onPerRowsChange,
  onEdit,
  onDuplicate,
  onDelete,
  isLoading,
}: ProductTableProps) => {
  const getStatusBadge = (status: Product["status"]) => {
    const displayStatus = status === "published" ? "active" : status;
    switch (displayStatus) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-green-100 text-green-700">
            <Eye className="w-2.5 h-2.5" />
            Active
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600">
            <Package className="w-2.5 h-2.5" />
            Draft
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-red-100 text-red-700">
            Archived
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  const getTotalStock = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }
    return product.stock || 0;
  };

  const getPriceDisplay = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map((v) => v.price / 100);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const currency = product.variants[0]?.currency === "GBP" ? "£" : "₦";
      return min === max
        ? `${currency}${min.toFixed(2)}`
        : `${currency}${min.toFixed(2)} - ${currency}${max.toFixed(2)}`;
    }
    const currency = product.currency === "GBP" ? "£" : "₦";
    const price = (product.finalPrice || product.price) / 100;
    return `${currency}${price.toFixed(2)}`;
  };

  const getVariantSummary = (product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      return "No variants";
    }
    const colors = [...new Set(product.variants.map((v) => v.color))];
    const sizes = [...new Set(product.variants.map((v) => v.size))];
    return `${colors.length} color${colors.length !== 1 ? "s" : ""} • ${sizes.length} size${sizes.length !== 1 ? "s" : ""}`;
  };

  const getPrimaryImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.isPrimary);
      return primary?.url || product.images[0]?.url;
    }
    return "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";
  };

  const columns: TableColumn<Product>[] = [
    {
      name: "Product",
      selector: (row: Product) => row.name || row.title || "",
      sortable: true,
      width: "350px",
      cell: (row: Product) => (
        <div className="flex w-[80%] items-center gap-3">
          <img
            src={getPrimaryImage(row)}
            alt={row.name || row.title}
            className="w-10 h-10 object-cover bg-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image";
            }}
          />
          <div className="w-full">
            <p className="text-sm truncate min-w-0 font-medium text-gray-900">
              {row.name || row.title}
            </p>
            <p className="text-[10px] text-gray-400 max-w-xs truncate">
              SKU: {row.sku}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Variants",
      selector: (row: Product) => row.variants?.length || 0,
      sortable: true,
      cell: (row: Product) => (
        <div>
          <p className="text-xs text-gray-600">
            {row.variants?.length || 0} variants
          </p>
          <p className="text-[9px] text-gray-400">{getVariantSummary(row)}</p>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row: Product) => getPriceDisplay(row),
      sortable: true,
      cell: (row: Product) => (
        <span className="text-sm font-medium text-gray-900">
          {getPriceDisplay(row)}
        </span>
      ),
    },
    {
      name: "Stock",
      selector: (row: Product) => getTotalStock(row),
      sortable: true,
      cell: (row: Product) => (
        <span
          className={`text-sm ${getTotalStock(row) === 0 ? "text-red-500" : "text-gray-600"}`}
        >
          {getTotalStock(row)} units
        </span>
      ),
    },
    {
      name: "Sales",
      selector: (row: Product) => row.salesCount || 0,
      sortable: true,
      cell: (row: Product) => (
        <span className="text-sm text-gray-600">
          {row.salesCount || 0} sold
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row: Product) => row.status,
      sortable: true,
      cell: (row: Product) => getStatusBadge(row.status),
    },
    {
      name: "Actions",
      right: true,
      width: "120px",
      cell: (row: Product) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(row)}
            className="p-1 hover:bg-gray-100 transition"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDuplicate(row.id || row._id)}
            className="p-1 hover:bg-gray-100 transition"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-gray-500" />
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
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
        <p className="text-sm text-black/40 mt-3 font-light">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={products}
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
            No products found matching your criteria.
          </p>
        </div>
      }
    />
  );
};

export default ProductTable;
