package dev.taskraum.backend.tasks;

import dev.taskraum.backend.common.enums.TaskStatus;
import dev.taskraum.backend.security.UserPrincipal;
import dev.taskraum.backend.tasks.dto.TaskDto;
import dev.taskraum.backend.tasks.dto.TaskResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TaskController {
    private final TaskService service;

    // Column listing (one call per column)
    @GetMapping("/projects/{projectId}/tasks")
    public List<TaskResponse> list(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable String projectId,
            @RequestParam TaskStatus status) {
        return service.list(me.id(), projectId, status);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskResponse> create(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable String projectId,
            @RequestBody @Valid TaskDto dto
            ) {
        var res = service.create(me.id(), projectId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PutMapping("/tasks/{id}")
    public TaskResponse update(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable String id,
            @RequestBody @Valid TaskDto dto
    ) {
        return service.update(me.id(), id, dto);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserPrincipal me,
            @PathVariable String id
    ) {
        service.delete(me.id(), id);
        return ResponseEntity.noContent().build();
    }
}
