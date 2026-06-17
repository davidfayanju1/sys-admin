import api from "../lib/axios";
import type {
  CreateStaffPayload,
  StaffListResponse,
  StaffRole,
  StaffSingleResponse,
  StaffUser,
  UpdateStaffPayload,
} from "../types/staff";

export const staffService = {
  getRoles: async (): Promise<StaffRole[]> => {
    const response = await api.get("/users/roles");
    return response.data.data.roles;
  },

  getUsers: async (
    page: number = 1,
    limit: number = 20,
    search?: string,
    role?: string,
    status?: string,
  ): Promise<StaffListResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (role && role !== "all") params.append("role", role);
    if (status && status !== "all") params.append("status", status);
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  getUserById: async (id: string): Promise<StaffSingleResponse["data"]> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (payload: CreateStaffPayload): Promise<StaffUser> => {
    const response = await api.post("/users", payload);
    return response.data.data.user;
  },

  updateUser: async (
    id: string,
    payload: UpdateStaffPayload,
  ): Promise<StaffUser> => {
    const response = await api.patch(`/users/${id}`, payload);
    return response.data.data.user;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  deactivateUser: async (id: string): Promise<StaffUser> => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data.data.user;
  },

  activateUser: async (id: string): Promise<StaffUser> => {
    const response = await api.patch(`/users/${id}/activate`);
    return response.data.data.user;
  },
};
