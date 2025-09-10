import { create } from "zustand";
import { me, type UserDto } from "../features/auth/api";

type AuthState = {
    user: UserDto | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
    clear: () => void;
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
}));