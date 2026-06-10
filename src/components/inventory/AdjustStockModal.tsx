// components/inventory/AdjustStockModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import type { InventoryItem } from "../../types/inventory";

interface AdjustStockModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onConfirm: (delta: number) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const AdjustStockModal = ({
  isOpen,
  item,
  onConfirm,
  onClose,
  isLoading,
}: AdjustStockModalProps) => {
  const [delta, setDelta] = useState(0);

  //   const formatCurrency = (amount: number) => {
  //     return new Intl.NumberFormat("en-NG", {
  //       style: "currency",
  //       currency: "NGN",
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     }).format(amount / 100);
  //   };

  const handleConfirm = () => {
    if (delta !== 0) {
      onConfirm(delta);
      setDelta(0);
    }
  };

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
              <h3 className="text-lg font-light">Adjust Stock</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="font-medium text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-500">
                  {item.color} / {item.size} • SKU: {item.sku}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Current Stock
                </label>
                <p className="text-lg font-semibold">{item.stock} units</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Adjustment (+/-)
                </label>
                <input
                  type="number"
                  value={delta}
                  onChange={(e) => setDelta(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 focus:border-black outline-none text-sm"
                  placeholder="Enter quantity (use - for reduction)"
                  disabled={isLoading}
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
                  {Math.max(0, item.stock + delta)} units
                </p>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-700 text-sm hover:border-black transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-black text-white text-sm hover:bg-black/90 transition disabled:opacity-50"
                disabled={delta === 0 || isLoading}
              >
                {isLoading ? "Adjusting..." : "Apply Adjustment"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdjustStockModal;
