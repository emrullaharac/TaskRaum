package dev.taskraum.backend.projects;

import dev.taskraum.backend.common.enums.ProjectStatus;
import dev.taskraum.backend.projects.dto.CreateProjectDto;
import dev.taskraum.backend.projects.dto.ProjectResponse;
import dev.taskraum.backend.projects.dto.UpdateProjectDto;
import dev.taskraum.backend.tasks.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;



class ProjectServiceTest {

    @Mock private ProjectRepository projectRepo;
    @Mock private TaskRepository taskRepo;
    private ProjectService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new ProjectService(projectRepo,  taskRepo);
    }

    @Test
    void list_returnsPagedResponses() {
        var p = Project.builder()
                .id("p1")
                .ownerId("u1")
                .title("T")
                .status(ProjectStatus.ACTIVE)
                .build();

        when(projectRepo.findByOwnerIdAndStatus(eq("u1"), eq(ProjectStatus.ACTIVE), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(p)));

        Page<ProjectResponse> page =
                service.list("u1", ProjectStatus.ACTIVE, PageRequest.of(0, 20));

        assertThat(page.getTotalElements()).isEqualTo(1);
        assertThat(page.getContent().getFirst().getId()).isEqualTo("p1");
        verify(projectRepo).findByOwnerIdAndStatus(eq("u1"), eq(ProjectStatus.ACTIVE), any());
    }

    @Test
    void create_setsActiveAndSaves() {
        var dto = new CreateProjectDto(); dto.setTitle("New"); dto.setDescription("Desc");
        var saved = Project.builder()
                .id("p2")
                .ownerId("u1")
                .title("New")
                .status(ProjectStatus.ACTIVE)
                .build();

        when(projectRepo.save(any(Project.class))).thenReturn(saved);

        var res = service.create("u1", dto);

        assertThat(res.getStatus()).isEqualTo(ProjectStatus.ACTIVE);
        assertThat(res.getTitle()).isEqualTo("New");
        verify(projectRepo).save(argThat(p -> p.getOwnerId().equals("u1") &&
                p.getStatus().equals(ProjectStatus.ACTIVE)));
    }

    @Test
    void get_throwsIfNotFound() {
        when(projectRepo.findByIdAndOwnerId("p404", "u1")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.get("u1", "p404"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("PROJECT_NOT_FOUND");
    }

    @Test
    void update_allowsFieldUpdatesWhenNotArchived() {
        var p = Project.builder()
                .id("p1")
                .ownerId("u1")
                .title("Old_Title")
                .description("old_desc")
                .status(ProjectStatus.ACTIVE)
                .build();

        when(projectRepo.findByIdAndOwnerId("p1", "u1")).thenReturn(Optional.of(p));
        when(projectRepo.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        var dto = new UpdateProjectDto(); dto.setTitle("New_Title"); dto.setDescription("new_desc");
        var res = service.update("u1", "p1", dto);

        assertThat(res.getTitle()).isEqualTo("New_Title");
        assertThat(res.getDescription()).isEqualTo("new_desc");
    }

    @Test
    void update_blocksEditingArchivedUnlessUnarchiving() {
        var archived = Project.builder()
                .id("p1")
                .ownerId("u1")
                .title("Title")
                .status(ProjectStatus.ARCHIVED)
                .build();
        when(projectRepo.findByIdAndOwnerId("p1", "u1")).thenReturn(Optional.of(archived));

        var dto = new UpdateProjectDto(); dto.setTitle("X");
        assertThatThrownBy(() -> service.update("u1", "p1", dto))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("PROJECT_ARCHIVED_READ_ONLY");
    }

    @Test
    void update_allowsStatusActiveToUnarchiveThenEdit() {
        var archived = Project.builder()
                .id("p1")
                .ownerId("u1")
                .title("Before")
                .status(ProjectStatus.ARCHIVED)
                .build();
        when(projectRepo.findByIdAndOwnerId("p1", "u1")).thenReturn(Optional.of(archived));
        when(projectRepo.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));

        var dto = new UpdateProjectDto(); dto.setStatus(ProjectStatus.ACTIVE); dto.setTitle("After");
        var res = service.update("u1", "p1", dto);

        assertThat(res.getStatus()).isEqualTo(ProjectStatus.ACTIVE);
        assertThat(res.getTitle()).isEqualTo("After");
    }

    @Test
    void hardDelete_removesProjectWhenOwned() {
        var p = Project.builder()
                .id("p1")
                .ownerId("u1")
                .build();
        when(projectRepo.findByIdAndOwnerId("p1", "u1")).thenReturn(Optional.of(p));

        service.hardDelete("u1", "p1");
        verify(projectRepo).delete(p);
    }

}