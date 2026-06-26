import api from "../lib/axios";
import type {
  CreateInventoryPayload,
  InventoryItem,
  InventoryResponse,
  InventorySummary,
} from "../types/inventory";

export const inventoryService = {
  getInventory: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
    location?: string,
    category?: string,
  ): Promise<InventoryResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);
    if (location && location !== "all") params.append("location", location);
    if (category && category !== "all") params.append("category", category);
    const response = await api.get(`/inventory?${params.toString()}`);
    return response.data;
  },

  getInventorySummary: async (): Promise<InventorySummary> => {
    const response = await api.get("/inventory/summary");
    return response.data.data;
  },

  createInventory: async (payload: CreateInventoryPayload): Promise<InventoryItem> => {
    const response = await api.post("/inventory", payload);
    return response.data.data;
  },

  getInventoryById: async (id: string): Promise<InventoryItem> => {
    const response = await api.get(`/inventory/${id}`);
    return response.data.data;
  },

  updateInventory: async (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await api.patch(`/inventory/${id}`, data);
    return response.data.data;
  },

  adjustStockByRow: async (id: string, delta: number): Promise<{ delta: number; stock: number }> => {
    const response = await api.patch(`/inventory/${id}/adjust`, { delta });
    return response.data;
  },

  deleteInventoryRow: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },
};
