// hooks/useInventory.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryService";
import { toast } from "sonner";

export const useInventory = (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  location?: string,
) => {
  return useQuery({
    queryKey: ["inventory", page, limit, search, status, location],
    queryFn: () =>
      inventoryService.getInventory(page, limit, search, status, location),
    staleTime: 5 * 60 * 1000,
  });
};

export const useInventorySummary = () => {
  return useQuery({
    queryKey: ["inventory-summary"],
    queryFn: () => inventoryService.getInventorySummary(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: number }) =>
      inventoryService.adjustStockByRow(id, delta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      toast.success("Stock adjusted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to adjust stock");
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      inventoryService.updateInventory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      toast.success("Inventory updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update inventory",
      );
    },
  });
};

export const useDeleteInventoryRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.deleteInventoryRow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
      toast.success("Inventory row deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete inventory row",
      );
    },
  });
};
