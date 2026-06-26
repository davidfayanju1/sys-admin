import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export interface FeedbackItem {
  id: string;
  source: string;
  sourceId: string;
  name?: string;
  email?: string;
  message: string;
  sentiment?: "positive" | "neutral" | "negative";
  status?: string;
  createdAt: string;
}

export interface FeedbackSummary {
  total: number;
  testimonials: number;
  contact: number;
  inquiries: number;
  pending: number;
  positive: number;
}

interface FeedbackResponse {
  status: string;
  message: string;
  data: {
    items: FeedbackItem[];
    summary: FeedbackSummary;
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface FeedbackSummaryResponse {
  status: string;
  message: string;
  data: FeedbackSummary;
}

export const useFeedback = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  sentiment: string = ""
) => {
  return useQuery<FeedbackResponse>({
    queryKey: ["feedback", page, limit, search, sentiment],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
        ...(sentiment ? { sentiment } : {}),
      });
      const response = await api.get(`/feedback?${params.toString()}`);
      return response.data;
    },
  });
};

export const useFeedbackSummary = () => {
  return useQuery<FeedbackSummaryResponse>({
    queryKey: ["feedback-summary"],
    queryFn: async () => {
      const response = await api.get("/feedback?page=1&limit=1");
      const summary: FeedbackSummary = response.data?.data?.summary ?? {
        total: 0,
        testimonials: 0,
        contact: 0,
        inquiries: 0,
        pending: 0,
        positive: 0,
      };
      return { status: "success", message: "ok", data: summary };
    },
  });
};
