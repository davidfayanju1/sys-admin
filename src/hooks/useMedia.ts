import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  type: string;
  width: number;
  height: number;
  durationSeconds?: number;
  alt?: string;
  caption?: string;
  folder: string;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

type ListResponse = {
  status: string;
  data: MediaAsset[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

type SingleResponse = { status: string; data: MediaAsset };
type UploadResponse = { status: string; message: string; data: MediaAsset };
type UploadManyResponse = { status: string; message: string; data: MediaAsset[] };

const MULTIPART = { headers: { "Content-Type": "multipart/form-data" } };

export const useMediaList = (page = 1, limit = 24) =>
  useQuery({
    queryKey: ["media", page, limit],
    queryFn: () =>
      api.get<ListResponse>("/media", { params: { page, limit } }).then((r) => r.data),
  });

export const useMediaAsset = (id: string) =>
  useQuery({
    queryKey: ["media", "asset", id],
    queryFn: () =>
      api.get<SingleResponse>(`/media/${id}`).then((r) => r.data),
    enabled: !!id,
  });

export const useUploadMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post<UploadResponse>("/media/upload", formData, MULTIPART).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
};

export const useUploadManyMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post<UploadManyResponse>("/media/upload-many", formData, MULTIPART).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
};

export const useDeleteMedia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/media/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
};
