// services/inventoryService.ts
import api from "../lib/axios";
import type {
  AdjustStockPayload,
  InventoryItem,
  InventoryResponse,
  InventorySummary,
} from "../types/inventory";

export const inventoryService = {
  // List inventory with pagination and filters
  getInventory: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    location?: string,
  ): Promise<InventoryResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);
    if (location && location !== "all") params.append("location", location);

    const response = await api.get(`/inventory?${params.toString()}`);
    return response.data;
  },

  // Get inventory summary (KPI cards)
  getInventorySummary: async (): Promise<InventorySummary> => {
    const response = await api.get("/inventory/summary");
    return response.data.data;
  },

  // Get single inventory row
  getInventoryById: async (id: string): Promise<InventoryItem> => {
    const response = await api.get(`/inventory/${id}`);
    return response.data.data;
  },

  // Update inventory row
  updateInventory: async (
    id: string,
    data: Partial<InventoryItem>,
  ): Promise<InventoryItem> => {
    const response = await api.patch(`/inventory/${id}`, data);
    return response.data.data;
  },

  // Adjust stock (global endpoint)
  adjustStockGlobal: async (
    payload: AdjustStockPayload,
  ): Promise<{ stock: number }> => {
    const response = await api.patch("/inventory/adjust", payload);
    return response.data;
  },

  // Adjust stock for specific row
  adjustStockByRow: async (
    id: string,
    delta: number,
  ): Promise<{ delta: number; stock: number }> => {
    const response = await api.patch(`/inventory/${id}/adjust`, { delta });
    return response.data;
  },

  // Delete inventory row (remove variant)
  deleteInventoryRow: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },
};
