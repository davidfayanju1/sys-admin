// hooks/useSettings.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../services/settingsService";
import { toast } from "sonner";
import type { ChangePasswordPayload, SettingsData } from "../types/settings";
import { useAuthStore } from "../store/authStore";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getSettings(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: Partial<SettingsData>) =>
      settingsService.updateSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      // Keep the auth store in sync so the Topbar avatar updates immediately
      if (data.profile && user) {
        setUser({
          ...user,
          avatar: data.profile.avatar ?? user.avatar,
          firstName: data.profile.firstName || user.firstName,
          lastName: data.profile.lastName || user.lastName,
        });
      }
      toast.success("Settings saved successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save settings");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      settingsService.changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to change password");
    },
  });
};
