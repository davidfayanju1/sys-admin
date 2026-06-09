// components/products/ProductFormModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ImageUploadSection from "./ImageUploadSection";
import VariantForm from "./VariantForm";
import VariantTable from "./VariantTable";
import type { Product, Variant } from "../../types/product";

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  formData: {
    title: string;
    description: string;
    details: string;
    status: "active" | "draft" | "archived";
    primaryImage: string;
    secondaryImages: string[];
    variants: Variant[];
  };
  currentVariant: Omit<Variant, "id">;
  onFormChange: (data: any) => void;
  onVariantChange: (variant: Omit<Variant, "id">) => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onClose: () => void;
  onSave: () => void;
}

const ProductFormModal = ({
  isOpen,
  editingProduct,
  formData,
  currentVariant,
  onFormChange,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
  onClose,
  onSave,
}: ProductFormModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-light">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={onClose}
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
                      value={formData.title || ""}
                      onChange={(e) =>
                        onFormChange({ ...formData, title: e.target.value })
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
                      value={formData.status || "active"}
                      onChange={(e) =>
                        onFormChange({
                          ...formData,
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
                      value={formData.description || ""}
                      onChange={(e) =>
                        onFormChange({
                          ...formData,
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
                      Details / Care Instructions
                    </label>
                    <textarea
                      value={formData.details || ""}
                      onChange={(e) =>
                        onFormChange({ ...formData, details: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm resize-none"
                      placeholder="Care instructions, materials, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <ImageUploadSection
                primaryImage={formData.primaryImage || ""}
                onPrimaryImageChange={(url) =>
                  onFormChange({ ...formData, primaryImage: url })
                }
                secondaryImages={formData.secondaryImages || []}
                onSecondaryImagesChange={(images) =>
                  onFormChange({ ...formData, secondaryImages: images })
                }
              />

              {/* Variants */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Variants
                </h4>
                <VariantForm
                  variant={currentVariant}
                  onVariantChange={onVariantChange}
                  onAddVariant={onAddVariant}
                />
                <VariantTable
                  variants={formData.variants || []}
                  onRemoveVariant={onRemoveVariant}
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-black transition"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition"
              >
                {editingProduct ? "Update Product" : "Create Product"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;
