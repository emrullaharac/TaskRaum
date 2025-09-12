package dev.taskraum.backend.projects;

import dev.taskraum.backend.common.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    Page<Project> findByOwnerIdAndStatus(String ownerId, ProjectStatus status, Pageable pageable);
    Optional<Project> findByIdAndOwnerId(String id, String ownerId);
}
