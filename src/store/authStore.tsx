import type { IUser } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  user: IUser | null;
  setUser: (data: IUser) => void;
  logout: () => void;
  token?: string | null;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        setUser: (data: IUser) => set(() => ({ user: data })),
        logout: () => set(() => ({ user: null, token: null })),
        setToken: (token: string | null) => set(() => ({ token: token })),
      }),
      {
        name: "carehalo-auth-storage",
        partialize: (state) => ({ token: state.token }),
      }
    )
  )
);
