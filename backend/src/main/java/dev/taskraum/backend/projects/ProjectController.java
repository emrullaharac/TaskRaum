package dev.taskraum.backend.projects;

import dev.taskraum.backend.common.enums.ProjectStatus;
import dev.taskraum.backend.projects.dto.CreateProjectDto;
import dev.taskraum.backend.projects.dto.ProjectResponse;
import dev.taskraum.backend.projects.dto.UpdateProjectDto;
import dev.taskraum.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService service;

    @GetMapping
    public Page<ProjectResponse> list(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestParam(defaultValue = "ACTIVE") ProjectStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "updatedAt, DESC") String sort) {

        String[] s = sort.split(",");
        Sort.Direction dir = (s.length > 1 && "ASC".equalsIgnoreCase(s[1])) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, s[0]));
        return service.list(me.id(), status, pageable);
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> create(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody @Valid CreateProjectDto dto) {

        var res = service.create(me.id(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping("/{id}")
    public ProjectResponse get(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable String id) {
        return service.get(me.id(), id);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable String id,
            @RequestBody @Valid UpdateProjectDto dto) {
        return service.update(me.id(), id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable String id,
            @RequestParam(defaultValue = "false") boolean force
    ) {
        if (!force) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        service.hardDelete(me.id(), id);
        return ResponseEntity.noContent().build();
    }
}
