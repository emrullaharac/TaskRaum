import { api } from "../../api/client";
import type { UserDto } from "../../types/domain";
import { normalizeUser } from "../../types/normalizers";

export async function login(email: string, password: string) {
    await api.post("/auth/login", { email, password });
}

export async function register(name: string, surname: string, email: string, password: string) {
    await api.post("/auth/register", { name, surname, email, password });
}

export async function me(): Promise<UserDto | null> {
    try {
        const { data } = await api.get("/auth/me", { skipAuthRedirect: true });
        return normalizeUser(data);
    } catch {
        return null;
    }
}

export async function logout() {
    await api.post("/auth/logout");
}