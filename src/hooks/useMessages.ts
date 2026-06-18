import { useQuery } from "@tanstack/react-query";

export interface Message {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  serviceOfInterest: string;
  message: string;
  isRead?: boolean;
  createdAt: string;
}

interface MessagesResponse {
  status: string;
  message: string;
  data: Message[];
  meta: { total: number; page: number; limit: number };
}

export interface MessageSummary {
  total: number;
  unread: number;
  read: number;
}

interface MessageSummaryResponse {
  status: string;
  message: string;
  data: MessageSummary;
}

const MOCK_MESSAGES: Message[] = [
  {
    _id: "m1",
    id: "MSG-001",
    firstName: "Emeka",
    lastName: "Okonkwo",
    email: "emeka.okonkwo@gmail.com",
    phoneNumber: "+234 803 111 2233",
    serviceOfInterest: "Wholesale",
    message:
      "Hi, I run a boutique in Abuja and I'm interested in stocking some of your ready-to-wear pieces. Can we discuss wholesale pricing and minimum order quantities?",
    isRead: false,
    createdAt: "2026-06-18T07:45:00Z",
  },
  {
    _id: "m2",
    id: "MSG-002",
    firstName: "Yinka",
    lastName: "Coker",
    email: "yinka.coker@outlook.com",
    phoneNumber: "+234 706 222 3344",
    serviceOfInterest: "Bespoke",
    message:
      "I need a completely custom outfit for a state dinner I'm attending next month. Budget is not a concern — I want the best you can do. Please advise on how to get started.",
    isRead: false,
    createdAt: "2026-06-17T18:20:00Z",
  },
  {
    _id: "m3",
    id: "MSG-003",
    firstName: "Adunola",
    lastName: "Taiwo",
    email: "adunola.t@icloud.com",
    phoneNumber: "+234 810 333 4455",
    serviceOfInterest: "Styling",
    message:
      "I'm relocating to London in two months and want to build a sophisticated wardrobe that works for the European climate while still expressing my Nigerian identity. Can we schedule a consultation?",
    isRead: true,
    createdAt: "2026-06-17T12:00:00Z",
  },
  {
    _id: "m4",
    id: "MSG-004",
    firstName: "Babatunde",
    lastName: "Adeola",
    email: "bade@gmail.com",
    phoneNumber: "+234 901 444 5566",
    serviceOfInterest: "Bespoke",
    message:
      "My fiancée and I want matching outfits for our traditional engagement ceremony. We were thinking something in olive green and gold. Can your team handle both male and female designs?",
    isRead: false,
    createdAt: "2026-06-16T15:30:00Z",
  },
  {
    _id: "m5",
    id: "MSG-005",
    firstName: "Miriam",
    lastName: "Oghenekaro",
    email: "miriam.og@gmail.com",
    phoneNumber: "+234 812 555 6677",
    serviceOfInterest: "Consultation",
    message:
      "I saw your work at Lagos Fashion Week and was blown away. I'm a fashion blogger with about 80k followers and I'd love to discuss a potential collaboration or feature. Please get in touch!",
    isRead: true,
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    _id: "m6",
    id: "MSG-006",
    firstName: "Grace",
    lastName: "Obi",
    email: "graceobi@yahoo.com",
    phoneNumber: "+234 705 666 7788",
    serviceOfInterest: "Styling",
    message:
      "I have a job interview at a top-tier firm in two weeks and I want to look the part without losing my personal style. What packages do you offer for professional wardrobe building?",
    isRead: true,
    createdAt: "2026-06-14T09:15:00Z",
  },
  {
    _id: "m7",
    id: "MSG-007",
    firstName: "Chike",
    lastName: "Onyekachi",
    email: "chike.o@gmail.com",
    phoneNumber: "+234 908 777 8899",
    serviceOfInterest: "Wholesale",
    message:
      "We're organising a fashion pop-up event in Port Harcourt in August and would love to have SYS Empire represented. Are you open to consignment arrangements or vendor partnerships?",
    isRead: false,
    createdAt: "2026-06-13T16:40:00Z",
  },
  {
    _id: "m8",
    id: "MSG-008",
    firstName: "Tokunbo",
    lastName: "Ajayi",
    email: "tokunbo.ajayi@outlook.com",
    phoneNumber: "+234 811 888 9900",
    serviceOfInterest: "Bespoke",
    message:
      "I need a mother-of-the-bride outfit for my daughter's wedding in October. I want something age-appropriate but still stylish and modern. Can I come in for a fitting?",
    isRead: true,
    createdAt: "2026-06-12T11:30:00Z",
  },
  {
    _id: "m9",
    id: "MSG-009",
    firstName: "Simi",
    lastName: "Bankole",
    email: "simibankole@gmail.com",
    phoneNumber: "+234 703 999 0011",
    serviceOfInterest: "Consultation",
    message:
      "I purchased one of your pieces online but I'm not sure how to style it for different occasions. Do you offer virtual styling consultations for existing customers? If so, what's the cost?",
    isRead: false,
    createdAt: "2026-06-11T14:00:00Z",
  },
  {
    _id: "m10",
    id: "MSG-010",
    firstName: "Nkemdirim",
    lastName: "Eze",
    email: "nkem.eze@gmail.com",
    phoneNumber: "+234 814 000 1122",
    serviceOfInterest: "Bespoke",
    message:
      "Hello, I'm a government official preparing for an international conference and I need 5 outfits that reflect Nigerian culture while being suitable for a global audience. Timeline is 6 weeks. Is this feasible?",
    isRead: true,
    createdAt: "2026-06-10T08:00:00Z",
  },
];

export const useMessages = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  service: string = ""
) => {
  return useQuery<MessagesResponse>({
    queryKey: ["messages", page, limit, search, service],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      let filtered = MOCK_MESSAGES;
      if (search)
        filtered = filtered.filter(
          (m) =>
            `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase())
        );
      if (service)
        filtered = filtered.filter((m) =>
          m.serviceOfInterest.toLowerCase().includes(service.toLowerCase())
        );
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

export const useMessageSummary = () => {
  return useQuery<MessageSummaryResponse>({
    queryKey: ["messages-summary"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return {
        status: "success",
        message: "ok",
        data: {
          total: MOCK_MESSAGES.length,
          unread: MOCK_MESSAGES.filter((m) => !m.isRead).length,
          read: MOCK_MESSAGES.filter((m) => m.isRead).length,
        },
      };
    },
  });
};
