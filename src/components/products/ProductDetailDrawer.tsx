import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, Camera, Package } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../../types/product";
import ImageUpload, { ImagePlaceholder } from "../UI/ImageUpload";
import MultiImageUpload from "../UI/MultiImageUpload";
import { useUpdateProduct } from "../../hooks/useProducts";

const toUpdatePayload = (
  p: Product,
  primaryImage: string,
  secondaryImages: string[],
) => ({
  title: p.name || p.title || "",
  description: p.description || "",
  details: p.care || "",
  status: (p.status === "published" ? "active" : p.status) as
    | "active"
    | "draft"
    | "archived",
  primaryImage,
  secondaryImages,
  variants: p.variants || [],
});

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    published: "bg-green-100 text-green-700",
    draft: "bg-gray-100 text-gray-600",
    archived: "bg-red-100 text-red-700",
  };
  const label = status === "published" ? "active" : status;
  return (
    <span
      className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium ${map[status] || "bg-gray-100 text-gray-600"}`}
    >
      {label}
    </span>
  );
};

interface Props {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

const ProductDetailDrawer = ({ product, onClose, onEdit }: Props) => {
  const [editingImages, setEditingImages] = useState(false);
  const [primaryImage, setPrimaryImage] = useState("");
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);

  const updateProduct = useUpdateProduct();

  const currentPrimary =
    product?.images?.find((i) => i.isPrimary)?.url ||
    product?.images?.[0]?.url ||
    "";
  const currentSecondary =
    product?.images?.filter((i) => !i.isPrimary).map((i) => i.url) || [];

  const totalStock =
    product?.variants?.reduce((s, v) => s + (v.stock || 0), 0) ?? 0;

  const handleEditImages = () => {
    setPrimaryImage(currentPrimary);
    setSecondaryImages(currentSecondary);
    setEditingImages(true);
  };

  const handleSaveImages = () => {
    if (!product) return;
    updateProduct.mutate(
      {
        id: product.id || product._id,
        product: toUpdatePayload(product, primaryImage, secondaryImages),
      },
      {
        onSuccess: () => {
          toast.success("Images updated successfully");
          setEditingImages(false);
        },
        onError: () => toast.error("Failed to update images"),
      },
    );
  };

  return (
    <AnimatePresence>
      {product && (
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
            className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100 shrink-0">
              <div className="flex-1 min-w-0 pr-4">
                <StatusBadge status={product.status} />
                <h2 className="text-base font-medium text-gray-900 mt-1.5 truncate">
                  {product.name || product.title}
                </h2>
                {product.sku && (
                  <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                    SKU: {product.sku}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onEdit(product);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-xs text-gray-700 hover:border-black transition"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Product
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 transition text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {/* ── Images ── */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-gray-500">
                    Images
                  </p>
                  {!editingImages && (
                    <button
                      onClick={handleEditImages}
                      className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-black transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Update Images
                    </button>
                  )}
                </div>

                {editingImages ? (
                  <div className="space-y-4">
                    <ImageUpload
                      label="Primary Image"
                      value={primaryImage}
                      onChange={setPrimaryImage}
                    />
                    <MultiImageUpload
                      label="Additional Images"
                      values={secondaryImages}
                      onChange={setSecondaryImages}
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingImages(false)}
                        className="px-3 py-1.5 border border-gray-200 text-xs text-gray-600 hover:border-black transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveImages}
                        disabled={updateProduct.isPending}
                        className="px-4 py-1.5 bg-black text-white text-xs hover:bg-black/80 transition disabled:opacity-50"
                      >
                        {updateProduct.isPending ? "Saving…" : "Save Images"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                        Primary
                      </p>
                      {currentPrimary ? (
                        <img
                          src={currentPrimary}
                          alt={product.name || product.title}
                          className="w-full aspect-4/3 object-cover bg-gray-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <ImagePlaceholder className="w-full aspect-4/3" />
                      )}
                    </div>

                    {currentSecondary.length > 0 && (
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1.5">
                          Additional ({currentSecondary.length})
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {currentSecondary.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Photo ${i + 2}`}
                              className="w-full aspect-square object-cover bg-gray-100"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {currentSecondary.length === 0 && !currentPrimary && (
                      <p className="text-xs text-gray-400">No images uploaded yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* ── Overview stats ── */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                <div className="p-4 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1">Variants</p>
                  <p className="text-lg font-light">{product.variants?.length || 0}</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1">Stock</p>
                  <p className={`text-lg font-light ${totalStock === 0 ? "text-red-500" : ""}`}>
                    {totalStock}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1">Sold</p>
                  <p className="text-lg font-light">{product.salesCount || 0}</p>
                </div>
              </div>

              {/* ── Details ── */}
              {(product.description || product.care) && (
                <div className="p-5 border-b border-gray-100 space-y-4">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-gray-500">
                    Details
                  </p>
                  {product.description && (
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                        Description
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}
                  {product.care && (
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1">
                        Care Instructions
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {product.care}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Variants ── */}
              {product.variants && product.variants.length > 0 ? (
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-wider font-medium text-gray-500 mb-3">
                    Variants ({product.variants.length})
                  </p>
                  <div className="border border-gray-100 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {["#", "Color", "Size", "SKU", "Price", "Qty"].map(
                            (h) => (
                              <th
                                key={h}
                                className="px-3 py-2 text-left text-[9px] uppercase tracking-wider text-gray-400 font-normal"
                              >
                                {h}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-xs">
                        {product.variants.map((v, i) => (
                          <tr key={v.id || v._id || i} className="hover:bg-gray-50">
                            <td className="px-3 py-2.5 text-gray-400">{i + 1}</td>
                            <td className="px-3 py-2.5 text-gray-700">
                              {v.color}
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex flex-wrap gap-1">
                                {(v.sizes || []).map((s) => (
                                  <span key={s} className="px-1.5 py-0.5 bg-gray-100 text-[10px] font-medium text-gray-700">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2.5 font-mono text-gray-500 text-[10px]">
                              {v.sku}
                            </td>
                            <td className="px-3 py-2.5 font-medium text-gray-800">
                              ₦
                              {(v.price / 100).toLocaleString("en-NG", {
                                minimumFractionDigits: 0,
                              })}
                            </td>
                            <td
                              className={`px-3 py-2.5 font-medium ${v.stock === 0 ? "text-red-500" : "text-gray-700"}`}
                            >
                              {v.stock}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex flex-col items-center justify-center py-10 text-center">
                  <Package className="w-8 h-8 text-gray-200 mb-2" />
                  <p className="text-xs text-gray-400">No variants added yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailDrawer;
