package dev.taskraum.backend.projects;

import dev.taskraum.backend.common.enums.ProjectStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.domain.PageRequest;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
class ProjectRepositoryTest {

    @Autowired ProjectRepository repo;

    @BeforeEach
    void setUp() {
        repo.deleteAll();
    }

    @Test
    void queriesWorkAsExpected() {
        var p1 = Project.builder().ownerId("u1").title("A").status(ProjectStatus.ACTIVE).build();
        var p2 = Project.builder().ownerId("u1").title("B").status(ProjectStatus.ARCHIVED).build();
        var p3 = Project.builder().ownerId("u2").title("C").status(ProjectStatus.ACTIVE).build();
        repo.save(p1); repo.save(p2); repo.save(p3);

        var page = repo.findByOwnerIdAndStatus("u1", ProjectStatus.ACTIVE, PageRequest.of(0, 10));
        assertThat(page.getContent()).extracting(Project::getTitle).containsExactly("A");

        var found = repo.findByIdAndOwnerId(p1.getId(), "u1");
        assertThat(found).isPresent();
        assertThat(repo.findByIdAndOwnerId(p1.getId(), "uX")).isEmpty();
    }
}