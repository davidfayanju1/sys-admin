import { RefreshCw, Trash2 } from "lucide-react";
import RowActionMenu from "../UI/RowActionMenu";
import DataTableComponent, { type TableColumn } from "react-data-table-component";
import type { InventoryItem } from "../../types/inventory";

const DataTable = (DataTableComponent as any).default || DataTableComponent;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const StatusBadge = ({ status }: { status: InventoryItem["status"] }) => {
  const map = {
    in_stock: "bg-green-100 text-green-700",
    low_stock: "bg-yellow-100 text-yellow-700",
    out_of_stock: "bg-red-100 text-red-700",
  };
  const label = { in_stock: "In Stock", low_stock: "Low Stock", out_of_stock: "Out of Stock" };
  return (
    <span className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${map[status] ?? "bg-gray-100 text-gray-500"}`}>
      {label[status] ?? status}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: string }) => (
  <span className="inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium bg-black/5 text-black/50">
    {category}
  </span>
);

interface InventoryTableProps {
  inventory: InventoryItem[];
  totalRows: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPerRowsChange: (rowsPerPage: number) => void;
  onAdjustStock: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  isLoading?: boolean;
}

const customStyles = {
  table: { style: { backgroundColor: "transparent", borderRadius: "0px" } },
  headRow: {
    style: {
      backgroundColor: "rgba(0,0,0,0.03)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      minHeight: "42px",
    },
  },
  headCells: {
    style: {
      fontSize: "9px",
      fontWeight: "300",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color: "rgba(0,0,0,0.5)",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  rows: {
    style: {
      minHeight: "52px",
      borderBottom: "1px solid rgba(0,0,0,0.04)",
      "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
      transition: "background-color 0.15s ease",
    },
  },
  cells: { style: { paddingLeft: "16px", paddingRight: "16px" } },
  pagination: {
    style: {
      fontSize: "11px",
      fontWeight: "300",
      color: "rgba(0,0,0,0.5)",
      borderTop: "1px solid rgba(0,0,0,0.06)",
      minHeight: "48px",
    },
    pageButtonsStyle: {
      borderRadius: "0px",
      height: "32px",
      width: "32px",
      padding: "4px",
      cursor: "pointer",
      transition: "0.2s",
      fill: "rgba(0,0,0,0.4)",
      "&:hover:not(:disabled)": { backgroundColor: "rgba(0,0,0,0.04)", fill: "rgba(0,0,0,0.8)" },
      "&:disabled": { cursor: "default", fill: "rgba(0,0,0,0.15)" },
    },
  },
  noData: { style: { padding: "32px", color: "rgba(0,0,0,0.4)", fontSize: "12px", fontWeight: "300" } },
};

const InventoryTable = ({
  inventory,
  totalRows,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPerRowsChange,
  onAdjustStock,
  onDelete,
  isLoading,
}: InventoryTableProps) => {
  const columns: TableColumn<InventoryItem>[] = [
    {
      name: "#",
      width: "50px",
      center: true,
      cell: (_row, idx) => (
        <span className="text-xs text-black/40 font-light">
          {(currentPage - 1) * itemsPerPage + idx + 1}
        </span>
      ),
    },
    {
      name: "Material",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <div>
          <p className="text-xs text-black/80 font-light">{row.name}</p>
          <CategoryBadge category={row.category} />
        </div>
      ),
    },
    {
      name: "SKU",
      selector: (row) => row.sku,
      sortable: true,
      width: "140px",
      cell: (row) => (
        <span className="text-xs font-mono text-black/50 tracking-wide">{row.sku}</span>
      ),
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
      width: "130px",
      cell: (row) => (
        <div>
          <p className={`text-sm font-light ${row.stock <= row.reorderLevel && row.stock > 0 ? "text-yellow-600" : "text-black/80"}`}>
            {row.stock.toLocaleString()} <span className="text-[10px] text-black/40">{row.unit}</span>
          </p>
          {row.stock <= row.reorderLevel && row.stock > 0 && (
            <p className="text-[9px] text-yellow-500">Reorder at {row.reorderLevel}</p>
          )}
        </div>
      ),
    },
    {
      name: "Cost Price",
      selector: (row) => row.costPrice,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className="text-xs text-black/70 font-light">{fmt(row.costPrice)}</span>
      ),
    },
    {
      name: "Supplier",
      selector: (row) => row.supplier ?? "",
      width: "150px",
      cell: (row) => (
        <span className="text-xs text-black/50 font-light">{row.supplier || "—"}</span>
      ),
    },
    {
      name: "Location",
      selector: (row) => row.location ?? "",
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className="text-xs text-black/50 font-light">{row.location || "—"}</span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "110px",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      name: "Actions",
      center: true,
      width: "70px",
      cell: (row) => (
        <RowActionMenu
          actions={[
            { icon: RefreshCw, label: "Adjust Stock", onClick: () => onAdjustStock(row) },
            { icon: Trash2, label: "Delete", onClick: () => onDelete(row), destructive: true },
          ]}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b border-black mx-auto" />
        <p className="text-xs text-black/40 mt-3 font-light">Loading inventory…</p>
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
          <p className="text-xs text-black/40 tracking-wide">No materials found.</p>
        </div>
      }
    />
  );
};

export default InventoryTable;
