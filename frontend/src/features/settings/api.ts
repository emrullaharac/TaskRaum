import { api } from "../../api/client.ts";
import type { UserDto } from "../../types/domain.ts";
import { normalizeUser } from "../../types/normalizers.ts";

export async function updateProfile(payload: Partial<UserDto>): Promise<UserDto> {
    const { data } = await api.put("/api/me", payload);
    return normalizeUser(data);
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.put("/api/me/password", payload);
}