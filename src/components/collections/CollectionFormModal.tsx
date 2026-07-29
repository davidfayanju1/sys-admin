import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Plus, Trash2, RefreshCw, PackageSearch } from "lucide-react";
import { useUploadMedia } from "../../hooks/useMedia";
import { toast } from "sonner";
import {
  useCollectionProducts,
  useAttachProductsToCollection,
  useDetachProductFromCollection,
  type Collection,
  type CollectionPiece,
  type CollectionColor,
  type CollectionImage,
  type CreateCollectionPayload,
  type UpdateCollectionPayload,
} from "../../hooks/useCollections";
import ProductPickerModal from "./ProductPickerModal";
import type { Product } from "../../types/product";

interface Props {
  isOpen: boolean;
  editingCollection: Collection | null;
  onConfirm: (payload: CreateCollectionPayload | UpdateCollectionPayload) => void;
  onClose: () => void;
  isLoading: boolean;
}

const SEASONS = ["SS", "AW", "FW", "RS", "PF", "CO"];
const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];
const CURRENCIES = ["NGN", "GBP", "USD", "EUR"];

const EMPTY_PIECE: CollectionPiece = {
  name: "",
  category: "",
  price: 0,
  currency: "NGN",
  description: "",
  sku: "",
  material: "",
  fitNotes: "",
  careInstructions: [],
  colors: [],
  sizes: [],
  images: [],
  status: "published",
};

const EMPTY_COLLECTION = {
  name: "",
  year: new Date().getFullYear(),
  season: "SS",
  tagline: "",
  description: "",
  coverImage: "",
  featured: false,
  isPublished: true,
};

const inputCls =
  "w-full px-3 py-2.5 border border-black/10 focus:outline-none focus:border-black text-sm font-light transition bg-white";

const FieldLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
    {children}
    {required && " *"}
  </label>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[9px] uppercase tracking-widest text-black/30 mb-4">{children}</p>
);

