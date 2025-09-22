import { create } from "zustand";
import { me, logout as apiLogout } from "../features/auth/api";
import type { UserDto } from "../types/domain";
import { setLoggingOut } from "../api/client";

type AuthState = {
    user: UserDto | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
    clear: () => void;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    fetchUser: async () => {
        try {
            const u = await me();
            set({ user: u, loading: false });
        } catch {
            set({ user: null, loading: false });
        }
    },
    clear: () => set({ user: null }),
    logout: async () => {
        try {
            setLoggingOut(true);
            await apiLogout();
        } finally {
            set({ user: null });
        }
    },
}));