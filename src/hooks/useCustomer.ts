// hooks/useCustomers.ts
import { useQuery } from "@tanstack/react-query";
import { customerService } from "../services/customerService";

export const useCustomerSummary = () => {
  return useQuery({
    queryKey: ["customers-summary"],
    queryFn: () => customerService.getCustomerSummary(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomers = (
  page: number,
  limit: number,
  search?: string,
  status?: string,
) => {
  return useQuery({
    queryKey: ["customers", page, limit, search, status],
    queryFn: () => customerService.getCustomers(page, limit, search, status),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomerDetails = (id: string | null) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.getCustomerById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
