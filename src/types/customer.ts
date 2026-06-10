// types/customer.ts
export interface Feedback {
  rating: number;
  comment: string;
  date: string;
}

export interface OrderSummary {
  id: string;
  amount: number;
  status: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  joinDate: string;
  totalSpent: number;
  totalOrders: number;
  averageOrderValue: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "vip";
  favoriteCategory: string;
  feedbacks: Feedback[];
  orders?: OrderSummary[];
}

export interface CustomerSummary {
  total: number;
  active: number;
  vip: number;
  inactive: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export interface CustomersResponse {
  data: Customer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
