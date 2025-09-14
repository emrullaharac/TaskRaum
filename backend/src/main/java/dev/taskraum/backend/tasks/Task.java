package dev.taskraum.backend.tasks;

import dev.taskraum.backend.common.enums.TaskPriority;
import dev.taskraum.backend.common.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("tasks")
@Data @Builder @AllArgsConstructor @NoArgsConstructor
@CompoundIndexes({
    @CompoundIndex(name = "proj_status_order_idx", def = "{'projectId':1,'status':1,'order':1}")
})
public class Task {
    @Id private String id;

    @Indexed private String projectId;

    private String title;
    private String description;

    @Indexed private TaskStatus status;
    @Indexed private Integer order;
    private TaskPriority priority;

    private Instant dueDate;
    private String assigneeId;

    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
}
