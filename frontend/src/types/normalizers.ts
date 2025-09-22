import type { ID, UserDto } from "./domain";

type UserLike = {
    id?: string;
    email?: string;
    name?: string;
    surname?: string | null;
};

/**
 * Normalize any backend "user-like" payload into our UserDto shape.
 * - Accepts `unknown` (no `any`)
 * - Ensures `surname` is null (not undefined)
 */
export function normalizeUser(u: unknown): UserDto {
    const o = (u ?? {}) as UserLike;
    return {
        id: (o.id ?? "") as ID,
        email: o.email ?? "",
        name: o.name ?? "",
        surname: o.surname ?? null,
    };
}