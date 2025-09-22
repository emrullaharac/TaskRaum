import { api } from "../../api/client";
import type { ProjectDto, ProjectStatus } from "../../types/domain";

export async function listProjects(params?: { status?: ProjectStatus; page?: number; size?: number; sort?: string }): Promise<ProjectDto[]> {
    const { data } = await api.get("/api/projects", {
        params: { status: "ACTIVE", page: 0, size: 50, sort: "updatedAt, DESC", ...(params || {}) },
    });
    if (data && typeof data === "object" && "content" in data) return (data.content as ProjectDto[]) ?? [];
    return data ?? [];
}

export async function createProject(payload: Partial<ProjectDto>): Promise<ProjectDto> {
    const { data } = await api.post("/api/projects", payload);
    return data;
}

export async function updateProject(id: string, payload: Partial<ProjectDto>): Promise<ProjectDto> {
    const { data } = await api.put(`/api/projects/${id}`, payload);
    return data;
}

export async function deleteProject(id: string, force = true): Promise<void> {
    await api.delete(`/api/projects/${id}`, { params: { force } });
}