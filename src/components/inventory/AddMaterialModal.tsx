import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Sparkles } from "lucide-react";
import type { CreateInventoryPayload } from "../../types/inventory";

interface Props {
  isOpen: boolean;
  onConfirm: (payload: CreateInventoryPayload) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const CATEGORIES = [
  "fabric",
  "thread",
  "button",
  "zipper",
  "interlining",
  "lining",
  "elastic",
  "ribbon",
  "needle",
  "accessory",
] as const;

export const UNITS = [
  "meters",
  "yards",
  "pieces",
  "rolls",
  "pairs",
  "sets",
  "grams",
  "kg",
] as const;

const SKU_PREFIX: Record<string, string> = {
  fabric: "FAB",
  thread: "THR",
  button: "BTN",
  zipper: "ZIP",
  interlining: "INT",
  lining: "LIN",
  elastic: "ELS",
  ribbon: "RBN",
  needle: "NDL",
  accessory: "ACC",
};

const getNameCode = (name: string): string => {
  const cleaned = name.replace(/[^a-zA-Z\s]/g, "").trim();
  const first = cleaned.split(/\s+/)[0] || cleaned;
  return first.slice(0, 3).toUpperCase().padEnd(3, "X");
};

const generateSKU = (category: string, name: string): string => {
  const prefix = SKU_PREFIX[category] || category.slice(0, 3).toUpperCase();
  const nameCode = name.trim() ? getNameCode(name) : "MAT";
  const num = String(Math.floor(Math.random() * 900) + 100);
  return `${prefix}-${nameCode}-${num}`;
};

const EMPTY: CreateInventoryPayload = {
  name: "",
  sku: "",
  category: "fabric",
  unit: "meters",
  stock: 0,
  reorderLevel: 10,
  reorderQuantity: 50,
  costPrice: 0,
  supplier: "",
  location: "",
  notes: "",
};

const Field = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div>
    <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-[9px] text-black/30 mt-1">{hint}</p>}
  </div>
);

const inputCls =
  "w-full px-3 py-2.5 border border-black/10 focus:outline-none focus:border-black text-sm font-light transition bg-white";

