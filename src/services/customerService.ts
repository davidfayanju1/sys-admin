// services/customerService.ts
import api from "../lib/axios";
import type {
  Customer,
  CustomersResponse,
  CustomerSummary,
} from "../types/customer";

export const customerService = {
  // Get customer summary (KPI cards)
  getCustomerSummary: async (): Promise<CustomerSummary> => {
    const response = await api.get("/customers/summary");
    return response.data.data;
  },

  // List customers with pagination and filters
  getCustomers: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    status?: string,
  ): Promise<CustomersResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);

    const response = await api.get(`/customers?${params.toString()}`);
    return response.data;
  },

  // Get single customer details
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data.data;
  },
};
