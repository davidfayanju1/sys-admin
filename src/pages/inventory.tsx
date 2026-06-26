import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Search, Download, Plus, ChevronDown } from "lucide-react";
import {
  useInventory,
  useInventorySummary,
  useAdjustStock,
  useDeleteInventoryRow,
  useCreateInventory,
} from "../hooks/useInventory";
import InventoryStats from "../components/inventory/InventoryStats";
import InventoryTable from "../components/inventory/InventoryTable";
import AdjustStockModal from "../components/inventory/AdjustStockModal";
import DeleteConfirmModal from "../components/inventory/DeleteConfirmationModal";
import AddMaterialModal from "../components/inventory/AddMaterialModal";
import type { InventoryItem } from "../types/inventory";
import type { CreateInventoryPayload } from "../types/inventory";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

const Inventory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: inventoryData, isLoading: isLoadingInventory } = useInventory(
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
    locationFilter,
    categoryFilter,
  );
  const { data: summary, isLoading: isLoadingSummary } = useInventorySummary();

  const adjustStock = useAdjustStock();
  const deleteInventoryRow = useDeleteInventoryRow();
  const createInventory = useCreateInventory();

  const inventory = inventoryData?.data?.items || [];
  const meta = inventoryData?.meta || { total: 0, totalPages: 1 };
  const locations = summary?.locations || [];
  const categories = summary?.categories || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowAdjustModal(true);
  };

  const handleAdjustConfirm = (delta: number) => {
    if (!selectedItem) return;
    adjustStock.mutate(
      { id: selectedItem.id, delta },
      {
        onSuccess: () => {
          setShowAdjustModal(false);
          setSelectedItem(null);
        },
      },
    );
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    deleteInventoryRow.mutate(selectedItem.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setSelectedItem(null);
      },
    });
  };

  const handleAddMaterial = (payload: CreateInventoryPayload) => {
    createInventory.mutate(payload, {
      onSuccess: () => setShowAddModal(false),
    });
  };

  const handleExport = () => {
    if (!inventory.length) {
      toast.error("No inventory data to export");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Inventory Report", 14, 15);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(
      `Total Materials: ${summary?.totalItems ?? 0}  |  Total Units: ${summary?.totalUnits ?? 0}  |  Stock Value: ${fmt(summary?.stockValue ?? 0)}  |  Low Stock: ${summary?.lowStock ?? 0}  |  Out of Stock: ${summary?.outOfStock ?? 0}`,
      14,
      29,
    );
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
      head: [
        [
          "Material",
          "SKU",
          "Category",
          "Unit",
          "Stock",
          "Reorder At",
          "Cost Price",
          "Supplier",
          "Location",
          "Status",
        ],
      ],
      body: inventory.map((item) => [
        item.name,
        item.sku,
        item.category,
        item.unit,
        item.stock.toString(),
        item.reorderLevel.toString(),
        fmt(item.costPrice),
        item.supplier || "—",
        item.location || "—",
        item.status.replace(/_/g, " ").toUpperCase(),
      ]),
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [248, 248, 248] },
      margin: { left: 14, right: 14 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 20,
        doc.internal.pageSize.getHeight() - 10,
      );
      doc.text(
        "SYS Empire — Inventory Report",
        14,
        doc.internal.pageSize.getHeight() - 10,
      );
    }

    doc.save(`inventory_${Date.now()}.pdf`);
    toast.success("Inventory exported to PDF");
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-black">
              Inventory
            </h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-black/50 mt-3">
              Track raw materials, fabrics, threads, notions, and supplies
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 border border-black/10 text-sm hover:border-black transition"
            >
              <Download className="w-4 h-4" />
              <span className="font-light">Export</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/80 transition"
            >
              <Plus className="w-4 h-4" />
              <span className="font-light">Add Material</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <InventoryStats summary={summary} isLoading={isLoadingSummary} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white border border-black/10 p-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
            <input
              type="text"
              placeholder="Search by name, SKU, or supplier…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-black/10 focus:outline-none focus:border-black text-sm font-light transition"
            />
            <button type="submit" className="hidden" />
          </form>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-3 pr-7 py-2 border border-black/10 focus:outline-none focus:border-black text-xs font-light text-black/70 bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-black/40 pointer-events-none" />
            </div>

            {categories.length > 0 && (
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-3 pr-7 py-2 border border-black/10 focus:outline-none focus:border-black text-xs font-light text-black/70 bg-white cursor-pointer capitalize"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-black/40 pointer-events-none" />
              </div>
            )}

            {locations.length > 0 && (
              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => {
                    setLocationFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none pl-3 pr-7 py-2 border border-black/10 focus:outline-none focus:border-black text-xs font-light text-black/70 bg-white cursor-pointer"
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-black/40 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-black/10">
          <InventoryTable
            inventory={inventory}
            totalRows={meta.total || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onPerRowsChange={(n) => {
              setItemsPerPage(n);
              setCurrentPage(1);
            }}
            onAdjustStock={handleAdjustStock}
            onDelete={handleDeleteClick}
            isLoading={isLoadingInventory}
          />
        </div>
      </div>

      <AddMaterialModal
        isOpen={showAddModal}
        onConfirm={handleAddMaterial}
        onClose={() => setShowAddModal(false)}
        isLoading={createInventory.isPending}
      />

      <AdjustStockModal
        isOpen={showAdjustModal}
        item={selectedItem}
        onConfirm={handleAdjustConfirm}
        onClose={() => {
          setShowAdjustModal(false);
          setSelectedItem(null);
        }}
        isLoading={adjustStock.isPending}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        item={selectedItem}
        onConfirm={handleDeleteConfirm}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        isLoading={deleteInventoryRow.isPending}
      />
    </DashboardLayout>
  );
};

export default Inventory;
