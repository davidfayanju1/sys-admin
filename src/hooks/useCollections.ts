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
  gender?: "" | "male" | "female";
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
  gender?: "male" | "female";
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
  gender?: "male" | "female";
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
  search: string = "",
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
      toast.error(
        error.response?.data?.message || "Failed to create collection",
      );
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
      toast.error(
        error.response?.data?.message || "Failed to update collection",
      );
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
      toast.error(
        error.response?.data?.message || "Failed to delete collection",
      );
    },
  });
};

export interface CollectionCategoryRef {
  id?: string;
  name: string;
  slug?: string;
}

export interface CollectionPieceRating {
  average: number;
  count: number;
}

export interface CollectionPieceCard {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category?: CollectionCategoryRef;
  rating?: CollectionPieceRating;
  inStock: boolean;
}

export const useCollectionProducts = (collectionId: string) => {
  return useQuery<{ data: CollectionPieceCard[] }>({
    queryKey: ["collection-products", collectionId],
    queryFn: async () => {
      const response = await api.get(`/collections/${collectionId}/products`);
      return response.data;
    },
    enabled: !!collectionId,
  });
};

export const useAttachProductsToCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      productIds,
    }: {
      id: string;
      productIds: string[];
    }) => {
      const response = await api.post(`/collections/${id}/products`, {
        productIds,
      });
      return response.data;
    },
    onSuccess: (_data, { id, productIds }) => {
      queryClient.invalidateQueries({ queryKey: ["collection-products", id] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success(
        productIds.length > 1
          ? `${productIds.length} products added to collection`
          : "Product added to collection",
      );
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to add product to collection",
      );
    },
  });
};

export const useDetachProductFromCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      productId,
    }: {
      id: string;
      productId: string;
    }) => {
      const response = await api.delete(
        `/collections/${id}/products/${productId}`,
      );
      return response.data;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["collection-products", id] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Product removed from collection");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove product from collection",
      );
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
      toast.error(
        error.response?.data?.message || "Failed to update featured status",
      );
    },
  });
};
