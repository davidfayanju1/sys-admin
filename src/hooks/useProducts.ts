// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { toast } from "sonner";
import type { Product } from "../types/product";

export const useProducts = (
  page: number,
  limit: number,
  search?: string,
  status?: string,
) => {
  return useQuery({
    queryKey: ["products", page, limit, search, status],
    queryFn: () => productService.getProducts(page, limit, search, status),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductSummary = () => {
  return useQuery({
    queryKey: ["products-summary"],
    queryFn: () => productService.getProductSummary(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Partial<Product>) =>
      productService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-summary"] });
      toast.success("Product created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      productService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-summary"] });
      toast.success("Product updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-summary"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
};

export const useDuplicateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.duplicateProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products-summary"] });
      toast.success("Product duplicated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to duplicate product",
      );
    },
  });
};
