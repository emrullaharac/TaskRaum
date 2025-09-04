package dev.taskraum.backend.users;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository repo;
    @Mock PasswordEncoder encoder;
    @InjectMocks UserService service;

    @Test
    void registerSavesHashedAndLowerEmail() {
        when(repo.findByEmail(anyString())).thenReturn(Optional.empty());
        when(encoder.encode("pass12345")).thenReturn("HASH");
        when(repo.save(any())).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId("id1"); return u;
        });

        var dto = service.register("A@B.com", "N", "S", "pass12345");

        assertEquals("a@b.com", dto.email());
        verify(repo).save(argThat(u ->
                u.getPasswordHash().equals("HASH") && u.getEmail().equals("a@b.com")));
    }

    @Test
    void registerDuplicateEmailThrowsConflict() {
        when(repo.findByEmail("a@b.com")).thenReturn(Optional.of(new User()));
        var ex = assertThrows(ResponseStatusException.class,
                () -> service.register("a@b.com", "N", "S", "pass12345"));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void authenticateOk() {
        var user = User.builder().id("id1").email("a@b.com").passwordHash("HASH").build();
        when(repo.findByEmail("a@b.com")).thenReturn(Optional.of(user));
        when(encoder.matches("pass12345", "HASH")).thenReturn(true);
        var dto = service.authenticate("A@B.com", "pass12345");
        assertEquals("id1", dto.id());
    }

    @Test
    void authenticateWrongPassword() {
        var user = User.builder().email("a@b.com").passwordHash("HASH").build();
        when(repo.findByEmail("a@b")).thenReturn(Optional.of(user));
        when(encoder.matches("wrongPass", "HASH")).thenReturn(false);
        assertThrows(BadCredentialsException.class, () -> service.authenticate("a@b", "wrongPass"));
    }

    @Test
    void findDtoMissingThrows404() {
        when(repo.findById("x")).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class, () -> service.findDto("x"));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }
}