import type { IUser } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  user: IUser | null;
  setUser: (data: IUser) => void;
  logout: () => void;
  token?: string | null;
  refreshToken?: string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        refreshToken: null,
        setUser: (data: IUser) => set(() => ({ user: data })),
        logout: () => set(() => ({ user: null, token: null, refreshToken: null })),
        setToken: (token: string | null) => set(() => ({ token: token })),
        setRefreshToken: (token: string | null) => set(() => ({ refreshToken: token })),
      }),
      {
        name: "youthshield-auth-storage",
        partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }),
      }
    )
  )
);
