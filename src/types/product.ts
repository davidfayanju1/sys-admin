// types/product.ts
export interface Color {
  name: string;
  hex: string;
  _id: string;
  id: string;
}

// New API format: each size is its own entry with price/stock/sku
export interface SizeEntry {
  size: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
  reservedStock?: number;
  _id?: string;
  id?: string;
}

export interface Variant {
  id: string;
  color: string;
  // New format: SizeEntry[]; old format: string[]
  sizes: SizeEntry[] | string[];
  // Old format fields (flat variant) — absent in new API response
  size?: string;
  sku?: string;
  price?: number;
  currency?: string;
  stock?: number;
  images: string[];
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
  reservedStock?: number;
  _id?: string;
}

// Helper: true when sizes uses the new SizeEntry[] format
export const isSizeEntryArray = (
  sizes: SizeEntry[] | string[],
): sizes is SizeEntry[] =>
  sizes.length > 0 && typeof sizes[0] === "object";

export const getVariantSizeNames = (v: Variant): string[] => {
  if (!v.sizes || v.sizes.length === 0) return v.size ? [v.size] : [];
  if (isSizeEntryArray(v.sizes)) return v.sizes.map((s) => s.size);
  return v.sizes as string[];
};

export const getVariantStock = (v: Variant): number => {
  if (v.sizes && isSizeEntryArray(v.sizes))
    return v.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
  return v.stock || 0;
};

export const getVariantMinPrice = (v: Variant): number => {
  if (v.sizes && isSizeEntryArray(v.sizes)) {
    const prices = v.sizes.map((s) => s.price);
    return prices.length ? Math.min(...prices) : 0;
  }
  return v.price || 0;
};

export const getVariantSku = (v: Variant): string => {
  if (v.sizes && isSizeEntryArray(v.sizes)) return v.sizes[0]?.sku || "";
  return v.sku || "";
};

export interface ProductImage {
  url: string;
  isPrimary: boolean;
  _id: string;
  id: string;
}

export interface Rating {
  average: number;
  count: number;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  title?: string; // For compatibility
  sku: string;
  description: string;
  shortDescription: string;
  categories: string[];
  price: number;
  finalPrice: number;
  currency: string;
  onSale: boolean;
  isBespoke: boolean;
  leadTimeDays: number;
  sizes: string[];
  colors: Color[];
  variants: Variant[];
  stock: number;
  trackInventory: boolean;
  images: ProductImage[];
  primaryImage?: string;
  secondaryImages?: string[];
  materials: string[];
  tags: string[];
  status: "published" | "draft" | "archived" | "active";
  featured: boolean;
  views: number;
  salesCount: number;
  slug: string;
  rating: Rating;
  care?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductSummary {
  total: number;
  active: number;
  draft: number;
  totalVariants: number;
  lowStock: number;
}
