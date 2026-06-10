import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Search, Download, Plus } from "lucide-react";
import {
  useInventory,
  useInventorySummary,
  useAdjustStock,
  useDeleteInventoryRow,
} from "../hooks/useInventory";
import InventoryStats from "../components/inventory/InventoryStats";
import InventoryTable from "../components/inventory/InventoryTable";
import AdjustStockModal from "../components/inventory/AdjustStockModal";
import DeleteConfirmModal from "../components/inventory/DeleteConfirmationModal";
import type { InventoryItem } from "../types/inventory";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Inventory = () => {
  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Queries
  const { data: inventoryData, isLoading: isLoadingInventory } = useInventory(
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
    locationFilter,
  );
  const { data: summary, isLoading: isLoadingSummary } = useInventorySummary();

  // Mutations
  const adjustStock = useAdjustStock();
  const deleteInventoryRow = useDeleteInventoryRow();

  const inventory = inventoryData?.data?.items || [];
  const meta = inventoryData?.meta || { total: 0, totalPages: 1 };
  const locations = summary?.locations || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage);
    setCurrentPage(1);
  };

  const handleAdjustStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowAdjustModal(true);
  };

  const handleAdjustConfirm = (delta: number) => {
    if (selectedItem) {
      adjustStock.mutate(
        { id: selectedItem.id, delta },
        {
          onSuccess: () => {
            setShowAdjustModal(false);
            setSelectedItem(null);
          },
        },
      );
    }
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem) {
      deleteInventoryRow.mutate(selectedItem.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        },
      });
    }
  };

  const handleEdit = (item: InventoryItem) => {
    toast.info(`Edit functionality coming soon for ${item.productName}`);
  };

  // PDF Export
  const handlePDFExport = () => {
    if (!inventory.length) {
      toast.error("No inventory data to export");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Inventory Report", 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const summaryText = `Total SKUs: ${summary?.totalSkus || 0} | Total Units: ${summary?.totalUnits || 0} | Stock Value: ${formatCurrency(summary?.stockValue || 0)} | Low Stock: ${summary?.lowStock || 0} | Out of Stock: ${summary?.outOfStock || 0}`;
    doc.text(summaryText, 14, 30);

    const tableHeaders = [
      "Product",
      "SKU",
      "Color",
      "Size",
      "Stock",
      "Available",
      "Price (₦)",
      "Status",
      "Location",
    ];

    const tableRows = inventory.map((item) => [
      item.productName,
      item.sku,
      item.color,
      item.size,
      item.stock.toString(),
      item.availableStock.toString(),
      (item.sellingPrice / 100).toLocaleString(),
      item.status.replace("_", " ").toUpperCase(),
      item.location,
    ]);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
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
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 },
        7: { cellWidth: 25 },
        8: { cellWidth: 25 },
      },
      margin: { left: 14, right: 14 },
      pageBreak: "auto",
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
        "SysEmpire Fashion - Inventory Report",
        14,
        doc.internal.pageSize.getHeight() - 10,
      );
    }

    doc.save(`inventory_report_${new Date().getTime()}.pdf`);
    toast.success("Inventory exported to PDF successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Inventory</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-gray-500 mt-3">
              Manage your stock levels, track inventory, and manage variants
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePDFExport}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-sm hover:border-black transition"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-sm hover:bg-black/90 transition">
              <Plus className="w-4 h-4" />
              Add Stock
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <InventoryStats summary={summary} isLoading={isLoadingSummary} />

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, SKU, or color..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-black outline-none text-sm"
            />
            <button type="submit" className="hidden" />
          </form>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
            {locations.length > 0 && (
              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
              >
                <option value="all">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
          <InventoryTable
            inventory={inventory}
            totalRows={meta.total || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPerRowsChange={handlePerRowsChange}
            onAdjustStock={handleAdjustStock}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            isLoading={isLoadingInventory}
          />
        </div>

        {/* Adjust Stock Modal */}
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

        {/* Delete Confirmation Modal */}
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
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
