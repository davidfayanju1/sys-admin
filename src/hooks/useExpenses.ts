import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import { toast } from "sonner";

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  vendor?: string;
  paymentMethod: string;
  receiptUrl?: string;
  status: "pending" | "paid" | "rejected";
  notes?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSummary {
  total: number;
  totalAmount: number;
  pending: number;
  paid: number;
  byCategory: Record<string, number>;
}

export interface CreateExpensePayload {
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  vendor?: string;
  receiptUrl?: string;
  status?: "pending" | "paid";
  notes?: string;
}

interface ExpensesResponse {
  status: string;
  message: string;
  data: Expense[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ExpenseSummaryResponse {
  status: string;
  message: string;
  data: ExpenseSummary;
}

export const useExpenses = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  status: string = "",
  category: string = ""
) => {
  return useQuery<ExpensesResponse>({
    queryKey: ["expenses", page, limit, search, status, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(category ? { category } : {}),
      });
      const response = await api.get(`/expenses?${params.toString()}`);
      return response.data;
    },
  });
};

export const useExpenseSummary = () => {
  return useQuery<ExpenseSummaryResponse>({
    queryKey: ["expenses-summary"],
    queryFn: async () => {
      const response = await api.get("/expenses/summary");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateExpensePayload) => {
      const response = await api.post("/expenses", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
      toast.success("Expense recorded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to record expense");
    },
  });
};

export const useUpdateExpenseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/expenses/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
      toast.success(`Expense marked as ${status}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-summary"] });
      toast.success("Expense deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete expense");
    },
  });
};
