package dev.taskraum.backend.tasks;

import dev.taskraum.backend.common.enums.ProjectStatus;
import dev.taskraum.backend.common.enums.TaskPriority;
import dev.taskraum.backend.common.enums.TaskStatus;
import dev.taskraum.backend.projects.Project;
import dev.taskraum.backend.projects.ProjectRepository;
import dev.taskraum.backend.tasks.dto.CreateTaskDto;
import dev.taskraum.backend.tasks.dto.TaskResponse;
import dev.taskraum.backend.tasks.dto.UpdateTaskDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    TaskRepository taskRepo;
    ProjectRepository projectRepo;
    TaskService service;

    @BeforeEach
    void setUp() {
        taskRepo = mock(TaskRepository.class);
        projectRepo = mock(ProjectRepository.class);
        service = new TaskService(taskRepo, projectRepo);
    }

    // --- Helpers --- //

    private Project project(String id, ProjectStatus status) {
        return Project.builder()
                .id(id)
                .ownerId("u1")
                .title("Demo project")
                .status(status)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    private Task task(String id, String projectId, TaskStatus status, int order) {
        return Task.builder()
                .id(id).projectId(projectId)
                .title("Title").description("Desc")
                .status(status).order(order)
                .priority(TaskPriority.MEDIUM)
                .createdAt(Instant.now()).updatedAt(Instant.now())
                .build();
    }

    // --- Tests --- //

    @Test
    void list_returnsMappedResponses_whenProjectOwned() {
        String owner = "u1"; String projectId = "p1";
        when(projectRepo.findByIdAndOwnerId(projectId, owner))
                .thenReturn(Optional.of(project(projectId, ProjectStatus.ACTIVE)));
        when(taskRepo.findByProjectIdAndStatusOrderByOrderAsc(projectId, TaskStatus.TODO))
                .thenReturn(List.of(task("t1", projectId, TaskStatus.TODO, 100)));

        var res = service.list(owner, projectId, TaskStatus.TODO);

        assertThat(res).hasSize(1);
        assertThat(res.getFirst().getId()).isEqualTo("t1");
    }

    @Test
    void list_throws_whenProjectNotOwned() {
        when(projectRepo.findByIdAndOwnerId("pX", "u1")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.list("u1", "pX", TaskStatus.TODO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("PROJECT_NOT_FOUND");
    }

    @Test
    void create_defaultsStatusOrderPriority_andTrimsTitle() {
        String owner = "u1"; String projectId = "p1";
        when(projectRepo.findByIdAndOwnerId(projectId, owner))
                .thenReturn(Optional.of(project(projectId, ProjectStatus.ACTIVE)));
        when(taskRepo.findTopByProjectIdAndStatusOrderByOrderDesc(projectId, TaskStatus.TODO))
                .thenReturn(null);

        ArgumentCaptor<Task> saved = ArgumentCaptor.forClass(Task.class);
        when(taskRepo.save(saved.capture())).thenAnswer(inv -> {
            Task task = saved.getValue();
            return Task.builder()
                    .projectId(task.getProjectId()).title(task.getTitle())
                    .description(task.getDescription()).status(task.getStatus())
                    .order(task.getOrder()).priority(task.getPriority())
                    .dueDate(task.getDueDate()).assigneeId(task.getAssigneeId())
                    .createdAt(Instant.now()).updatedAt(Instant.now()).build();
        });

        var dto = new CreateTaskDto();
        dto.setTitle("   Title   ");
        TaskResponse res = service.create(owner, projectId, dto);

        assertThat(res.getStatus()).isEqualTo(TaskStatus.TODO);
        assertThat(res.getOrder()).isEqualTo(100);
        assertThat(res.getPriority()).isEqualTo(TaskPriority.MEDIUM);
        assertThat(saved.getValue().getTitle()).isEqualTo("Title");
    }

    @Test
    void create_usesProvidedFields_andNextOrderWhenNoGreaterExists() {
        String owner = "u1"; String projectId = "p1";
        when(projectRepo.findByIdAndOwnerId(projectId, owner))
                .thenReturn(Optional.of(project(projectId, ProjectStatus.ACTIVE)));
        when(taskRepo.findTopByProjectIdAndStatusOrderByOrderDesc(projectId, TaskStatus.IN_PROGRESS))
                .thenReturn(task("tLast", projectId, TaskStatus.IN_PROGRESS, 300));

        var dto =  new CreateTaskDto();
        dto.setTitle("X");
        dto.setStatus(TaskStatus.IN_PROGRESS);
        dto.setPriority(TaskPriority.HIGH);
        when(taskRepo.save(any())).thenAnswer(i -> i.getArgument(0));

        TaskResponse res = service.create(owner, projectId, dto);

        assertThat(res.getOrder()).isEqualTo(400);
        assertThat(res.getPriority()).isEqualTo(TaskPriority.HIGH);
        assertThat(res.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
    }

    @Test
    void create_fails_whenProjectArchived() {
        String owner = "u1"; String projectId = "p1";
        when(projectRepo.findByIdAndOwnerId(projectId, owner))
                .thenReturn(Optional.of(project(projectId, ProjectStatus.ARCHIVED)));

        var dto = new CreateTaskDto(); dto.setTitle("X");

        assertThatThrownBy(() -> service.create(owner, projectId, dto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("PROJECT_ARCHIVED_READ_ONLY");
    }

    @Test
    void update_changesColumn_withoutOrder_appendsToEndOfTargetColumn() {
        Task existing = task("t1", "p1", TaskStatus.TODO, 200);
        when(taskRepo.findById("t1")).thenReturn(Optional.of(existing));

        when(projectRepo.findByIdAndOwnerId("p1", "u1")).thenReturn(Optional.of(project("p1", ProjectStatus.ACTIVE)));
        when(taskRepo.findTopByProjectIdAndStatusOrderByOrderDesc("p1", TaskStatus.DONE))
                .thenReturn(task("last", "p1", TaskStatus.DONE, 700));
        when(taskRepo.save(any())).thenAnswer(i -> i.getArgument(0));

        var dto = new UpdateTaskDto();
        dto.setStatus(TaskStatus.DONE); // move column, no explicit order

        TaskResponse res = service.update("u1", "t1", dto);

        assertThat(res.getStatus()).isEqualTo(TaskStatus.DONE);
        assertThat(res.getOrder()).isEqualTo(800);
    }

    @Test
    void update_sameColumn_noOrder_keepsOrder() {
        Task existing = task("t1", "p1", TaskStatus.TODO, 200);
        when(taskRepo.findById("t1")).thenReturn(Optional.of(existing));
        when(projectRepo.findByIdAndOwnerId("p1", "u1"))
                .thenReturn(Optional.of(project("p1", ProjectStatus.ACTIVE)));
        when(taskRepo.save(any())).thenAnswer(i -> i.getArgument(0));

        var dto = new UpdateTaskDto(); // no changes

        TaskResponse res = service.update("u1", "t1", dto);

        assertThat(res.getOrder()).isEqualTo(200);
        assertThat(res.getStatus()).isEqualTo(TaskStatus.TODO);
    }

    @Test
    void update_withExplicitOrder_overridesOrder() {
        Task existing = task("t1", "p1", TaskStatus.TODO, 200);
        when(taskRepo.findById("t1")).thenReturn(Optional.of(existing));
        when(projectRepo.findByIdAndOwnerId("p1", "u1"))
                .thenReturn(Optional.of(project("p1", ProjectStatus.ACTIVE)));
        when(taskRepo.save(any())).thenAnswer(i -> i.getArgument(0));

        var dto = new UpdateTaskDto();
        dto.setOrder(42);

        TaskResponse res = service.update("u1", "t1", dto);
        assertThat(res.getOrder()).isEqualTo(42);
    }

    @Test
    void update_updatesOnlyProvidedFields() {
        Task existing = task("t1", "p1", TaskStatus.TODO, 200);
        when(taskRepo.findById("t1")).thenReturn(Optional.of(existing));
        when(projectRepo.findByIdAndOwnerId("p1", "u1"))
                .thenReturn(Optional.of(project("p1", ProjectStatus.ACTIVE)));
        when(taskRepo.save(any())).thenAnswer(i -> i.getArgument(0));

        var dto = new UpdateTaskDto();
        dto.setTitle("   New    ");
        dto.setDescription("Desc");
        dto.setPriority(TaskPriority.LOW);

        TaskResponse res = service.update("u1", "t1", dto);

        assertThat(res.getTitle()).isEqualTo("New");
        assertThat(res.getDescription()).isEqualTo("Desc");
        assertThat(res.getPriority()).isEqualTo(TaskPriority.LOW);
    }

    @Test
    void update_throws_whenTaskNotFound() {
        when(taskRepo.findById("tX")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.update("u1", "tX", new UpdateTaskDto()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("TASK_NOT_FOUND");
    }

    @Test
    void update_throws_whenProjectNotOwned() {
        Task existing = task("t1", "p1", TaskStatus.TODO, 100);
        when(taskRepo.findById("t1")).thenReturn(Optional.of(existing));
        when(projectRepo.findByIdAndOwnerId("p1", "u1")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update("u1", "t1", new UpdateTaskDto()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("PROJECT_NOT_FOUND");
    }

    @Test
    void deleteRemovesTask_whenOwned() {
        Task existing = task("t1", "p1", TaskStatus.TODO, 100);
        when(taskRepo.findById("t1")).thenReturn(Optional.of(existing));
        when(projectRepo.findByIdAndOwnerId("p1", "u1"))
                .thenReturn(Optional.of(project("p1", ProjectStatus.ACTIVE)));

        service.delete("u1", "t1");

        verify(taskRepo).delete(existing);
    }

    @Test
    void delete_throws_whenTaskNotFound() {
        when(taskRepo.findById("tX")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.delete("u1", "tX"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("TASK_NOT_FOUND");
    }

    @Test
    void delete_throws_whenProjectNotOwned() {
        Task existing = task("t1", "p1", TaskStatus.TODO, 100);
        when(taskRepo.findById("t1")).thenReturn(Optional.of(existing));
        when(projectRepo.findByIdAndOwnerId("p1", "u1")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.delete("u1", "t1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("PROJECT_NOT_FOUND");
    }
}