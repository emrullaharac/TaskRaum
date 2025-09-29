package dev.taskraum.backend.tasks;

import dev.taskraum.backend.common.enums.TaskPriority;
import dev.taskraum.backend.common.enums.TaskStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
class TaskRepositoryTest {

    @Autowired private TaskRepository repo;

    @BeforeEach
    void setUp() {
        repo.deleteAll();
    }

    private Task task(String id, String projectId, TaskStatus status, int order) {
        return Task.builder()
                .id(id)
                .projectId(projectId)
                .title("T-" + id)
                .status(status)
                .order(order)
                .priority(TaskPriority.MEDIUM)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    void findByProjectIdAndStatusOrderByOrderAsc_returnsOrderedTasks() {
        repo.saveAll(List.of(
                task("t1","p1",TaskStatus.TODO, 300),
                task("t2","p1",TaskStatus.TODO, 100),
                task("t3","p1",TaskStatus.TODO, 200)
                ));

        List<Task> result = repo.findByProjectIdAndStatusOrderByOrderAsc("p1", TaskStatus.TODO);

        assertThat(result).extracting(Task::getId).containsExactly("t2", "t3", "t1");
    }

    @Test
    void findTopByProjectIdAndStatusOrderByOrderDesc_returnsHighestOrder() {
        repo.saveAll(List.of(
                task("t1", "p2", TaskStatus.IN_PROGRESS, 100),
                task("t2", "p2", TaskStatus.IN_PROGRESS, 500),
                task("t3", "p2", TaskStatus.IN_PROGRESS, 300)
        ));

        Task last = repo.findTopByProjectIdAndStatusOrderByOrderDesc("p2", TaskStatus.IN_PROGRESS);

        assertThat(last.getId()).isEqualTo("t2");
        assertThat(last.getOrder()).isEqualTo(500);
    }
}