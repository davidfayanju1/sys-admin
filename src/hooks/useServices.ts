import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export interface Service {
  _id: string;
  name: string;
  summary: string;
  description: string;
  icon: string;
  image: string;
  startingPrice: number;
  currency: string;
  features: string[];
  order: number;
  isActive: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePayload {
  name: string;
  summary: string;
  description: string;
  icon: string;
  image: string;
  startingPrice: number;
  features: string[];
}

type ServiceListResponse = {
  status: string;
  data: Service[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

type ServiceResponse = { status: string; data: Service };

export const useServices = (page = 1, limit = 20, search = "") =>
  useQuery({
    queryKey: ["services", page, limit, search],
    queryFn: () =>
      api
        .get<ServiceListResponse>("/services", {
          params: { page, limit, ...(search ? { search } : {}) },
        })
        .then((r) => r.data),
  });

export const useService = (id: string) =>
  useQuery({
    queryKey: ["service", id],
    queryFn: () =>
      api.get<ServiceResponse>(`/services/${id}`).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServicePayload) =>
      api.post("/services", payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: ServicePayload & { id: string }) =>
      api.patch(`/services/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeleteService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/services/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
