import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { InventoryItem } from "../../types/inventory";

interface AdjustStockModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onConfirm: (delta: number) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const AdjustStockModal = ({ isOpen, item, onConfirm, onClose, isLoading }: AdjustStockModalProps) => {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [qty, setQty] = useState<number | "">(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQty("");
      setMode("add");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, item]);

  const numQty = typeof qty === "number" ? qty : 0;
  const delta = mode === "add" ? numQty : -numQty;
  const currentStock = item?.stock ?? 0;
  const newStock = Math.max(0, currentStock + delta);
  const canConfirm = numQty > 0;

  const handleConfirm = () => {
    if (canConfirm) onConfirm(delta);
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
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-white w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <h3 className="text-sm font-light tracking-tight text-black">Adjust Stock</h3>
              <button onClick={onClose} className="p-1 hover:bg-black/5 transition text-black/40">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-5">
              {/* Item info */}
              <div className="p-3 bg-black/2 border border-black/5">
                <p className="text-sm font-light text-black/80">{item.name}</p>
                <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-widest">
                  {item.sku} · {item.category}
                </p>
              </div>

              {/* Current stock */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-black/50">Current Stock</p>
                <p className="text-sm font-light text-black/80">
                  {currentStock.toLocaleString()} <span className="text-black/40">{item.unit}</span>
                </p>
              </div>

              {/* Add / Remove toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("add")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs border transition ${
                    mode === "add"
                      ? "border-black bg-black text-white"
                      : "border-black/10 text-black/50 hover:border-black/30"
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Add Stock
                </button>
                <button
                  onClick={() => setMode("remove")}
                  className={`flex items-center justify-center gap-1.5 py-2 text-xs border transition ${
                    mode === "remove"
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-black/10 text-black/50 hover:border-black/30"
                  }`}
                >
                  <Minus className="w-3 h-3" />
                  Remove Stock
                </button>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                  Quantity ({item.unit})
                </label>
                <input
                  ref={inputRef}
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full px-3 py-2.5 border border-black/10 focus:outline-none focus:border-black text-sm font-light transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter quantity"
                  disabled={isLoading}
                />
              </div>

              {/* Preview */}
              {numQty > 0 && (
                <div className="flex items-center justify-between py-3 border-t border-black/5">
                  <p className="text-xs text-black/50">Stock After Adjustment</p>
                  <p className={`text-lg font-light ${newStock === 0 ? "text-red-600" : newStock <= (item.reorderLevel) ? "text-yellow-600" : "text-green-600"}`}>
                    {newStock.toLocaleString()} <span className="text-xs text-black/40">{item.unit}</span>
                  </p>
                </div>
              )}
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
                onClick={handleConfirm}
                disabled={!canConfirm || isLoading}
                className={`flex-1 py-2.5 text-white text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${
                  mode === "remove" ? "bg-red-500 hover:bg-red-600" : "bg-black hover:bg-black/80"
                }`}
              >
                {isLoading ? "Saving…" : mode === "add" ? "Add Stock" : "Remove Stock"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdjustStockModal;
