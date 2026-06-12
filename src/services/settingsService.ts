// services/settingsService.ts
import api from "../lib/axios";
import type { ChangePasswordPayload, SettingsData } from "../types/settings";

export const settingsService = {
  // Get all settings
  getSettings: async (): Promise<SettingsData> => {
    const response = await api.get("/settings");
    return response.data.data;
  },

  // Update settings (partial update supported)
  updateSettings: async (
    data: Partial<SettingsData>,
  ): Promise<SettingsData> => {
    const response = await api.patch("/settings", data);
    return response.data.data;
  },

  // Change admin password
  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await api.patch("/settings/security/password", payload);
  },
};
