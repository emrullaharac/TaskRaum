package dev.taskraum.backend.tasks.dto;

import dev.taskraum.backend.common.enums.TaskPriority;
import dev.taskraum.backend.common.enums.TaskStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.time.LocalDate;

@Value
@Builder
public class TaskResponse {
    String id;
    String projectId;
    String title;
    String description;
    TaskStatus status;
    Integer order;
    TaskPriority priority;
    LocalDate dueDate;
    String assigneeId;
    Instant createdAt;
    Instant updatedAt;
}
