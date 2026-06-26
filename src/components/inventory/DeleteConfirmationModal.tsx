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

const DeleteConfirmModal = ({ isOpen, item, onConfirm, onClose, isLoading }: DeleteConfirmModalProps) => {
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
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-white w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-red-50 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                </div>
                <h3 className="text-sm font-light text-black">Remove Material</h3>
              </div>
              <button onClick={onClose} disabled={isLoading} className="p-1 hover:bg-black/5 transition text-black/40">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  This will permanently remove this material from your inventory. This action cannot be undone.
                </p>
              </div>

              <div className="p-3 bg-black/2 border border-black/5">
                <p className="text-sm font-light text-black/80">{item.name}</p>
                <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-widest">
                  {item.sku} · {item.category}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-black/30 mb-1">Current Stock</p>
                  <p className="text-sm font-light text-black/70">
                    {item.stock} <span className="text-black/40">{item.unit}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-black/30 mb-1">Location</p>
                  <p className="text-sm font-light text-black/70">{item.location || "—"}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-5 py-4 border-t border-black/10">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm hover:bg-red-700 transition disabled:opacity-50"
              >
                {isLoading ? "Removing…" : "Remove Material"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmModal;
