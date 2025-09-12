package dev.taskraum.backend.projects;

import dev.taskraum.backend.common.enums.ProjectStatus;
import dev.taskraum.backend.projects.dto.CreateProjectDto;
import dev.taskraum.backend.projects.dto.ProjectResponse;
import dev.taskraum.backend.projects.dto.UpdateProjectDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepo;
    // taskRepo for delete

    public Page<ProjectResponse> list(String ownerId, ProjectStatus status, Pageable pageable) {
        return projectRepo.findByOwnerIdAndStatus(ownerId, status, pageable).map(this::toResponse);
    }

    @Transactional
    public ProjectResponse create(String ownerId, CreateProjectDto dto) {
        Project p = Project.builder()
                .ownerId(ownerId)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(ProjectStatus.ACTIVE)
                .build();
        return toResponse(projectRepo.save(p));
    }

    public ProjectResponse get(String ownerId, String id) {
        Project p = projectRepo.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("PROJECT_NOT_FOUND"));
        return toResponse(p);
    }

    @Transactional
    public ProjectResponse update(String ownerId, String id, UpdateProjectDto dto) {
        Project p = projectRepo.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("PROJECT_NOT_FOUND"));

        boolean wasArchived = p.getStatus() == ProjectStatus.ARCHIVED;
        boolean wantsUnarchive = dto.getStatus() == ProjectStatus.ACTIVE;

        if (wasArchived && !wantsUnarchive) {
            throw new IllegalStateException("PROJECT_ARCHIVED_READ_ONLY");
        }

        if (dto.getStatus() != null) {
            p.setStatus(dto.getStatus());
        }

        if (dto.getTitle() != null) p.setTitle(dto.getTitle());
        if (dto.getDescription() != null) p.setDescription(dto.getDescription());

        return toResponse(projectRepo.save(p));
    }

    @Transactional
    public void hardDelete(String ownerId, String id) {
        Project p = projectRepo.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("PROJECT_NOT_FOUND"));

        // taskRepo delete Orphan Tasks with id(Project)

        projectRepo.delete(p);
    }

    private ProjectResponse toResponse(Project p) {
        return ProjectResponse.builder()
                .id(p.getId())
                .ownerId(p.getOwnerId())
                .title(p.getTitle())
                .description(p.getDescription())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

}
