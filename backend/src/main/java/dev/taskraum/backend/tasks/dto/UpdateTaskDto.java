package dev.taskraum.backend.tasks.dto;

import dev.taskraum.backend.common.enums.TaskPriority;
import dev.taskraum.backend.common.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateTaskDto {
    @NotBlank @Size(min = 1, max = 160)
    private String title;

    @Size(max = 4000)
    private String description;

    private TaskStatus status;
    private Integer order;
    private TaskPriority priority;
    private LocalDate dueDate;
    private String assigneeId;
}
