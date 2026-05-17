// pages/Products.tsx - Simple table version (NO external dependencies)
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  Copy,
  X,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Edit,
} from "lucide-react";

interface Variant {
  id: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  details: string;
  status: "active" | "draft" | "archived";
  primaryImage: string;
  secondaryImages: string[];
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
}

const sampleProducts: Product[] = [
  {
    id: "1",
    title: "Oversized Cotton Tee",
    description:
      "100% premium cotton oversized t-shirt with dropped shoulder silhouette",
    details: "Machine wash cold • Tumble dry low • Made in Portugal",
    status: "active",
    primaryImage:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    secondaryImages: [],
    variants: [
      {
        id: "v1",
        color: "Black",
        size: "S",
        sku: "CTG-BLK-S",
        price: 4500,
        currency: "GBP",
        stock: 15,
        images: [],
      },
      {
        id: "v2",
        color: "Black",
        size: "M",
        sku: "CTG-BLK-M",
        price: 4500,
        currency: "GBP",
        stock: 20,
        images: [],
      },
      {
        id: "v3",
        color: "Black",
        size: "L",
        sku: "CTG-BLK-L",
        price: 4500,
        currency: "GBP",
        stock: 12,
        images: [],
      },
      {
        id: "v4",
        color: "White",
        size: "S",
        sku: "CTG-WHT-S",
        price: 4500,
        currency: "GBP",
        stock: 10,
        images: [],
      },
      {
        id: "v5",
        color: "White",
        size: "M",
        sku: "CTG-WHT-M",
        price: 4500,
        currency: "GBP",
        stock: 18,
        images: [],
      },
    ],
    createdAt: "2024-05-01",
    updatedAt: "2024-05-15",
  },
  {
    id: "2",
    title: "Cargo Utility Pants",
    description:
      "Relaxed fit cargo pants with multiple pockets and adjustable hem",
    details: "65% Polyester • 35% Cotton • Zip fly with button closure",
    status: "active",
    primaryImage:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    secondaryImages: [],
    variants: [
      {
        id: "v6",
        color: "Khaki",
        size: "30",
        sku: "CARGO-KHK-30",
        price: 8900,
        currency: "GBP",
        stock: 8,
        images: [],
      },
      {
        id: "v7",
        color: "Khaki",
        size: "32",
        sku: "CARGO-KHK-32",
        price: 8900,
        currency: "GBP",
        stock: 12,
        images: [],
      },
      {
        id: "v8",
        color: "Black",
        size: "30",
        sku: "CARGO-BLK-30",
        price: 8900,
        currency: "GBP",
        stock: 5,
        images: [],
      },
    ],
    createdAt: "2024-05-10",
    updatedAt: "2024-05-14",
  },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<keyof Product>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    details: "",
    status: "active" as "active" | "draft" | "archived",
    primaryImage: "",
    secondaryImages: [] as string[],
    variants: [] as Variant[],
  });

  const [currentVariant, setCurrentVariant] = useState<Variant>({
    id: "",
    color: "",
    size: "",
    sku: "",
    price: 0,
    currency: "GBP",
    stock: 0,
    images: [],
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, statusFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Product) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-green-100 text-green-700">
            Active
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] bg-gray-100 text-gray-600">
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
        return null;
    }
  };

  const getTotalStock = (variants: Variant[]) => {
    return variants.reduce((sum, v) => sum + v.stock, 0);
  };

  const getPriceRange = (variants: Variant[]) => {
    const prices = variants.map((v) => v.price / 100);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const currency = variants[0]?.currency === "GBP" ? "£" : "$";
    return min === max
      ? `${currency}${min.toFixed(2)}`
      : `${currency}${min.toFixed(2)} - ${currency}${max.toFixed(2)}`;
  };

  const getVariantSummary = (variants: Variant[]) => {
    const colors = [...new Set(variants.map((v) => v.color))];
    const sizes = [...new Set(variants.map((v) => v.size))];
    return `${colors.length} color${colors.length !== 1 ? "s" : ""} • ${sizes.length} size${sizes.length !== 1 ? "s" : ""}`;
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      title: `${product.title} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setProducts([newProduct, ...products]);
  };

  const addVariant = () => {
    if (currentVariant.color && currentVariant.size && currentVariant.sku) {
      setNewProduct({
        ...newProduct,
        variants: [
          ...newProduct.variants,
          {
            ...currentVariant,
            id: Date.now().toString(),
            price: currentVariant.price * 100,
          },
        ],
      });
      setCurrentVariant({
        id: "",
        color: "",
        size: "",
        sku: "",
        price: 0,
        currency: "GBP",
        stock: 0,
        images: [],
      });
    }
  };

  const removeVariant = (index: number) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.filter((_, i) => i !== index),
    });
  };

  const addSecondaryImage = () => {
    setNewProduct({
      ...newProduct,
      secondaryImages: [...newProduct.secondaryImages, ""],
    });
  };

  const updateSecondaryImage = (index: number, value: string) => {
    const updated = [...newProduct.secondaryImages];
    updated[index] = value;
    setNewProduct({ ...newProduct, secondaryImages: updated });
  };

  const removeSecondaryImage = (index: number) => {
    setNewProduct({
      ...newProduct,
      secondaryImages: newProduct.secondaryImages.filter((_, i) => i !== index),
    });
  };

  const saveProduct = () => {
    if (!newProduct.title || newProduct.variants.length === 0) {
      alert("Please fill in product title and at least one variant");
      return;
    }

    const product: Product = {
      id: editingProduct?.id || Date.now().toString(),
      title: newProduct.title,
      description: newProduct.description,
      details: newProduct.details,
      status: newProduct.status,
      primaryImage:
        newProduct.primaryImage ||
        "https://placehold.co/400x400/e2e8f0/64748b?text=No+Image",
      secondaryImages: newProduct.secondaryImages.filter(
        (img) => img.trim() !== "",
      ),
      variants: newProduct.variants,
      createdAt:
        editingProduct?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([product, ...products]);
    }

    closeModal();
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      title: product.title,
      description: product.description,
      details: product.details,
      status: product.status,
      primaryImage: product.primaryImage,
      secondaryImages: product.secondaryImages,
      variants: product.variants,
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setNewProduct({
      title: "",
      description: "",
      details: "",
      status: "active",
      primaryImage: "",
      secondaryImages: [],
      variants: [],
    });
    setCurrentVariant({
      id: "",
      color: "",
      size: "",
      sku: "",
      price: 0,
      currency: "GBP",
      stock: 0,
      images: [],
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Products</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-gray-500 mt-3">
              Manage your product catalog, variants, and inventory
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Total Products</p>
            <p className="text-xl font-semibold">{products.length}</p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Active</p>
            <p className="text-xl font-semibold text-green-600">
              {products.filter((p) => p.status === "active").length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Total Variants</p>
            <p className="text-xl font-semibold">
              {products.reduce((sum, p) => sum + p.variants.length, 0)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-3">
            <p className="text-xs text-gray-500">Low Stock</p>
            <p className="text-xl font-semibold text-yellow-600">
              {
                products.filter((p) =>
                  p.variants.some((v) => v.stock < 5 && v.stock > 0),
                ).length
              }
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-black outline-none text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  onClick={() => handleSort("title")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Product {getSortIcon("title")}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Variants
                </th>
                <th
                  onClick={() => handleSort("title")}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-black"
                >
                  Price {getSortIcon("title")}
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.primaryImage}
                        alt={product.title}
                        className="w-10 h-10 object-cover bg-gray-100"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.title}
                        </p>
                        <p className="text-[10px] text-gray-400 max-w-xs truncate">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-600">
                      {product.variants.length} variants
                    </p>
                    <p className="text-[9px] text-gray-400">
                      {getVariantSummary(product.variants)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">
                      {getPriceRange(product.variants)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${getTotalStock(product.variants) === 0 ? "text-red-500" : "text-gray-600"}`}
                    >
                      {getTotalStock(product.variants)} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1 hover:bg-gray-100 transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(product)}
                        className="p-1 hover:bg-gray-100 transition"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="p-1 hover:bg-gray-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
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
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
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

        {/* Add/Edit Product Modal - Same as before */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto py-8"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                  <h3 className="text-lg font-light">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-1 hover:bg-gray-100 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Product Title *
                        </label>
                        <input
                          type="text"
                          value={newProduct.title}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                          placeholder="e.g., Oversized Cotton Tee"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Status
                        </label>
                        <select
                          value={newProduct.status}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              status: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm bg-white"
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">
                          Description
                        </label>
                        <textarea
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm resize-none"
                          placeholder="Product description..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">
                          Details
                        </label>
                        <textarea
                          value={newProduct.details}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              details: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm resize-none"
                          placeholder="Care instructions, materials, etc."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Images
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Primary Image URL
                        </label>
                        <input
                          type="text"
                          value={newProduct.primaryImage}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              primaryImage: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Secondary Images
                        </label>
                        {newProduct.secondaryImages.map((img, idx) => (
                          <div key={idx} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={img}
                              onChange={(e) =>
                                updateSecondaryImage(idx, e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                              placeholder="https://example.com/image.jpg"
                            />
                            <button
                              onClick={() => removeSecondaryImage(idx)}
                              className="px-3 border border-gray-200 hover:border-red-500 transition"
                            >
                              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={addSecondaryImage}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mt-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add Secondary Image
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Variants */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Variants
                    </h4>
                    <div className="bg-gray-50 p-4 border border-gray-200 mb-4">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <input
                          type="text"
                          placeholder="Color"
                          value={currentVariant.color}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              color: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Size"
                          value={currentVariant.size}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              size: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="text"
                          placeholder="SKU"
                          value={currentVariant.sku}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              sku: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Price (£)"
                          value={currentVariant.price || ""}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              price: parseFloat(e.target.value),
                            })
                          }
                          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={currentVariant.stock || ""}
                          onChange={(e) =>
                            setCurrentVariant({
                              ...currentVariant,
                              stock: parseInt(e.target.value),
                            })
                          }
                          className="px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                        />
                      </div>
                      <button
                        onClick={addVariant}
                        className="mt-3 flex items-center gap-2 text-sm text-black border border-gray-200 px-4 py-2 hover:border-black transition"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Add Variant
                      </button>
                    </div>

                    {newProduct.variants.length > 0 && (
                      <div className="border border-gray-200 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs text-gray-500">
                                Color
                              </th>
                              <th className="px-3 py-2 text-left text-xs text-gray-500">
                                Size
                              </th>
                              <th className="px-3 py-2 text-left text-xs text-gray-500">
                                SKU
                              </th>
                              <th className="px-3 py-2 text-left text-xs text-gray-500">
                                Price
                              </th>
                              <th className="px-3 py-2 text-left text-xs text-gray-500">
                                Stock
                              </th>
                              <th className="px-3 py-2 text-center text-xs text-gray-500">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {newProduct.variants.map((variant, idx) => (
                              <tr key={variant.id}>
                                <td className="px-3 py-2">{variant.color}</td>
                                <td className="px-3 py-2">{variant.size}</td>
                                <td className="px-3 py-2 font-mono text-xs">
                                  {variant.sku}
                                </td>
                                <td className="px-3 py-2">
                                  £{(variant.price / 100).toFixed(2)}
                                </td>
                                <td className="px-3 py-2">{variant.stock}</td>
                                <td className="px-3 py-2 text-center">
                                  <button
                                    onClick={() => removeVariant(idx)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-black transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProduct}
                    className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteConfirmOpen && productToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 border-b border-gray-200">
                  <h3 className="text-lg font-light">Delete Product</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-black">
                      {productToDelete.title}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
                <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-black transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    className="px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 transition"
                  >
                    Delete
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

export default Products;
