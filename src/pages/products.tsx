// pages/Products.tsx
import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  useProducts,
  useProductSummary,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../hooks/useProducts";
import ProductStats from "../components/products/ProductsStats";
import ProductSearchFilters from "../components/products/ProductSearchFilter";
import ProductTable from "../components/products/ProductTable";
import ProductFormModal from "../components/products/ProductFormModal";
import DeleteConfirmModal from "../components/products/DeleteConfirmModal";
import ProductDetailDrawer from "../components/products/ProductDetailDrawer";
import type { Product, Variant } from "../types/product";
import {
  isSizeEntryArray,
  getVariantSizeNames,
  getCategoryId,
} from "../types/product";

// Converts a new-format API variant (sizes: SizeEntry[]) to the flat form format
const normalizeVariantForForm = (v: Variant): Variant => {
  if (!v.sizes || !isSizeEntryArray(v.sizes)) return v;
  const firstSize = v.sizes[0];
  return {
    id: v.id,
    _id: v._id,
    color: v.color,
    sizes: getVariantSizeNames(v),
    price: firstSize?.price || 0,
    currency: firstSize?.currency || "NGN",
    images: v.images || [],
  };
};

// Helper function to transform API product to form data
const transformProductToFormData = (product: Product) => {
  const primaryImageObj = product.images?.find((img) => img.isPrimary);
  const primaryImage = primaryImageObj?.url || product.images?.[0]?.url || "";
  const secondaryImages =
    product.images?.filter((img) => !img.isPrimary).map((img) => img.url) || [];

  return {
    title: product.name || product.title || "",
    description: product.description || "",
    details: product.care || "",
    category: getCategoryId(product.category),
    gender: (product.gender || "") as "" | "male" | "female",
    status: (product.status === "published" ? "active" : product.status) as
      | "active"
      | "draft"
      | "archived",
    primaryImage,
    secondaryImages,
    stock: product.stock || 0,
    variants: (product.variants || []).map(normalizeVariantForForm),
  };
};

const Products = () => {
  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    category: "",
    gender: "" as "" | "male" | "female",
    status: "active" as "active" | "draft" | "archived",
    primaryImage: "",
    secondaryImages: [] as string[],
    stock: 0,
    variants: [] as Variant[],
  });

  const [currentVariant, setCurrentVariant] = useState<Omit<Variant, "id">>({
    color: "",
    sizes: [],
    price: 0,
    currency: "NGN",
    images: [],
  });

  const [editingVariantIdx, setEditingVariantIdx] = useState(-1);

  // Queries
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useProducts(currentPage, itemsPerPage, searchTerm, statusFilter);
  const { data: summary, isLoading: isLoadingSummary } = useProductSummary();

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const blankVariant = (): Omit<Variant, "id"> => ({
    color: "",
    sizes: [],
    price: 0,
    currency: "NGN",
    images: [],
  });

  const handleAddVariant = () => {
    if (!currentVariant.color || !(currentVariant.sizes || []).length) {
      toast.error("Please fill in color and at least one size");
      return;
    }
    const newVariant: Variant = {
      ...currentVariant,
      id: Date.now().toString(),
      price: (currentVariant.price || 0) * 100,
    };
    setFormData({ ...formData, variants: [...formData.variants, newVariant] });
    setCurrentVariant(blankVariant());
  };

  const handleEditVariant = (index: number) => {
    const v = formData.variants[index];
    setCurrentVariant({
      color: v.color,
      sizes: getVariantSizeNames(v),
      price: (v.price || 0) / 100,
      currency: v.currency || "NGN",
      images: v.images || [],
    });
    setEditingVariantIdx(index);
  };

  const handleUpdateVariant = () => {
    if (!currentVariant.color || !(currentVariant.sizes || []).length) {
      toast.error("Please fill in color and at least one size");
      return;
    }
    const updated = formData.variants.map((v, i) =>
      i === editingVariantIdx
        ? { ...v, ...currentVariant, price: (currentVariant.price || 0) * 100 }
        : v,
    );
    setFormData({ ...formData, variants: updated });
    setEditingVariantIdx(-1);
    setCurrentVariant(blankVariant());
  };

  const handleCancelEditVariant = () => {
    setEditingVariantIdx(-1);
    setCurrentVariant(blankVariant());
  };

  const handleRemoveVariant = (index: number) => {
    if (editingVariantIdx === index) {
      setEditingVariantIdx(-1);
      setCurrentVariant(blankVariant());
    }
    setFormData({
      ...formData,
      variants: formData.variants.filter((_, i) => i !== index),
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData(transformProductToFormData(product));
    setIsModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!formData.title) {
      alert("Please fill in product title");
      return;
    }
    if (formData.variants.length === 0) {
      alert("Please add at least one variant");
      return;
    }

    const payload = { ...formData, gender: formData.gender || undefined };

    console.log(payload, "Product Payload");

    if (editingProduct) {
      updateProduct.mutate(
        {
          id: editingProduct.id || editingProduct._id,
          product: payload,
        },
        { onSuccess: closeModal },
      );
    } else {
      createProduct.mutate(payload, { onSuccess: closeModal });
    }
  };

  const isSavingProduct = createProduct.isPending || updateProduct.isPending;

  const handleDeleteProduct = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete.id || productToDelete._id);
      setProductToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      title: "",
      description: "",
      details: "",
      category: "",
      gender: "",
      status: "active",
      primaryImage: "",
      secondaryImages: [],
      stock: 0,
      variants: [],
    });
    setCurrentVariant({
      color: "",
      sizes: [],
      price: 0,
      currency: "NGN",
      images: [],
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Products</h1>
            <div className="w-12 h-px bg-black/10 mt-2" />
            <p className="text-xs text-gray-500 mt-3">
              Manage RTW product catalog, variants, and inventory
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <ProductStats summary={summary} isLoading={isLoadingSummary} />

        {/* Search and Filters */}
        <ProductSearchFilters
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        />

        {/* Products Table */}
        <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
          <ProductTable
            products={productsData?.data || []}
            totalRows={productsData?.meta?.total || 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPerRowsChange={handlePerRowsChange}
            onViewDetails={setViewingProduct}
            onEdit={handleEditProduct}
            onDelete={setProductToDelete}
            isLoading={isLoadingProducts}
            isFetching={isFetchingProducts}
          />
        </div>

        {/* Product Form Modal */}
        <ProductFormModal
          isOpen={isModalOpen}
          editingProduct={editingProduct}
          formData={formData}
          currentVariant={currentVariant}
          editingVariantIndex={editingVariantIdx}
          onFormChange={setFormData}
          onVariantChange={setCurrentVariant}
          onAddVariant={handleAddVariant}
          onEditVariant={handleEditVariant}
          onUpdateVariant={handleUpdateVariant}
          onCancelEditVariant={handleCancelEditVariant}
          onRemoveVariant={handleRemoveVariant}
          onClose={closeModal}
          onSave={handleSaveProduct}
          isSaving={isSavingProduct}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!productToDelete}
          product={productToDelete}
          onConfirm={handleDeleteProduct}
          onClose={() => setProductToDelete(null)}
        />
      </div>

      {/* Product Detail Drawer */}
      <ProductDetailDrawer
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={(product) => {
          setViewingProduct(null);
          handleEditProduct(product);
        }}
      />
    </DashboardLayout>
  );
};

export default Products;
