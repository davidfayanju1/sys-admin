import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "sonner";

export interface CollectionColor {
  name: string;
  hex: string;
}

export interface CollectionImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface CollectionPiece {
  slug?: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  sku: string;
  material: string;
  fitNotes?: string;
  careInstructions: string[];
  colors: CollectionColor[];
  sizes: string[];
  images: CollectionImage[];
  rating?: { average: number; count: number };
  status: "published" | "draft";
}

export interface Collection {
  id: string;
  _id: string;
  name: string;
  year: number;
  season: string;
  tagline: string;
  description: string;
  coverImage: string;
  featured: boolean;
  isPublished: boolean;
  slug?: string;
  piece?: CollectionPiece;
  pieces?: CollectionPiece[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  year: number;
  season: string;
  tagline: string;
  description: string;
  coverImage?: string;
  featured: boolean;
  isPublished: boolean;
  piece?: Partial<CollectionPiece>;
}

export interface UpdateCollectionPayload {
  name?: string;
  year?: number;
  season?: string;
  tagline?: string;
  description?: string;
  coverImage?: string;
  featured?: boolean;
  isPublished?: boolean;
  piece?: Partial<CollectionPiece>;
}

interface CollectionsResponse {
  status: string;
  message: string;
  data: Collection[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useCollections = (
  page: number = 1,
  limit: number = 20,
  search: string = ""
) => {
  return useQuery<CollectionsResponse>({
    queryKey: ["collections", page, limit, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
      });
      const response = await api.get(`/collections?${params.toString()}`);
      return response.data;
    },
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCollectionPayload) => {
      const response = await api.post("/collections", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection created");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create collection");
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCollectionPayload;
    }) => {
      const response = await api.patch(`/collections/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update collection");
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/collections/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete collection");
    },
  });
};

export const useToggleCollectionFeatured = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/collections/${id}/feature`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Featured status updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update featured status");
    },
  });
};
