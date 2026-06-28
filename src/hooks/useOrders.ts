import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export interface OrderItem {
  _id: string;
  product: string; // product ID
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  isBespoke: boolean;
}

export interface OrderAddress {
  street?: string;
  address?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  zipCode?: string;
}

export interface StatusHistoryEntry {
  status: string;
  label: string;
  note: string;
  timestamp: string;
}

export interface OrderDetail {
  id: string;           // readable order ID e.g. "SE-MPOHKXG3-ZYNC"
  _id: string;          // MongoDB document ID
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  amount: number;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  shippingMethod: string;
  shippingMethodLabel: string;
  deliveryType: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  paymentReference: string;
  paidAt: string | null;
  trackingNumber: string;
  notes: string;
  statusHistory: StatusHistoryEntry[];
  txRef: string;
  paymentLink: string;
  cancellationReason: string;
  cancelledAt: string | null;
  shippedAt: string;
  deliveredAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  _id: string;
  orderNumber?: string;
  customer: string;
  date: string;
  amount: number;
  currency?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  items: number;
}

export interface OrdersResponse {
  status: string;
  message: string;
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useOrders = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  status: string = "",
) => {
  return useQuery({
    queryKey: ["orders", page, limit, search, status],
    queryFn: async (): Promise<OrdersResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
        ...(status && status !== "all" ? { status } : {}),
      });
      const response = await api.get(`/orders?${params.toString()}`);
      return response.data;
    },
  });
};

export interface OrderSummaryResponse {
  status: string;
  message: string;
  data: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    paid: number;
  };
}

export const useOrderSummary = () => {
  return useQuery({
    queryKey: ["order-summary"],
    queryFn: async (): Promise<OrderSummaryResponse> => {
      const response = await api.get("/orders/summary");
      return response.data;
    },
  });
};

export const useOrderDetails = (orderId: string | null) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async (): Promise<{ data: OrderDetail }> => {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    },
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/orders/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["order-summary"] });
    },
  });
};

export const useUpdateOrderPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      paymentStatus,
    }: {
      id: string;
      paymentStatus: string;
    }) => {
      const response = await api.patch(`/orders/${id}/payment`, {
        paymentStatus,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["order-summary"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-summary"] });
    },
  });
};
