import { api } from "../../api/client";
import type { TaskDto, TaskStatus, TaskPriority } from "../../types/domain";

export type CreateTaskPayload = {
    title: string;
    description?: string | null;
    status?: TaskStatus;
    dueDate?: string | null;
    order?: number | null;
    priority?: TaskPriority | null;
    assigneeId?: string | null;
};

export type UpdateTaskPayload = Partial<
    Pick<TaskDto, "title" | "description" | "status" | "dueDate" | "order" | "priority" | "assigneeId">
>;

export async function listTasksByProjectStatus(projectId: string, status: TaskStatus): Promise<TaskDto[]> {
    const { data } = await api.get(`/api/projects/${projectId}/tasks`, { params: { status } });
    return Array.isArray(data) ? data : [];
}

export async function listAllTasksByProject(projectId: string): Promise<TaskDto[]> {
    const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
    const parts = await Promise.all(statuses.map(s => listTasksByProjectStatus(projectId, s)));
    return parts.flat();
}

export async function createTask(projectId: string, payload: CreateTaskPayload): Promise<TaskDto> {
    const { data } = await api.post(`/api/projects/${projectId}/tasks`, payload);
    return data;
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<TaskDto> {
    const { data } = await api.put(`/api/tasks/${id}`, payload);
    return data;
}

export async function deleteTask(id: string): Promise<void> {
    await api.delete(`/api/tasks/${id}`);
}

export async function moveTask(task: TaskDto, status: TaskStatus, order?: number | null): Promise<TaskDto> {
    const body: UpdateTaskPayload = {
        title: task.title,
        description: task.description ?? null,
        dueDate: task.dueDate ?? null,
        priority: task.priority ?? null,
        assigneeId: task.assigneeId ?? null,
        status,
    };
    if (order !== undefined) body.order = order;

    const { data } = await api.put(`/api/tasks/${task.id}`, body);
    return data;
}