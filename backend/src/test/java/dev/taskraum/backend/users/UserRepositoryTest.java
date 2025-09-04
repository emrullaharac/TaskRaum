package dev.taskraum.backend.users;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataMongoTest
class UserRepositoryTest {

    @Autowired UserRepository repo;

    @BeforeEach
    void setUp() {
        repo.deleteAll();
    }

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