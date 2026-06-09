// services/productService.ts
import api from "../lib/axios";
import type { Product, ProductsResponse } from "../types/product";

export interface ProductSummary {
  total: number;
  active: number;
  draft: number;
  totalVariants: number;
  lowStock: number;
}

export const productService = {
  // List products with pagination & filters
  getProducts: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  // Get single product
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post("/products", product);
    return response.data;
  },

  // Update product
  updateProduct: async (
    id: string,
    product: Partial<Product>,
  ): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, product);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Duplicate product
  duplicateProduct: async (id: string): Promise<Product> => {
    const response = await api.post(`/products/${id}/duplicate`);
    return response.data;
  },

  // Get summary/KPI cards
  getProductSummary: async (): Promise<ProductSummary> => {
    const response = await api.get("/products/summary");
    // Extract data from the response structure
    return response.data.data;
  },

  // Update variant stock
  updateVariantStock: async (
    productId: string,
    variantId: string,
    stock: number,
  ): Promise<void> => {
    await api.patch(`/products/${productId}/variants/stock`, {
      variantId,
      stock,
    });
  },

  // Update product status
  updateProductStatus: async (id: string, status: string): Promise<void> => {
    await api.patch(`/products/${id}/status`, { status });
  },
};
