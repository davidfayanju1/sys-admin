// components/inventory/DeleteConfirmModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import type { InventoryItem } from "../../types/inventory";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({
  isOpen,
  item,
  onConfirm,
  onClose,
  isLoading,
}: DeleteConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-lg font-light">Delete Inventory Item</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 transition"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  This action cannot be undone. This will permanently delete the
                  inventory item from the system.
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-medium text-gray-900">{item.productName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">SKU</p>
                  <p className="text-sm font-mono text-gray-700">{item.sku}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Variant</p>
                  <p className="text-sm text-gray-700">
                    {item.color} / {item.size}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Current Stock</p>
                <p className="text-sm font-medium text-gray-900">
                  {item.stock} units
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-gray-300 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Item"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
