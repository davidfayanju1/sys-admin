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
  id: string;
  source: string;
  sourceId: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  service: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface AppointmentSummary {
  total: number;
  appointments: number;
  consultations: number;
  inquiries: number;
  pending: number;
  confirmed: number;
}

interface AppointmentsResponse {
  status: string;
  message: string;
  data: {
    items: Appointment[];
    summary: AppointmentSummary;
  };
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface AppointmentSummaryResponse {
  status: string;
  message: string;
  data: AppointmentSummary;
}

export const useAppointments = (
  page: number = 1,
  limit: number = 20,
  search: string = "",
  status: string = ""
) => {
  return useQuery<AppointmentsResponse>({
    queryKey: ["appointments", page, limit, search, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      });
      const response = await api.get(`/appointments?${params.toString()}`);
      return response.data;
    },
  });
};

export const useAppointmentSummary = () => {
  return useQuery<AppointmentSummaryResponse>({
    queryKey: ["appointments-summary"],
    queryFn: async () => {
      const response = await api.get("/appointments?page=1&limit=1");
      const summary: AppointmentSummary = response.data?.data?.summary ?? {
        total: 0,
        appointments: 0,
        consultations: 0,
        inquiries: 0,
        pending: 0,
        confirmed: 0,
      };
      return { status: "success", message: "ok", data: summary };
    },
  });
};
