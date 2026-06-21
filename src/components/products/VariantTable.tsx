import DataTableComponent, { type TableColumn } from "react-data-table-component";

const DataTable = (DataTableComponent as any).default || DataTableComponent;
import { Trash2, Pencil } from "lucide-react";
import type { Variant } from "../../types/product";

interface VariantTableProps {
  variants: Variant[];
  editingIndex?: number;
  onEditVariant: (index: number) => void;
  onRemoveVariant: (index: number) => void;
}

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#f9fafb",
      borderBottom: "1px solid #e5e7eb",
    },
  },
  headCells: {
    style: {
      fontSize: "11px",
      color: "#6b7280",
      fontWeight: "400",
      paddingLeft: "12px",
      paddingRight: "12px",
    },
  },
  cells: {
    style: {
      paddingLeft: "12px",
      paddingRight: "12px",
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
  rows: {
    style: {
      fontSize: "12px",
    },
    highlightOnHoverStyle: {
      backgroundColor: "#f9fafb",
      transitionDuration: "0.15s",
    },
  },
};

const VariantTable = ({
  variants,
  editingIndex,
  onEditVariant,
  onRemoveVariant,
}: VariantTableProps) => {
  if (variants.length === 0) return null;

  const columns: TableColumn<Variant & { _index: number }>[] = [
    {
      name: "#",
      selector: (row) => row._index + 1,
      width: "50px",
      cell: (row) => (
        <span className="text-xs text-gray-400">{row._index + 1}</span>
      ),
    },
    {
      name: "Color",
      selector: (row) => row.color,
      cell: (row) => <span className="text-xs">{row.color}</span>,
    },
    {
      name: "Size",
      cell: (row) => (
        <div className="flex flex-wrap gap-1 py-1">
          {(row.sizes || []).map((s) => (
            <span
              key={s}
              className="inline-flex px-1.5 py-0.5 bg-gray-100 text-[10px] font-medium text-gray-700"
            >
              {s}
            </span>
          ))}
        </div>
      ),
    },
    {
      name: "SKU",
      selector: (row) => row.sku,
      cell: (row) => (
        <span className="font-mono text-xs text-gray-500">{row.sku}</span>
      ),
    },
    {
      name: "Price",
      selector: (row) => row.price,
      cell: (row) => (
        <span className="text-xs font-medium">
          ₦{(row.price / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      cell: (row) => <span className="text-xs text-gray-600">{row.stock}</span>,
    },
    {
      name: "Actions",
      center: true,
      cell: (row) => {
        const isEditing = editingIndex === row._index;
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onEditVariant(row._index)}
              title="Edit variant"
              className={`transition ${isEditing ? "text-amber-500" : "text-gray-400 hover:text-black"}`}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRemoveVariant(row._index)}
              title="Remove variant"
              className="text-gray-400 hover:text-red-600 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  const data = variants.map((v, idx) => ({ ...v, _index: idx }));

  return (
    <div className="border border-gray-200 overflow-hidden">
      <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        conditionalRowStyles={[
          {
            when: (row: Variant & { _index: number }) => editingIndex === row._index,
            style: {
              backgroundColor: "#fffbeb",
              borderLeft: "2px solid #f59e0b",
            },
          },
        ]}
        noTableHead={false}
        dense
      />
    </div>
  );
};

export default VariantTable;