const CollectionFormModal = ({
  isOpen,
  editingCollection,
  onConfirm,
  onClose,
  isLoading,
}: Props) => {
  const [activeTab, setActiveTab] = useState<"collection" | "piece" | "products">(
    "collection"
  );
  const [col, setColData] = useState(EMPTY_COLLECTION);
  const [piece, setPieceData] = useState<CollectionPiece>(EMPTY_PIECE);
  const [includePiece, setIncludePiece] = useState(false);
  const [careInput, setCareInput] = useState("");
  const [newColor, setNewColor] = useState<CollectionColor>({ name: "", hex: "#000000" });
  const [productPickerOpen, setProductPickerOpen] = useState(false);

  const coverRef = useRef<HTMLInputElement>(null);
  const pieceImgRef = useRef<HTMLInputElement>(null);
  const uploadMedia = useUploadMedia();

  const collectionId = editingCollection?._id || editingCollection?.id || "";
  const { data: collectionProductsData, isLoading: isLoadingCollectionProducts } =
    useCollectionProducts(collectionId);
  const attachProducts = useAttachProductsToCollection();
  const detachProduct = useDetachProductFromCollection();
  const attachedProducts = collectionProductsData?.data ?? [];

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("collection");
    setCareInput("");
    setNewColor({ name: "", hex: "#000000" });

    if (editingCollection) {
      setColData({
        name: editingCollection.name || "",
        year: editingCollection.year || new Date().getFullYear(),
        season: editingCollection.season || "SS",
        tagline: editingCollection.tagline || "",
        description: editingCollection.description || "",
        coverImage: editingCollection.coverImage || "",
        featured: editingCollection.featured || false,
        isPublished: editingCollection.isPublished || false,
      });
      const existingPiece =
        editingCollection.piece || editingCollection.pieces?.[0];
      if (existingPiece) {
        setPieceData({
          slug: existingPiece.slug,
          name: existingPiece.name || "",
          category: existingPiece.category || "",
          price: existingPiece.price || 0,
          currency: existingPiece.currency || "NGN",
          description: existingPiece.description || "",
          sku: existingPiece.sku || "",
          material: existingPiece.material || "",
          fitNotes: existingPiece.fitNotes || "",
          careInstructions: existingPiece.careInstructions || [],
          colors: existingPiece.colors || [],
          sizes: existingPiece.sizes || [],
          images: existingPiece.images || [],
          status: existingPiece.status || "published",
        });
        setIncludePiece(true);
      } else {
        setPieceData(EMPTY_PIECE);
        setIncludePiece(false);
      }
    } else {
      setColData(EMPTY_COLLECTION);
      setPieceData(EMPTY_PIECE);
      setIncludePiece(false);
    }
  }, [isOpen, editingCollection]);

  const setCol = (key: string, value: any) =>
    setColData((prev) => ({ ...prev, [key]: value }));

  const setPiece = (key: string, value: any) =>
    setPieceData((prev) => ({ ...prev, [key]: value }));

  const uploadImage = (file: File, onUrl: (url: string) => void) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    uploadMedia.mutate(fd, {
      onSuccess: (res) => onUrl(res.data.url),
      onError: () => toast.error("Upload failed"),
    });
  };

  // Care instructions
  const addCare = () => {
    if (!careInput.trim()) return;
    setPiece("careInstructions", [
      ...piece.careInstructions,
      careInput.trim(),
    ]);
    setCareInput("");
  };

  // Colors
  const addColor = () => {
    if (!newColor.name.trim()) {
      toast.error("Color name is required");
      return;
    }
    setPiece("colors", [...piece.colors, { ...newColor }]);
    setNewColor({ name: "", hex: "#000000" });
  };

  // Sizes
  const toggleSize = (size: string) =>
    setPiece(
      "sizes",
      piece.sizes.includes(size)
        ? piece.sizes.filter((s) => s !== size)
        : [...piece.sizes, size]
    );

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

  // Images
  const updateImage = (i: number, key: keyof CollectionImage, value: any) => {
    const updated = piece.images.map((img, idx) => {
      if (key === "isPrimary") return { ...img, isPrimary: idx === i };
      return idx === i ? { ...img, [key]: value } : img;
    });
    setPiece("images", updated);
  };

  const validate = (): boolean => {
    if (!col.name.trim()) {
      toast.error("Collection name is required");
      setActiveTab("collection");
      return false;
    }
    if (!col.year || col.year < 2000) {
      toast.error("A valid year is required");
      setActiveTab("collection");
      return false;
    }
    if (includePiece) {
      if (!piece.name.trim()) {
        toast.error("Piece name is required");
        setActiveTab("piece");
        return false;
      }
      if (!piece.sku.trim()) {
        toast.error("Piece SKU is required");
        setActiveTab("piece");
        return false;
      }
      if (!piece.price || piece.price <= 0) {
        toast.error("Piece price must be greater than 0");
        setActiveTab("piece");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      ...col,
      ...(includePiece ? { piece } : {}),
    };
    onConfirm(payload);
  };

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
            transition={{ duration: 0.18 }}
            className="bg-white w-full max-w-2xl mx-4 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
              <div>
                <h3 className="text-sm font-light tracking-wide text-black">
                  {editingCollection ? "Edit Collection" : "New Collection"}
                </h3>
                <p className="text-[10px] text-black/40 mt-0.5">
                  {editingCollection
                    ? editingCollection.name
                    : "Create a new fashion collection"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-black/5 transition text-black/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-black/10 shrink-0">
              {(["collection", "piece", "products"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-[10px] uppercase tracking-widest font-medium transition border-b-2 ${
                    activeTab === tab
                      ? "border-black text-black"
                      : "border-transparent text-black/40 hover:text-black/60"
                  }`}
                >
                  {tab === "collection"
                    ? "Collection"
                    : tab === "piece"
                    ? `Piece${includePiece ? " ✓" : " (optional)"}`
                    : `Products${
                        attachedProducts.length ? ` (${attachedProducts.length})` : ""
                      }`}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* ── Collection Tab ─────────────────────────────────────── */}
              {activeTab === "collection" && (
                <div className="space-y-4">
                  {/* Cover Image */}
                  <div>
                    <FieldLabel>Cover Image</FieldLabel>
                    <div
                      className="relative w-full h-40 bg-black/3 border border-black/10 flex items-center justify-center cursor-pointer hover:bg-black/5 transition overflow-hidden group"
                      onClick={() => coverRef.current?.click()}
                    >
                      {col.coverImage ? (
                        <>
                          <img
                            src={col.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            {uploadMedia.isPending ? (
                              <RefreshCw className="w-6 h-6 text-white animate-spin" />
                            ) : (
                              <Upload className="w-6 h-6 text-white" />
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-black/30">
                          {uploadMedia.isPending ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          ) : (
                            <Upload className="w-6 h-6" />
                          )}
                          <span className="text-[10px] uppercase tracking-widest">
                            {uploadMedia.isPending
                              ? "Uploading…"
                              : "Upload cover image"}
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      ref={coverRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file, (url) => setCol("coverImage", url));
                        e.target.value = "";
                      }}
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <FieldLabel required>Collection Name</FieldLabel>
                    <input
                      value={col.name}
                      onChange={(e) => setCol("name", e.target.value)}
                      placeholder="e.g. Conscious Couture"
                      className={inputCls}
                    />
                  </div>

                  {/* Year + Season */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel required>Year</FieldLabel>
                      <input
                        type="number"
                        value={col.year}
                        onChange={(e) => setCol("year", Number(e.target.value))}
                        min={2000}
                        max={2100}
                        onWheel={(e) => e.currentTarget.blur()}
                        className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                    </div>
                    <div>
                      <FieldLabel required>Season</FieldLabel>
                      <select
                        value={col.season}
                        onChange={(e) => setCol("season", e.target.value)}
                        className={inputCls}
                      >
                        {SEASONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div>
                    <FieldLabel>Tagline</FieldLabel>
                    <input
                      value={col.tagline}
                      onChange={(e) => setCol("tagline", e.target.value)}
                      placeholder="e.g. Crafted for the modern visionary"
                      className={inputCls}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <FieldLabel>Description</FieldLabel>
                    <textarea
                      value={col.description}
                      onChange={(e) => setCol("description", e.target.value)}
                      rows={3}
                      placeholder="Collection description…"
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Featured + Published toggles */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        key: "featured",
                        label: "Featured",
                        sub: "Highlight this collection",
                        val: col.featured,
                      },
                      {
                        key: "isPublished",
                        label: "Published",
                        sub: "Visible on storefront",
                        val: col.isPublished,
                      },
                    ].map(({ key, label, sub, val }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 border border-black/10"
                      >
                        <div>
                          <p className="text-xs font-light text-black/80">{label}</p>
                          <p className="text-[9px] text-black/40 mt-0.5">{sub}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCol(key, !val)}
                          className={`relative w-10 h-5 shrink-0 transition-colors ${val ? "bg-black" : "bg-black/20"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${val ? "right-0.5" : "left-0.5"}`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Piece Tab ──────────────────────────────────────────── */}
              {activeTab === "piece" && (
                <div className="space-y-6">
                  {/* Include piece toggle */}
                  <div className="flex items-center justify-between p-3 bg-black/2 border border-black/8">
                    <div>
                      <p className="text-xs font-light text-black/80">
                        Include a piece with this collection
                      </p>
                      <p className="text-[9px] text-black/40 mt-0.5">
                        A design item nested within the collection
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIncludePiece(!includePiece)}
                      className={`relative w-10 h-5 shrink-0 transition-colors ${includePiece ? "bg-black" : "bg-black/20"}`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${includePiece ? "right-0.5" : "left-0.5"}`}
                      />
                    </button>
                  </div>

                  {includePiece && (
                    <>
                      {/* Basic info */}
                      <section>
                        <SectionHeading>Basic Info</SectionHeading>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <FieldLabel required>Piece Name</FieldLabel>
                            <input
                              value={piece.name}
                              onChange={(e) => setPiece("name", e.target.value)}
                              placeholder="e.g. Celestial Silk Gown"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <FieldLabel required>SKU</FieldLabel>
                            <input
                              value={piece.sku}
                              onChange={(e) =>
                                setPiece("sku", e.target.value.toUpperCase())
                              }
                              placeholder="CSG-2024-001"
                              className={`${inputCls} font-mono uppercase tracking-wide`}
                            />
                          </div>
                          <div>
                            <FieldLabel>Category</FieldLabel>
                            <input
                              value={piece.category}
                              onChange={(e) => setPiece("category", e.target.value)}
                              placeholder="e.g. Evening Wear"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <FieldLabel required>Price</FieldLabel>
                            <input
                              type="number"
                              min={0}
                              value={piece.price || ""}
                              onChange={(e) =>
                                setPiece("price", Number(e.target.value))
                              }
                              onWheel={(e) => e.currentTarget.blur()}
                              placeholder="0"
                              className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            />
                          </div>
                          <div>
                            <FieldLabel>Currency</FieldLabel>
                            <select
                              value={piece.currency}
                              onChange={(e) => setPiece("currency", e.target.value)}
                              className={inputCls}
                            >
                              {CURRENCIES.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <FieldLabel>Material</FieldLabel>
                            <input
                              value={piece.material}
                              onChange={(e) => setPiece("material", e.target.value)}
                              placeholder="e.g. 100% Mulberry Silk"
                              className={inputCls}
                            />
                          </div>
                          <div>
                            <FieldLabel>Status</FieldLabel>
                            <select
                              value={piece.status}
                              onChange={(e) => setPiece("status", e.target.value)}
                              className={inputCls}
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <FieldLabel>Description</FieldLabel>
                            <textarea
                              value={piece.description}
                              onChange={(e) =>
                                setPiece("description", e.target.value)
                              }
                              rows={3}
                              placeholder="Piece description…"
                              className={`${inputCls} resize-none`}
                            />
                          </div>
                          <div className="col-span-2">
                            <FieldLabel>Fit Notes</FieldLabel>
                            <textarea
                              value={piece.fitNotes || ""}
                              onChange={(e) =>
                                setPiece("fitNotes", e.target.value)
                              }
                              rows={2}
                              placeholder='e.g. True to size, model is 5&apos;9" wearing size S'
                              className={`${inputCls} resize-none`}
                            />
                          </div>
                        </div>
                      </section>

                      {/* Sizes */}
                      <section>
                        <SectionHeading>Sizes</SectionHeading>
                        <div className="flex flex-wrap gap-2">
                          {SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleSize(size)}
                              className={`px-3 py-1.5 text-xs font-light border transition ${
                                piece.sizes.includes(size)
                                  ? "bg-black text-white border-black"
                                  : "border-black/15 text-black/50 hover:border-black/40"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </section>

                      {/* Colors */}
                      <section>
                        <SectionHeading>Colors</SectionHeading>
                        {piece.colors.length > 0 && (
                          <div className="space-y-1.5 mb-3">
                            {piece.colors.map((c, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 p-2 border border-black/8 bg-black/1"
                              >
                                <div
                                  className="w-5 h-5 border border-black/10 shrink-0"
                                  style={{ backgroundColor: c.hex }}
                                />
                                <span className="text-xs font-light text-black/70 flex-1">
                                  {c.name}
                                </span>
                                <span className="text-[10px] font-mono text-black/30">
                                  {c.hex}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPiece(
                                      "colors",
                                      piece.colors.filter((_, idx) => idx !== i)
                                    )
                                  }
                                  className="text-black/30 hover:text-red-500 transition"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={newColor.hex}
                            onChange={(e) =>
                              setNewColor((prev) => ({
                                ...prev,
                                hex: e.target.value,
                              }))
                            }
                            className="w-10 h-[42px] border border-black/10 p-0.5 cursor-pointer bg-white shrink-0"
                          />
                          <input
                            value={newColor.name}
                            onChange={(e) =>
                              setNewColor((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            placeholder="Color name (e.g. Navy)"
                            className={`${inputCls} flex-1`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addColor();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addColor}
                            className="px-3 border border-black/15 hover:border-black text-black/50 hover:text-black transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </section>

                      {/* Care Instructions */}
                      <section>
                        <SectionHeading>Care Instructions</SectionHeading>
                        {piece.careInstructions.length > 0 && (
                          <div className="space-y-1.5 mb-3">
                            {piece.careInstructions.map((care, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-2 border border-black/8 bg-black/1"
                              >
                                <span className="text-xs font-light text-black/70 flex-1">
                                  {care}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeCare(i)}
                                  className="text-black/30 hover:text-red-500 transition"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            value={careInput}
                            onChange={(e) => setCareInput(e.target.value)}
                            placeholder="e.g. Dry clean only"
                            className={`${inputCls} flex-1`}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addCare();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addCare}
                            className="px-3 border border-black/15 hover:border-black text-black/50 hover:text-black transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </section>

                      {/* Piece Images */}
                      <section>
                        <SectionHeading>Images</SectionHeading>
                        {piece.images.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {piece.images.map((img, i) => (
                              <div
                                key={i}
                                className="border border-black/8 p-3"
                              >
                                <div className="flex items-start gap-3">
                                  <img
                                    src={img.url}
                                    alt={img.alt || ""}
                                    className="w-14 h-14 object-cover bg-black/5 shrink-0"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display =
                                        "none";
                                    }}
                                  />
                                  <div className="flex-1 space-y-2">
                                    <input
                                      value={img.alt || ""}
                                      onChange={(e) =>
                                        updateImage(i, "alt", e.target.value)
                                      }
                                      placeholder="Alt text (optional)"
                                      className="w-full px-2.5 py-1.5 border border-black/10 text-xs font-light focus:outline-none focus:border-black transition"
                                    />
                                    <div className="flex items-center gap-3">
                                      <label className="flex items-center gap-1.5 text-[10px] text-black/50 cursor-pointer">
                                        <input
                                          type="radio"
                                          checked={img.isPrimary}
                                          onChange={() =>
                                            updateImage(i, "isPrimary", true)
                                          }
                                          className="w-3 h-3"
                                        />
                                        Primary
                                      </label>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setPiece(
                                            "images",
                                            piece.images.filter(
                                              (_, idx) => idx !== i
                                            )
                                          )
                                        }
                                        className="text-[10px] text-red-400 hover:text-red-600 transition ml-auto"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          type="button"
                          disabled={uploadMedia.isPending}
                          onClick={() => pieceImgRef.current?.click()}
                          className="w-full py-3 border border-dashed border-black/20 text-[10px] uppercase tracking-widest text-black/40 hover:border-black/40 hover:text-black/60 transition flex items-center justify-center gap-2 disabled:opacity-40"
                        >
                          {uploadMedia.isPending ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          {uploadMedia.isPending ? "Uploading…" : "Add Image"}
                        </button>
                        <input
                          ref={pieceImgRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file)
                              uploadImage(file, (url) => {
                                const newImg: CollectionImage = {
                                  url,
                                  alt: "",
                                  isPrimary: piece.images.length === 0,
                                };
                                setPiece("images", [...piece.images, newImg]);
                              });
                            e.target.value = "";
                          }}
                        />
                      </section>
                    </>
                  )}
                </div>
              )}

              {/* ── Products Tab ───────────────────────────────────────── */}
              {activeTab === "products" && (
                <div className="space-y-4">
                  {!collectionId ? (
                    <div className="py-12 text-center">
                      <p className="text-xs text-black/40 tracking-wide max-w-xs mx-auto">
                        Save the collection first, then reopen it here to
                        attach existing products.
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setProductPickerOpen(true)}
                        className="w-full py-3 border border-dashed border-black/20 text-[10px] uppercase tracking-widest text-black/40 hover:border-black/40 hover:text-black/60 transition flex items-center justify-center gap-2"
                      >
                        <PackageSearch className="w-3.5 h-3.5" />
                        Add Product
                      </button>

                      {isLoadingCollectionProducts ? (
                        <div className="py-8 text-center">
                          <RefreshCw className="w-4 h-4 animate-spin mx-auto text-black/30" />
                        </div>
                      ) : attachedProducts.length === 0 ? (
                        <div className="py-8 text-center">
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
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-black/10 shrink-0">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || uploadMedia.isPending}
                className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Saving…"
                  : editingCollection
                  ? "Update Collection"
                  : "Create Collection"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      <ProductPickerModal
        isOpen={productPickerOpen}
        onClose={() => setProductPickerOpen(false)}
        onSelect={handleSelectProducts}
      />
    </AnimatePresence>
  );

  function removeCare(i: number) {
    setPiece(
      "careInstructions",
      piece.careInstructions.filter((_, idx) => idx !== i)
    );
  }
};

export default CollectionFormModal;
