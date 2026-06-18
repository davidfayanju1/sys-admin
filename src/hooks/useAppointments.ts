import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export interface SendEmailPayload {
  subject: string;
  message: string;
}

export interface ScheduleMeetingPayload {
  meetingLink: string;
  message: string;
}

export const useSendAppointmentEmail = () =>
  useMutation({
    mutationFn: ({ id, ...payload }: SendEmailPayload & { id: string }) =>
      api.post(`/appointments/${id}/send-email`, payload).then((r) => r.data),
  });

export const useScheduleMeeting = () =>
  useMutation({
    mutationFn: ({ id, ...payload }: ScheduleMeetingPayload & { id: string }) =>
      api.post(`/appointments/${id}/schedule-meeting`, payload).then((r) => r.data),
  });

export interface Appointment {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  appointmentType: string;
  whatDoYouNeed: string;
  preferredDate: string;
  duration: string;
  consultationFormat: "virtual" | "in-studio";
  additionalNotes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface AppointmentsResponse {
  status: string;
  message: string;
  data: Appointment[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AppointmentSummary {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface AppointmentSummaryResponse {
  status: string;
  message: string;
  data: AppointmentSummary;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    _id: "a1",
    id: "APT-001",
    fullName: "Amara Okafor",
    email: "amara.okafor@gmail.com",
    phoneNumber: "+234 803 456 7890",
    appointmentType: "Bespoke Consultation",
    whatDoYouNeed: "Custom bridal gown for my wedding in December",
    preferredDate: "2026-07-10T10:00:00Z",
    duration: "1 hour",
    consultationFormat: "in-studio",
    additionalNotes: "I prefer something elegant and modest with Ankara accents.",
    status: "confirmed",
    createdAt: "2026-06-15T08:30:00Z",
  },
  {
    _id: "a2",
    id: "APT-002",
    fullName: "Chisom Adeyemi",
    email: "chisom.a@yahoo.com",
    phoneNumber: "+234 706 234 5678",
    appointmentType: "Wardrobe Styling",
    whatDoYouNeed: "Complete wardrobe refresh for a new corporate role",
    preferredDate: "2026-07-12T14:00:00Z",
    duration: "2 hours",
    consultationFormat: "virtual",
    status: "pending",
    createdAt: "2026-06-16T10:15:00Z",
  },
  {
    _id: "a3",
    id: "APT-003",
    fullName: "Funke Balogun",
    email: "funke.b@outlook.com",
    phoneNumber: "+234 815 678 9012",
    appointmentType: "Bespoke Consultation",
    whatDoYouNeed: "Aso-ebi coordination for a family event of 12 people",
    preferredDate: "2026-07-08T11:00:00Z",
    duration: "1.5 hours",
    consultationFormat: "in-studio",
    additionalNotes: "Family event on 30th August. Need burgundy and gold theme.",
    status: "completed",
    createdAt: "2026-06-10T09:00:00Z",
  },
  {
    _id: "a4",
    id: "APT-004",
    fullName: "Ngozi Eze",
    email: "ngozi.eze@gmail.com",
    phoneNumber: "+234 902 345 6789",
    appointmentType: "Ready-to-Wear Fitting",
    whatDoYouNeed: "Fitting for two gowns purchased online",
    preferredDate: "2026-07-15T09:30:00Z",
    duration: "30 minutes",
    consultationFormat: "in-studio",
    status: "pending",
    createdAt: "2026-06-17T14:00:00Z",
  },
  {
    _id: "a5",
    id: "APT-005",
    fullName: "Temi Adeleke",
    email: "temi.adeleke@icloud.com",
    phoneNumber: "+234 811 123 4567",
    appointmentType: "Wardrobe Styling",
    whatDoYouNeed: "Red carpet looks for the upcoming awards season",
    preferredDate: "2026-07-20T16:00:00Z",
    duration: "2 hours",
    consultationFormat: "virtual",
    additionalNotes: "Attending three events in September. Need distinct looks for each.",
    status: "confirmed",
    createdAt: "2026-06-17T16:45:00Z",
  },
  {
    _id: "a6",
    id: "APT-006",
    fullName: "Sade Fashola",
    email: "sade.f@gmail.com",
    phoneNumber: "+234 704 987 6543",
    appointmentType: "Bespoke Consultation",
    whatDoYouNeed: "Traditional attire for an engagement ceremony",
    preferredDate: "2026-06-28T10:00:00Z",
    duration: "1 hour",
    consultationFormat: "in-studio",
    status: "cancelled",
    createdAt: "2026-06-05T11:00:00Z",
  },
  {
    _id: "a7",
    id: "APT-007",
    fullName: "Blessing Nwosu",
    email: "blessingnwosu@gmail.com",
    phoneNumber: "+234 808 765 4321",
    appointmentType: "Style Consultation",
    whatDoYouNeed: "Building a capsule wardrobe on a budget",
    preferredDate: "2026-07-22T13:00:00Z",
    duration: "1 hour",
    consultationFormat: "virtual",
    status: "pending",
    createdAt: "2026-06-18T07:20:00Z",
  },
  {
    _id: "a8",
    id: "APT-008",
    fullName: "Ifeoma Chukwu",
    email: "ifeoma.c@gmail.com",
    phoneNumber: "+234 913 456 7890",
    appointmentType: "Bespoke Consultation",
    whatDoYouNeed: "Maternity photoshoot outfit — something flowing and elegant",
    preferredDate: "2026-07-05T11:30:00Z",
    duration: "1 hour",
    consultationFormat: "in-studio",
    status: "completed",
    createdAt: "2026-06-08T13:00:00Z",
  },
];

export const useAppointments = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  status: string = ""
) => {
  return useQuery<AppointmentsResponse>({
    queryKey: ["appointments", page, limit, search, status],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      let filtered = MOCK_APPOINTMENTS;
      if (search)
        filtered = filtered.filter(
          (a) =>
            a.fullName.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase()) ||
            a.appointmentType.toLowerCase().includes(search.toLowerCase())
        );
      if (status) filtered = filtered.filter((a) => a.status === status);
      const start = (page - 1) * limit;
      return {
        status: "success",
        message: "ok",
        data: filtered.slice(start, start + limit),
        meta: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) },
      };
    },
  });
};

export const useAppointmentSummary = () => {
  return useQuery<AppointmentSummaryResponse>({
    queryKey: ["appointments-summary"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return {
        status: "success",
        message: "ok",
        data: {
          total: MOCK_APPOINTMENTS.length,
          pending: MOCK_APPOINTMENTS.filter((a) => a.status === "pending").length,
          confirmed: MOCK_APPOINTMENTS.filter((a) => a.status === "confirmed").length,
          completed: MOCK_APPOINTMENTS.filter((a) => a.status === "completed").length,
          cancelled: MOCK_APPOINTMENTS.filter((a) => a.status === "cancelled").length,
        },
      };
    },
  });
};
