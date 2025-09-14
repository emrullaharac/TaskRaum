package dev.taskraum.backend.tasks;

import dev.taskraum.backend.common.enums.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByProjectIdAndStatusOrderByOrderAsc(String projectId, TaskStatus status);
    Task findTopByProjectIdAndStatusOrderByOrderDesc(String projectId, TaskStatus status);
    void deleteByProjectId(String projectId);
}
