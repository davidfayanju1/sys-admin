// types/inventory.ts
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  costPrice: number;
  sellingPrice: number;
  location: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "discontinued";
  lastUpdated: string;
  image: string;
  variantId: string;
}

export interface InventorySummary {
  totalSkus: number;
  totalUnits: number;
  stockValue: number;
  lowStock: number;
  outOfStock: number;
  locations: string[];
}

export interface InventoryResponse {
  data: {
    items: InventoryItem[];
    summary: InventorySummary;
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AdjustStockPayload {
  rowId: string;
  productId?: string;
  variantId?: string;
  sku?: string;
  delta: number;
  stock?: number;
}
