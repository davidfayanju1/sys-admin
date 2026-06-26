export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  stock: number;
  reorderLevel: number;
  reorderQuantity: number;
  costPrice: number;
  supplier?: string;
  location?: string;
  notes?: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
}

export interface InventorySummary {
  totalItems: number;
  totalUnits: number;
  stockValue: number;
  lowStock: number;
  outOfStock: number;
  locations: string[];
  categories: string[];
}

export interface InventoryResponse {
  status: string;
  message: string;
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

export interface CreateInventoryPayload {
  name: string;
  sku: string;
  category: string;
  unit: string;
  stock: number;
  reorderLevel: number;
  reorderQuantity: number;
  costPrice: number;
  supplier?: string;
  location?: string;
  notes?: string;
}

export interface AdjustStockPayload {
  delta: number;
}
