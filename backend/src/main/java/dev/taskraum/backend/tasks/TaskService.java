package dev.taskraum.backend.tasks;

import dev.taskraum.backend.common.enums.ProjectStatus;
import dev.taskraum.backend.common.enums.TaskPriority;
import dev.taskraum.backend.common.enums.TaskStatus;
import dev.taskraum.backend.projects.Project;
import dev.taskraum.backend.projects.ProjectRepository;
import dev.taskraum.backend.tasks.dto.CreateTaskDto;
import dev.taskraum.backend.tasks.dto.TaskResponse;
import dev.taskraum.backend.tasks.dto.UpdateTaskDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepo;
    private final ProjectRepository projectRepo;


    // --- Helpers --- //

    private Project requireOwnedProject(String ownerId, String projectId) {
        return projectRepo.findByIdAndOwnerId(projectId, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("PROJECT_NOT_FOUND"));
    }

    private void ensureNotArchived(Project project) {
        if (project.getStatus() == ProjectStatus.ARCHIVED) {
            throw new IllegalStateException("PROJECT_ARCHIVED_READ_ONLY");
        }
    }

    private int nextOrder(String projectId, TaskStatus status) {
        Task last = taskRepo.findTopByProjectIdAndStatusOrderByOrderDesc(projectId, status);
        return (last == null) ? 100 : last.getOrder() + 100;
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .projectId(task.getProjectId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .order(task.getOrder())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .assigneeId(task.getAssigneeId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    // --- API --- //

    public List<TaskResponse> list(String ownerId, String projectId, TaskStatus status) {
        requireOwnedProject(ownerId, projectId);
        return taskRepo.findByProjectIdAndStatusOrderByOrderAsc(projectId, status)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public TaskResponse create(String ownerId, String projectId, CreateTaskDto dto) {
        var project =  requireOwnedProject(ownerId, projectId);
        ensureNotArchived(project);

        TaskStatus status = dto.getStatus() != null ? dto.getStatus() : TaskStatus.TODO;
        int order =  dto.getOrder() != null ? dto.getOrder() : nextOrder(projectId, status);

        Task task = Task.builder()
                .projectId(project.getId())
                .title(dto.getTitle().trim())
                .description(dto.getDescription())
                .status(status)
                .order(order)
                .priority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.MEDIUM)
                .dueDate(dto.getDueDate())
                .assigneeId(dto.getAssigneeId())
                .build();

        return toResponse(taskRepo.save(task));
    }

    @Transactional
    public TaskResponse update(String ownerId, String taskId, UpdateTaskDto dto) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("TASK_NOT_FOUND"));

        var project = projectRepo.findByIdAndOwnerId(task.getProjectId(), ownerId)
                .orElseThrow(() -> new IllegalArgumentException("PROJECT_NOT_FOUND"));
        ensureNotArchived(project);

        TaskStatus currentStatus = task.getStatus();
        TaskStatus newStatus = dto.getStatus() !=  null ? dto.getStatus() : currentStatus;

        if (dto.getStatus() != null) task.setStatus(newStatus);

        // Order logic: if not provided and column changes, append to end of target column
        if (dto.getOrder() != null) {
            task.setOrder(dto.getOrder());
        } else if (newStatus != currentStatus) {
            task.setOrder(nextOrder(task.getProjectId(), newStatus));
        }

        if (dto.getTitle() != null) task.setTitle(dto.getTitle().trim());
        if (dto.getDescription() != null) task.setDescription(dto.getDescription());
        if (dto.getPriority() != null) task.setPriority(dto.getPriority());
        if (dto.getDueDate() != null) task.setDueDate(dto.getDueDate());
        if (dto.getAssigneeId() != null) task.setAssigneeId(dto.getAssigneeId());

        return toResponse(taskRepo.save(task));
    }

    @Transactional
    public void delete(String ownerId, String taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("TASK_NOT_FOUND"));

        projectRepo.findByIdAndOwnerId(task.getProjectId(), ownerId)
                .orElseThrow(() -> new IllegalArgumentException("PROJECT_NOT_FOUND"));

        taskRepo.delete(task);
    }
}
