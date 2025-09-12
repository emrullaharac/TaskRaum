package dev.taskraum.backend.projects.dto;

import dev.taskraum.backend.common.enums.ProjectStatus;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProjectDto {
    @Size(min = 1, max = 120)
    private String title;

    @Size(max = 2000)
    private String description;

    private ProjectStatus status;
}
