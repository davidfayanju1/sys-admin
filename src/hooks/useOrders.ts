import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";

export interface OrderItem {
  _id?: string;
  product?: {
    _id?: string;
    name?: string;
    title?: string;
    sku?: string;
    images?: Array<{ url: string; isPrimary?: boolean } | string>;
  };
  variant?: {
    color?: string;
    size?: string;
    sizes?: string[];
    sku?: string;
  };
  name?: string;
  sku?: string;
  color?: string;
  size?: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  subtotal?: number;
  amount?: number;
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
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface OrderDetail {
  _id: string;
  id?: string;
  orderNumber?: string;
  customer?: string;
  user?: {
    _id?: string;
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  items?: OrderItem[];
  orderItems?: OrderItem[];
  subtotal?: number;
  shippingFee?: number;
  shippingCost?: number;
  discount?: number;
  discountAmount?: number;
  amount?: number;
  totalPrice?: number;
  total?: number;
  currency?: string;
  paymentMethod?: string;
  paymentReference?: string;
  paymentProvider?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  notes?: string;
  adminNotes?: string;
  status: string;
  paymentStatus: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  statusHistory?: StatusHistoryEntry[];
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
