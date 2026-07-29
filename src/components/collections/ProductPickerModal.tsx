import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, RefreshCw, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { getCategoryName, type Product } from "../../types/product";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (products: Product[]) => void;
}

const ProductPickerModal = ({ isOpen, onClose, onSelect }: Props) => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Map<string, Product>>(new Map());

  const { data, isLoading, isFetching } = useProducts(page, 12, search);
  const products = data?.data ?? [];
  const meta = data?.meta;

  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    setSearchInput("");
    setSearch("");
    setSelected(new Map());
  }, [isOpen]);

  const getPrimaryImage = (product: Product) => {
    const primary = product.images?.find((img) => img.isPrimary);
    return (
      primary?.url ||
      product.images?.[0]?.url ||
      "https://placehold.co/200x200/e2e8f0/64748b?text=No+Image"
    );
  };

  const getPriceDisplay = (product: Product) => {
    const price = product.finalPrice || product.price || 0;
    return `${product.currency || "NGN"} ${price.toLocaleString()}`;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const toggleSelect = (product: Product) => {
    const id = product.id || product._id;
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(id)) next.delete(id);
      else next.set(id, product);
      return next;
    });
  };

  const handleAddSelected = () => {
    if (selected.size === 0) return;
    onSelect(Array.from(selected.values()));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center overflow-y-auto py-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="bg-white w-full max-w-2xl mx-4 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
              <div>
                <h3 className="text-sm font-light tracking-wide text-black">
                  Choose Products
                </h3>
                <p className="text-[10px] text-black/40 mt-0.5">
                  Select one or more existing products to attach
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-black/5 transition text-black/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="px-6 py-3 border-b border-black/10 shrink-0"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products by name or SKU…"
                  className="w-full pl-9 pr-3 py-2.5 border border-black/10 focus:outline-none focus:border-black text-sm font-light transition bg-white"
                />
              </div>
            </form>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isLoading ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-black/30" />
                  <p className="text-xs text-black/40 mt-3 font-light">
                    Loading products…
                  </p>
                </div>
              ) : products.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-xs text-black/40 tracking-wide">
                    No products found.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => {
                    const id = product.id || product._id;
                    const isSelected = selected.has(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleSelect(product)}
                        className={`w-full flex items-center gap-3 p-3 border transition text-left ${
                          isSelected
                            ? "border-black bg-black/3"
                            : "border-black/8 hover:border-black/30 hover:bg-black/2"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 border shrink-0 flex items-center justify-center ${
                            isSelected
                              ? "bg-black border-black"
                              : "border-black/20"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <img
                          src={getPrimaryImage(product)}
                          alt={product.name}
                          className="w-12 h-12 object-cover bg-black/5 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/200x200/e2e8f0/64748b?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-light text-black truncate">
                            {product.name || product.title}
                          </p>
                          <p className="text-[10px] text-black/40 mt-0.5">
                            {product.sku}
                            {getCategoryName(product.category) &&
                              ` · ${getCategoryName(product.category)}`}
                          </p>
                        </div>
                        <span className="text-xs font-light text-black/70 shrink-0">
                          {getPriceDisplay(product)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-black/10 shrink-0">
                <span className="text-[10px] text-black/40">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!meta.hasPrev || isFetching}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 border border-black/10 disabled:opacity-30 hover:border-black/40 transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={!meta.hasNext || isFetching}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-1.5 border border-black/10 disabled:opacity-30 hover:border-black/40 transition"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-black/10 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSelected}
                disabled={selected.size === 0}
                className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selected.size === 0
                  ? "Select products"
                  : `Add ${selected.size} Product${selected.size > 1 ? "s" : ""}`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductPickerModal;
