package dev.taskraum.backend.projects;

import dev.taskraum.backend.common.enums.ProjectStatus;
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

@Document("projects")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@CompoundIndexes({
        @CompoundIndex(name = "owner_status_idx", def = "{'ownerId':1,'status':1}")
})
public class Project {
    @Id private String id;

    @Indexed private String ownerId;

    @Indexed private String title;

    private String description;

    @Indexed private ProjectStatus status = ProjectStatus.ACTIVE;

    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
}