const AddMaterialModal = ({ isOpen, onConfirm, onClose, isLoading }: Props) => {
  const [form, setForm] = useState<CreateInventoryPayload>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateInventoryPayload, string>>>({});
  const [skuLocked, setSkuLocked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY);
      setErrors({});
      setSkuLocked(false);
    }
  }, [isOpen]);

  // Auto-generate SKU when category or name changes, unless user manually edited it
  useEffect(() => {
    if (!skuLocked && (form.name || form.category)) {
      setForm((prev) => ({ ...prev, sku: generateSKU(prev.category, prev.name) }));
    }
  }, [form.name, form.category, skuLocked]);

  const set = (field: keyof CreateInventoryPayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSkuChange = (val: string) => {
    setSkuLocked(true);
    set("sku", val.toUpperCase());
  };

  const regenerateSku = () => {
    setSkuLocked(false);
    setForm((prev) => ({ ...prev, sku: generateSKU(prev.category, prev.name) }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.sku.trim()) e.sku = "Required";
    if (!form.category) e.category = "Required";
    if (!form.unit) e.unit = "Required";
    if (form.stock < 0) e.stock = "Cannot be negative";
    if (form.costPrice <= 0) e.costPrice = "Must be greater than 0";
    if (form.reorderLevel < 0) e.reorderLevel = "Cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload: CreateInventoryPayload = {
      ...form,
      supplier: form.supplier?.trim() || undefined,
      location: form.location?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    };
    onConfirm(payload);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative bg-white w-full max-w-xl mx-4 flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-light tracking-wide text-black">Add Raw Material</h3>
                  <p className="text-[10px] text-black/40 mt-0.5">New inventory item</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-black/5 transition text-black/40">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* — Material Identity — */}
              <section>
                <p className="text-[9px] uppercase tracking-widest text-black/30 mb-4">Material</p>
                <div className="space-y-4">
                  <Field label="Name *" hint="e.g. Ankara, Cotton Poplin, Invisible Zipper">
                    <input
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Material name"
                      className={`${inputCls} ${errors.name ? "border-red-400" : ""}`}
                    />
                    {errors.name && <p className="text-[9px] text-red-500 mt-1">{errors.name}</p>}
                  </Field>

                  <Field label="Category *">
                    <select
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      className={`${inputCls} capitalize ${errors.category ? "border-red-400" : ""}`}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="capitalize">{c}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </section>

              {/* — SKU — */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] uppercase tracking-widest text-black/30">SKU</p>
                  <p className="text-[9px] text-black/30">
                    {skuLocked ? "Manually edited" : "Auto-generated from category + name"}
                  </p>
                </div>
                <Field label="Stock Keeping Unit *">
                  <div className="flex gap-0">
                    <input
                      value={form.sku}
                      onChange={(e) => handleSkuChange(e.target.value)}
                      placeholder="FAB-ANK-042"
                      className={`flex-1 px-3 py-2.5 border border-r-0 border-black/10 focus:outline-none focus:border-black text-sm font-mono tracking-wide uppercase transition ${errors.sku ? "border-red-400" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={regenerateSku}
                      title="Regenerate SKU"
                      className="px-3 border border-black/10 hover:bg-black/5 transition text-black/40 hover:text-black"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {errors.sku && <p className="text-[9px] text-red-500 mt-1">{errors.sku}</p>}
                </Field>
              </section>

              {/* — Stock Details — */}
              <section>
                <p className="text-[9px] uppercase tracking-widest text-black/30 mb-4">Stock</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Unit *">
                    <select
                      value={form.unit}
                      onChange={(e) => set("unit", e.target.value)}
                      className={`${inputCls} ${errors.unit ? "border-red-400" : ""}`}
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label={`Initial Stock (${form.unit}) *`}>
                    <input
                      type="number"
                      min={0}
                      value={form.stock}
                      onChange={(e) => set("stock", Number(e.target.value))}
                      onWheel={(e) => e.currentTarget.blur()}
                      className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.stock ? "border-red-400" : ""}`}
                      placeholder="0"
                    />
                    {errors.stock && <p className="text-[9px] text-red-500 mt-1">{errors.stock}</p>}
                  </Field>

                  <Field label="Cost Price (₦) *">
                    <input
                      type="number"
                      min={0}
                      value={form.costPrice || ""}
                      onChange={(e) => set("costPrice", Number(e.target.value))}
                      onWheel={(e) => e.currentTarget.blur()}
                      className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.costPrice ? "border-red-400" : ""}`}
                      placeholder="0"
                    />
                    {errors.costPrice && <p className="text-[9px] text-red-500 mt-1">{errors.costPrice}</p>}
                  </Field>

                  <Field label="Reorder Level" hint={`Alert when stock drops below this`}>
                    <input
                      type="number"
                      min={0}
                      value={form.reorderLevel}
                      onChange={(e) => set("reorderLevel", Number(e.target.value))}
                      onWheel={(e) => e.currentTarget.blur()}
                      className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                  </Field>

                  <Field label="Reorder Quantity" hint="How much to reorder when low">
                    <input
                      type="number"
                      min={0}
                      value={form.reorderQuantity}
                      onChange={(e) => set("reorderQuantity", Number(e.target.value))}
                      onWheel={(e) => e.currentTarget.blur()}
                      className={`${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                    />
                  </Field>
                </div>
              </section>

              {/* — Sourcing — */}
              <section>
                <p className="text-[9px] uppercase tracking-widest text-black/30 mb-4">Sourcing</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Supplier">
                    <input
                      value={form.supplier}
                      onChange={(e) => set("supplier", e.target.value)}
                      placeholder="e.g. Lagos Textiles Ltd"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Storage Location">
                    <input
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="e.g. Warehouse A"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </section>

              {/* — Notes — */}
              <section>
                <p className="text-[9px] uppercase tracking-widest text-black/30 mb-4">Notes</p>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  placeholder="Any additional notes about this material…"
                  className={`${inputCls} resize-none`}
                />
              </section>
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
                disabled={isLoading}
                className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? "Adding…" : "Add Material"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddMaterialModal;
