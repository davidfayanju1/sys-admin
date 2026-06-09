// types/product.ts
export interface Color {
  name: string;
  hex: string;
  _id: string;
  id: string;
}

export interface Variant {
  id: string;
  color: string;
  size: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
  reservedStock?: number;
  _id?: string;
}

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
