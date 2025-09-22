export type ID = string;

export type ProjectStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";
export type TaskStatus    = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority  = "LOW" | "MEDIUM" | "HIGH";

export type ProjectDto = {
    id: ID; ownerId?: ID; title: string; description?: string | null;
    status?: ProjectStatus; createdAt?: string; updatedAt?: string;
};

export type TaskDto = {
    id: ID; projectId: ID; title: string; description?: string | null;
    status: TaskStatus; order?: number | null; priority?: TaskPriority | null;
    dueDate?: string | null; assigneeId?: ID | null; createdAt?: string; updatedAt?: string;
};

export type UserDto = { id: ID; email: string; name: string; surname?: string | null; };

export type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number; size: number };