package dev.taskraum.backend.projects.dto;

import dev.taskraum.backend.common.enums.ProjectStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ProjectResponse {
    String id;
    String ownerId;
    String title;
    String description;
    ProjectStatus status;
    Instant createdAt;
    Instant updatedAt;
}
