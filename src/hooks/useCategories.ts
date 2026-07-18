import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "sonner";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  image?: string;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  type: string;
  description?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
}

export const useCategories = () =>
  useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data?.data ?? res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useCategoriesByType = (type: string) =>
  useQuery<Category[]>({
    queryKey: ["categories", "type", type],
    queryFn: async () => {
      const res = await api.get(`/categories/type/${type}`);
      return res.data?.data ?? res.data;
    },
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const res = await api.post("/categories", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
};
