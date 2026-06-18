import { useQuery } from "@tanstack/react-query";

export interface FeedbackItem {
  _id: string;
  id: string;
  name?: string;
  email?: string;
  feedback: string;
  sentiment?: "positive" | "neutral" | "negative";
  createdAt: string;
}

interface FeedbackResponse {
  status: string;
  message: string;
  data: FeedbackItem[];
  meta: { total: number; page: number; limit: number };
}

export interface FeedbackSummary {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}

interface FeedbackSummaryResponse {
  status: string;
  message: string;
  data: FeedbackSummary;
}

const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    _id: "f1",
    id: "FB-001",
    name: "Amara Okafor",
    email: "amara.okafor@gmail.com",
    feedback:
      "The quality of my bespoke gown exceeded all expectations. The attention to detail and the finish were absolutely stunning. Will definitely be back for my next event.",
    sentiment: "positive",
    createdAt: "2026-06-15T10:30:00Z",
  },
  {
    _id: "f2",
    id: "FB-002",
    feedback:
      "Delivery took longer than expected and the communication could have been better during the production process. The final product was good though.",
    sentiment: "neutral",
    createdAt: "2026-06-13T14:00:00Z",
  },
  {
    _id: "f3",
    id: "FB-003",
    name: "Temi Adeleke",
    feedback:
      "I ordered a custom outfit for a wedding and it arrived two days after the event. This was very disappointing and I lost money on alterations elsewhere.",
    sentiment: "negative",
    createdAt: "2026-06-10T09:15:00Z",
  },
  {
    _id: "f4",
    id: "FB-004",
    name: "Chidinma Obi",
    email: "chidinma.obi@outlook.com",
    feedback:
      "SYS Empire styled me for the Lagos Fashion Week after-party and I received so many compliments. The team is incredibly talented and professional.",
    sentiment: "positive",
    createdAt: "2026-06-09T16:45:00Z",
  },
  {
    _id: "f5",
    id: "FB-005",
    feedback:
      "The website checkout process is a bit confusing. Had trouble selecting my size and the variant options weren't very clear. Would be good to improve this.",
    sentiment: "neutral",
    createdAt: "2026-06-08T11:00:00Z",
  },
  {
    _id: "f6",
    id: "FB-006",
    name: "Yetunde Adesanya",
    email: "yetunde.a@gmail.com",
    feedback:
      "Best fashion house in Lagos, hands down. Every piece is a work of art. My wardrobe has never looked this good and the styling advice was invaluable.",
    sentiment: "positive",
    createdAt: "2026-06-07T08:30:00Z",
  },
  {
    _id: "f7",
    id: "FB-007",
    name: "Kemi Bello",
    feedback:
      "The sizing was off on the ready-to-wear piece I bought. I had to pay for alterations. Please consider improving your size guide on the website.",
    sentiment: "negative",
    createdAt: "2026-06-05T13:20:00Z",
  },
  {
    _id: "f8",
    id: "FB-008",
    name: "Folake Martins",
    email: "folake.m@icloud.com",
    feedback:
      "Loved the packaging — very premium. The outfit itself was beautiful. Delivery was a little slow but worth the wait. Great experience overall.",
    sentiment: "positive",
    createdAt: "2026-06-03T10:00:00Z",
  },
  {
    _id: "f9",
    id: "FB-009",
    feedback:
      "Customer service was responsive and helpful when I had questions about my order. The quality was consistent with what I expected at this price point.",
    sentiment: "neutral",
    createdAt: "2026-06-01T15:30:00Z",
  },
  {
    _id: "f10",
    id: "FB-010",
    name: "Adaeze Nwosu",
    email: "adaeze.n@gmail.com",
    feedback:
      "I've been a loyal customer for two years and the quality has only gotten better. The new collection is absolutely fire. Keep doing what you're doing!",
    sentiment: "positive",
    createdAt: "2026-05-30T09:00:00Z",
  },
];

export const useFeedback = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  sentiment: string = ""
) => {
  return useQuery<FeedbackResponse>({
    queryKey: ["feedback", page, limit, search, sentiment],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      let filtered = MOCK_FEEDBACK;
      if (search)
        filtered = filtered.filter(
          (f) =>
            f.name?.toLowerCase().includes(search.toLowerCase()) ||
            f.feedback.toLowerCase().includes(search.toLowerCase())
        );
      if (sentiment) filtered = filtered.filter((f) => f.sentiment === sentiment);
      const start = (page - 1) * limit;
      return {
        status: "success",
        message: "ok",
        data: filtered.slice(start, start + limit),
        meta: { total: filtered.length, page, limit },
      };
    },
  });
};

export const useFeedbackSummary = () => {
  return useQuery<FeedbackSummaryResponse>({
    queryKey: ["feedback-summary"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return {
        status: "success",
        message: "ok",
        data: {
          total: MOCK_FEEDBACK.length,
          positive: MOCK_FEEDBACK.filter((f) => f.sentiment === "positive").length,
          neutral: MOCK_FEEDBACK.filter((f) => f.sentiment === "neutral").length,
          negative: MOCK_FEEDBACK.filter((f) => f.sentiment === "negative").length,
        },
      };
    },
  });
};
