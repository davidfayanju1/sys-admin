import { motion } from "framer-motion";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import type { Collection } from "../../hooks/useCollections";

interface Props {
  collection: Collection;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({ collection, onConfirm, onClose, isLoading }: Props) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.96, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-white w-full max-w-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-red-50 flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
          </div>
          <h3 className="text-sm font-light text-black">Delete Collection</h3>
        </div>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="p-1 hover:bg-black/5 transition text-black/40"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            This will permanently delete this collection and all its pieces. This
            action cannot be undone.
          </p>
        </div>
        <div className="p-3 border border-black/8">
          <p className="text-sm font-light text-black/80">{collection.name}</p>
          <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-widest">
            {collection.season} {collection.year}
          </p>
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
          {isLoading ? "Deleting…" : "Delete Collection"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default DeleteConfirmModal;
