// pages/Inventory.tsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  RefreshCw,
  Download,
  Upload,
  Archive,
  Tag,
  Layers,
  DollarSign,
  Percent,
} from "lucide-react";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  costPrice: number;
  sellingPrice: number;
  location: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "discontinued";
  lastUpdated: string;
  image: string;
}

// Sample inventory data
const sampleInventory: InventoryItem[] = [
  {
    id: "1",
    productId: "PROD-001",
    productName: "Oversized Cotton Tee",
    sku: "CTG-BLK-S",
    color: "Black",
    size: "S",
    stock: 15,
    reservedStock: 2,
    availableStock: 13,
    reorderLevel: 5,
    reorderQuantity: 20,
    costPrice: 25.0,
    sellingPrice: 45.0,
    location: "Warehouse A",
    status: "in_stock",
    lastUpdated: "2024-05-15",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
  },
  {
    id: "2",
    productId: "PROD-001",
    productName: "Oversized Cotton Tee",
    sku: "CTG-BLK-M",
    color: "Black",
    size: "M",
    stock: 20,
    reservedStock: 3,
    availableStock: 17,
    reorderLevel: 5,
    reorderQuantity: 20,
    costPrice: 25.0,
    sellingPrice: 45.0,
    location: "Warehouse A",
    status: "in_stock",
    lastUpdated: "2024-05-15",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
  },
  {
    id: "3",
    productId: "PROD-001",
    productName: "Oversized Cotton Tee",
    sku: "CTG-BLK-L",
    color: "Black",
    size: "L",
    stock: 12,
    reservedStock: 1,
    availableStock: 11,
    reorderLevel: 5,
    reorderQuantity: 20,
    costPrice: 25.0,
    sellingPrice: 45.0,
    location: "Warehouse A",
    status: "in_stock",
    lastUpdated: "2024-05-15",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
  },
  {
    id: "4",
    productId: "PROD-001",
    productName: "Oversized Cotton Tee",
    sku: "CTG-WHT-S",
    color: "White",
    size: "S",
    stock: 10,
    reservedStock: 0,
    availableStock: 10,
    reorderLevel: 5,
    reorderQuantity: 20,
    costPrice: 25.0,
    sellingPrice: 45.0,
    location: "Warehouse A",
    status: "in_stock",
    lastUpdated: "2024-05-15",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
  },
  {
    id: "5",
    productId: "PROD-001",
    productName: "Oversized Cotton Tee",
    sku: "CTG-WHT-M",
    color: "White",
    size: "M",
    stock: 18,
    reservedStock: 2,
    availableStock: 16,
    reorderLevel: 5,
    reorderQuantity: 20,
    costPrice: 25.0,
    sellingPrice: 45.0,
    location: "Warehouse A",
    status: "in_stock",
    lastUpdated: "2024-05-15",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100",
  },
  {
    id: "6",
    productId: "PROD-002",
    productName: "Cargo Utility Pants",
    sku: "CARGO-KHK-30",
    color: "Khaki",
    size: "30",
    stock: 8,
    reservedStock: 1,
    availableStock: 7,
    reorderLevel: 10,
    reorderQuantity: 15,
    costPrice: 45.0,
    sellingPrice: 89.0,
    location: "Warehouse B",
    status: "low_stock",
    lastUpdated: "2024-05-14",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100",
  },
  {
    id: "7",
    productId: "PROD-002",
    productName: "Cargo Utility Pants",
    sku: "CARGO-KHK-32",
    color: "Khaki",
    size: "32",
    stock: 12,
    reservedStock: 2,
    availableStock: 10,
    reorderLevel: 10,
    reorderQuantity: 15,
    costPrice: 45.0,
    sellingPrice: 89.0,
    location: "Warehouse B",
    status: "in_stock",
    lastUpdated: "2024-05-14",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100",
  },
  {
    id: "8",
    productId: "PROD-002",
    productName: "Cargo Utility Pants",
    sku: "CARGO-BLK-30",
    color: "Black",
    size: "30",
    stock: 5,
    reservedStock: 0,
    availableStock: 5,
    reorderLevel: 10,
    reorderQuantity: 15,
    costPrice: 45.0,
    sellingPrice: 89.0,
    location: "Warehouse B",
    status: "low_stock",
    lastUpdated: "2024-05-14",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100",
  },
  {
    id: "9",
    productId: "PROD-003",
    productName: "Cropped Denim Jacket",
    sku: "DNIM-BLU-XS",
    color: "Blue",
    size: "XS",
    stock: 0,
    reservedStock: 0,
    availableStock: 0,
    reorderLevel: 5,
    reorderQuantity: 10,
    costPrice: 65.0,
    sellingPrice: 129.0,
    location: "Warehouse A",
    status: "out_of_stock",
    lastUpdated: "2024-05-10",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=100",
  },
  {
    id: "10",
    productId: "PROD-003",
    productName: "Cropped Denim Jacket",
    sku: "DNIM-BLU-S",
    color: "Blue",
    size: "S",
    stock: 7,
    reservedStock: 1,
    availableStock: 6,
    reorderLevel: 5,
    reorderQuantity: 10,
    costPrice: 65.0,
    sellingPrice: 129.0,
    location: "Warehouse A",
    status: "in_stock",
    lastUpdated: "2024-05-10",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=100",
  },
];

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] =
    useState<keyof InventoryItem>("productName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get unique locations for filter
  const locations = useMemo(() => {
    const locs = new Set(inventory.map((item) => item.location));
    return Array.from(locs);
  }, [inventory]);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    let filtered = inventory.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesLocation =
        locationFilter === "all" || item.location === locationFilter;
      return matchesSearch && matchesStatus && matchesLocation;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "number") {
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [
    inventory,
    searchTerm,
    statusFilter,
    locationFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Stats calculations
  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.stock * item.costPrice,
    0,
  );
  const lowStockItems = inventory.filter(
    (item) => item.status === "low_stock",
  ).length;
  const outOfStockItems = inventory.filter(
    (item) => item.status === "out_of_stock",
  ).length;
  const totalSKUs = inventory.length;

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

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof InventoryItem) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const handleAdjustStock = () => {
    if (selectedItem && adjustQuantity !== 0) {
      const newStock = selectedItem.stock + adjustQuantity;
      const newStatus =
        newStock <= 0
          ? "out_of_stock"
          : newStock <= selectedItem.reorderLevel
            ? "low_stock"
            : "in_stock";

      setInventory(
        inventory.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                stock: Math.max(0, newStock),
                availableStock: Math.max(0, newStock - item.reservedStock),
                status: newStatus,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : item,
        ),
      );
      setShowAdjustModal(false);
      setAdjustQuantity(0);
      setSelectedItem(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
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
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-sm hover:border-black transition">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-sm hover:bg-black/90 transition">
              <Plus className="w-4 h-4" />
              Add Stock
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Total SKUs</p>
            <p className="text-xl font-semibold">{totalSKUs}</p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Total Stock</p>
            <p className="text-xl font-semibold">{totalStock} units</p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Inventory Value</p>
            <p className="text-xl font-semibold">
              {formatCurrency(totalValue)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Low Stock</p>
            <p className="text-xl font-semibold text-yellow-600">
              {lowStockItems}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Out of Stock</p>
            <p className="text-xl font-semibold text-red-600">
              {outOfStockItems}
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, SKU, or color..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-black outline-none text-sm"
            />
          </div>
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
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  onClick={() => handleSort("productName")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Product {getSortIcon("productName")}
                </th>
                <th
                  onClick={() => handleSort("sku")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  SKU {getSortIcon("sku")}
                </th>
                <th
                  onClick={() => handleSort("stock")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Stock {getSortIcon("stock")}
                </th>
                <th
                  onClick={() => handleSort("availableStock")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Available {getSortIcon("availableStock")}
                </th>
                <th
                  onClick={() => handleSort("sellingPrice")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Price {getSortIcon("sellingPrice")}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedInventory.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-8 h-8 object-cover bg-gray-100"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {item.color} / {item.size}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-600">
                      {item.sku}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p
                        className={`text-sm font-medium ${item.stock <= item.reorderLevel ? "text-yellow-600" : "text-gray-900"}`}
                      >
                        {item.stock} units
                      </p>
                      {item.stock <= item.reorderLevel && item.stock > 0 && (
                        <p className="text-[9px] text-yellow-500">
                          Reorder at {item.reorderLevel}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {item.availableStock} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.sellingPrice)}
                      </p>
                      <p className="text-[9px] text-gray-400">
                        Cost: {formatCurrency(item.costPrice)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600">
                      {item.location}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowAdjustModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 transition"
                        title="Adjust Stock"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredInventory.length)}{" "}
              of {filteredInventory.length} items
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Adjust Stock Modal */}
        <AnimatePresence>
          {showAdjustModal && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              onClick={() => setShowAdjustModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-light">Adjust Stock</h3>
                  <button
                    onClick={() => setShowAdjustModal(false)}
                    className="p-1 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="font-medium text-gray-900">
                      {selectedItem.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedItem.color} / {selectedItem.size} • SKU:{" "}
                      {selectedItem.sku}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Current Stock
                    </label>
                    <p className="text-lg font-semibold">
                      {selectedItem.stock} units
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Adjustment (+/-)
                    </label>
                    <input
                      type="number"
                      value={adjustQuantity}
                      onChange={(e) =>
                        setAdjustQuantity(parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                      placeholder="Enter quantity (use - for reduction)"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Positive value adds stock, negative removes stock
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      New Stock After Adjustment:
                    </p>
                    <p className="text-xl font-semibold text-green-600">
                      {Math.max(0, selectedItem.stock + adjustQuantity)} units
                    </p>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => setShowAdjustModal(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-black transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdjustStock}
                    className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
