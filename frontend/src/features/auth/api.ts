import { api } from "../../api/client";

export type UserDto = {id: string; name: string; surname?: string; email: string;};

export async function login(email: string, password: string) {
    await api.post("/auth/login", {email, password});
}

export async function register(name: string, surname: string, email: string, password: string) {
    await api.post("/auth/register", {name, surname, email, password});
}

export async function me(): Promise<UserDto | null> {
    try {
        const {data} = await api.get<UserDto>("/auth/me");
        return data;
    }
    catch {
        return null;
    }
}

export async function logout() {
    await api.post("/auth/logout");
}