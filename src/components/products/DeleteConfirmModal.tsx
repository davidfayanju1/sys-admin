// components/products/DeleteConfirmModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "../../types/product";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  product,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && product && (
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
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-light">Delete Product</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-medium text-black">{product.title}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-black transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
