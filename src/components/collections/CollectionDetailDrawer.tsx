import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, PackageSearch, Trash2, RefreshCw, Star } from "lucide-react";
import {
  useCollectionProducts,
  useAttachProductsToCollection,
  useDetachProductFromCollection,
  type Collection,
} from "../../hooks/useCollections";
import ProductPickerModal from "./ProductPickerModal";
import type { Product } from "../../types/product";

const SEASON_LABELS: Record<string, string> = {
  SS: "Spring / Summer",
  AW: "Autumn / Winter",
  FW: "Fall / Winter",
  RS: "Resort",
  PF: "Pre-Fall",
  CO: "Cruise",
};

const GENDER_LABELS: Record<string, string> = {
  male: "Male",
  female: "Female",
};

interface Props {
  collection: Collection | null;
  onClose: () => void;
  onEdit: (collection: Collection) => void;
}

const CollectionDetailDrawer = ({ collection, onClose, onEdit }: Props) => {
  const [productPickerOpen, setProductPickerOpen] = useState(false);

  const collectionId = collection?._id || collection?.id || "";
  const { data: collectionProductsData, isLoading: isLoadingProducts } =
    useCollectionProducts(collectionId);
  const attachProducts = useAttachProductsToCollection();
  const detachProduct = useDetachProductFromCollection();
  const attachedProducts = collectionProductsData?.data ?? [];

  const piece = collection?.piece || collection?.pieces?.[0];

  const handleSelectProducts = (products: Product[]) => {
    setProductPickerOpen(false);
    if (!collectionId) return;
    attachProducts.mutate({
      id: collectionId,
      productIds: products.map((p) => p.id),
    });
  };

  const handleDetachProduct = (productId: string) => {
    if (!collectionId) return;
    detachProduct.mutate({ id: collectionId, productId });
  };

  return (
    <AnimatePresence>
      {collection && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.22 }}
            className="fixed right-0 top-0 h-full w-full max-w-[560px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-black/10 shrink-0">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  {collection.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-[9px] uppercase tracking-wider font-medium text-amber-700">
                      <Star className="w-2.5 h-2.5" />
                      Featured
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium ${
                      collection.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {collection.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <h2 className="text-base font-light text-black mt-1.5 truncate">
                  {collection.name}
                </h2>
                <p className="text-[10px] text-black/40 mt-0.5">
                  {collection.season}
                  {collection.year ? ` · ${collection.year}` : ""}
                  {collection.season && SEASON_LABELS[collection.season]
                    ? ` · ${SEASON_LABELS[collection.season]}`
                    : ""}
                  {collection.gender && GENDER_LABELS[collection.gender]
                    ? ` · ${GENDER_LABELS[collection.gender]}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onEdit(collection);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-black/10 text-xs text-black/70 hover:border-black transition"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-black/5 transition text-black/40 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* Cover image */}
              <div className="p-5 border-b border-black/10">
                {collection.coverImage ? (
                  <img
                    src={collection.coverImage}
                    alt={collection.name}
                    className="w-full aspect-[16/9] object-cover bg-black/5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full aspect-[16/9] bg-black/3 flex items-center justify-center">
                    <span className="text-[9px] uppercase tracking-widest text-black/20">
                      No cover image
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              {(collection.tagline || collection.description) && (
                <div className="p-5 border-b border-black/10 space-y-3">
                  {collection.tagline && (
                    <p className="text-sm italic text-black/60">
                      "{collection.tagline}"
                    </p>
                  )}
                  {collection.description && (
                    <p className="text-xs text-black/60 leading-relaxed">
                      {collection.description}
                    </p>
                  )}
                </div>
              )}

              {/* Piece */}
              {piece && (
                <div className="p-5 border-b border-black/10">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-black/40 mb-3">
                    Included Piece
                  </p>
                  <div className="border border-black/8 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-light text-black truncate">
                          {piece.name}
                        </p>
                        <p className="text-[10px] font-mono text-black/40 mt-0.5">
                          {piece.sku}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-black shrink-0">
                        {piece.currency} {piece.price?.toLocaleString()}
                      </span>
                    </div>
                    {piece.category && (
                      <p className="text-[10px] text-black/40">{piece.category}</p>
                    )}
                    {piece.sizes && piece.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {piece.sizes.map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 bg-black/5 text-[10px] font-medium text-black/60"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {piece.colors && piece.colors.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {piece.colors.map((c, i) => (
                          <div key={i} className="flex items-center gap-1">
                            <div
                              className="w-3 h-3 border border-black/10"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span className="text-[10px] text-black/50">{c.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Products */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-black/40">
                    Products ({attachedProducts.length})
                  </p>
                  <button
                    type="button"
                    onClick={() => setProductPickerOpen(true)}
                    className="flex items-center gap-1.5 text-[11px] text-black/50 hover:text-black transition"
                  >
                    <PackageSearch className="w-3.5 h-3.5" />
                    Add Product
                  </button>
                </div>

                {isLoadingProducts ? (
                  <div className="py-8 text-center">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto text-black/30" />
                  </div>
                ) : attachedProducts.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-black/10">
                    <p className="text-xs text-black/40 tracking-wide">
                      No products attached to this collection yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 border border-black/8"
                      >
                        <img
                          src={
                            p.image ||
                            "https://placehold.co/200x200/e2e8f0/64748b?text=No+Image"
                          }
                          alt={p.name}
                          className="w-12 h-12 object-cover bg-black/5 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/200x200/e2e8f0/64748b?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-light text-black truncate">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-black/40 mt-0.5">
                            {p.currency} {p.price?.toLocaleString()}
                            {p.category?.name && ` · ${p.category.name}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDetachProduct(p.id)}
                          disabled={detachProduct.isPending}
                          className="text-black/30 hover:text-red-500 transition disabled:opacity-40"
                          title="Remove from collection"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}

      <ProductPickerModal
        isOpen={productPickerOpen}
        onClose={() => setProductPickerOpen(false)}
        onSelect={handleSelectProducts}
      />
    </AnimatePresence>
  );
};

export default CollectionDetailDrawer;
