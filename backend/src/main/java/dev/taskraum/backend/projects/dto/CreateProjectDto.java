package dev.taskraum.backend.projects.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateProjectDto {
    @NotBlank @Size(min = 1, max = 120)
    private String title;

    @Size(max = 2000)
    private String description;
}
