import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "../services/staffService";
import { toast } from "sonner";
import type { CreateStaffPayload, UpdateStaffPayload } from "../types/staff";

export const useStaffRoles = () =>
  useQuery({
    queryKey: ["staff-roles"],
    queryFn: staffService.getRoles,
    staleTime: 10 * 60 * 1000,
  });

export const useStaff = (
  page: number,
  limit: number,
  search?: string,
  role?: string,
  status?: string,
) =>
  useQuery({
    queryKey: ["staff", page, limit, search, role, status],
    queryFn: () => staffService.getUsers(page, limit, search, role, status),
    staleTime: 2 * 60 * 1000,
  });

export const useStaffStats = () => {
  const total = useQuery({
    queryKey: ["staff-stats", "total"],
    queryFn: () => staffService.getUsers(1, 1),
    select: (d) => d.meta.total,
    staleTime: 5 * 60 * 1000,
  });
  const active = useQuery({
    queryKey: ["staff-stats", "active"],
    queryFn: () =>
      staffService.getUsers(1, 1, undefined, undefined, "active"),
    select: (d) => d.meta.total,
    staleTime: 5 * 60 * 1000,
  });
  const admins = useQuery({
    queryKey: ["staff-stats", "admin"],
    queryFn: () => staffService.getUsers(1, 1, undefined, "admin"),
    select: (d) => d.meta.total,
    staleTime: 5 * 60 * 1000,
  });
  const editors = useQuery({
    queryKey: ["staff-stats", "editor"],
    queryFn: () => staffService.getUsers(1, 1, undefined, "editor"),
    select: (d) => d.meta.total,
    staleTime: 5 * 60 * 1000,
  });
  return { total, active, admins, editors };
};

export const useStaffById = (id: string | null) =>
  useQuery({
    queryKey: ["staff-user", id],
    queryFn: () => staffService.getUserById(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStaffPayload) =>
      staffService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-stats"] });
      toast.success("Staff member created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create staff member",
      );
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStaffPayload;
    }) => staffService.updateUser(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-user", id] });
      toast.success("Staff member updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update staff member",
      );
    },
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-stats"] });
      toast.success("Staff member deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete staff member",
      );
    },
  });
};

export const useDeactivateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffService.deactivateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-user", id] });
      queryClient.invalidateQueries({ queryKey: ["staff-stats"] });
      toast.success("Staff member deactivated");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to deactivate staff member",
      );
    },
  });
};

export const useActivateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffService.activateUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-user", id] });
      queryClient.invalidateQueries({ queryKey: ["staff-stats"] });
      toast.success("Staff member activated");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to activate staff member",
      );
    },
  });
};
