import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  id: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
