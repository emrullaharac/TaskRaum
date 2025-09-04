package dev.taskraum.backend.users;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataMongoTest(properties = "spring.data.mongodb.auto-index-creation=true")
@Testcontainers(disabledWithoutDocker = true)
class UserRepositoryTest {
    @Container
    static MongoDBContainer mongo = new MongoDBContainer("mongo:7");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry reg) {
        reg.add("spring.data.mongodb.uri", mongo::getReplicaSetUrl);
    }

    @Autowired UserRepository repo;

    @Test
    void findByEmailWorks() {
        repo.save(User.builder().email("a@b.com").passwordHash("HASH").name("N").surname("S").build());
        assertTrue(repo.findByEmail("a@b.com").isPresent());
    }

    @Test
    void uniqueEmailConstraint() {
        repo.save(User.builder().email("duplicate@b.com").passwordHash("HASH").build());
        assertThrows(Exception.class, () ->
                repo.save(User.builder().email("duplicate@b.com").passwordHash("HASH2").build()));
    }
}