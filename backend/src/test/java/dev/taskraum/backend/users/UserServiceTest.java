package dev.taskraum.backend.users;

import dev.taskraum.backend.users.dto.ChangePasswordDto;
import dev.taskraum.backend.users.dto.UpdateProfileDto;
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
    void register_savesHashedAndLowerEmail() {
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
    void register_duplicateEmail_throwsConflict() {
        when(repo.findByEmail("a@b.com")).thenReturn(Optional.of(new User()));
        var ex = assertThrows(ResponseStatusException.class,
                () -> service.register("a@b.com", "N", "S", "pass12345"));
        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void authenticate_returnsDto_whenPasswordCorrect() {
        var user = User.builder().id("id1").email("a@b.com").passwordHash("HASH").build();
        when(repo.findByEmail("a@b.com")).thenReturn(Optional.of(user));
        when(encoder.matches("pass12345", "HASH")).thenReturn(true);
        var dto = service.authenticate("A@B.com", "pass12345");
        assertEquals("id1", dto.id());
    }

    @Test
    void authenticate_throwsBadCredentials_whenPasswordWrong() {
        var user = User.builder().email("a@b.com").passwordHash("HASH").build();
        when(repo.findByEmail("a@b")).thenReturn(Optional.of(user));
        when(encoder.matches("wrongPass", "HASH")).thenReturn(false);
        assertThrows(BadCredentialsException.class, () -> service.authenticate("a@b", "wrongPass"));
    }

    @Test
    void findDto_throwsNotFound_whenUserMissing() {
        when(repo.findById("x")).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class, () -> service.findDto("x"));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void update_appliesOnlyProvidedFields_andTrims() {
        var user = User.builder().id("u1").email("e@x.com")
                .name("Old").surname("OldSurname").passwordHash("HASH").build();
        when(repo.findById("u1")).thenReturn(Optional.of(user));
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var dto = new UpdateProfileDto("    New   ", null);
        var res = service.update("u1", dto);

        assertEquals("New", res.name());
        assertEquals("OldSurname", res.surname());
        verify(repo).save(argThat(saved -> saved.getName().equals("New") &&
                saved.getSurname().equals("OldSurname")));
    }

    @Test
    void update_throwsNotFound_whenUserMissing() {
        when(repo.findById("missing")).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class,
                () -> service.update("missing", new UpdateProfileDto("X", "Y")));

        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }

    @Test
    void changePassword_updatesHash_whenCurrentPasswordCorrect() {
        var user = User.builder().id("u1").email("e@x.com").passwordHash("OLDHASH").build();
        when(repo.findById("u1")).thenReturn(Optional.of(user));
        when(encoder.matches("oldPass", "OLDHASH")).thenReturn(true);
        when(encoder.encode("newPass123")).thenReturn("NEWHASH");

        service.changePassword("u1", new ChangePasswordDto("oldPass", "newPass123"));

        verify(repo).save(argThat(saved -> "NEWHASH".equals(saved.getPasswordHash())));
    }

    @Test
    void changePassword_throwsBadCredentials_whenCurrentPasswordWrong() {
        var user = User.builder().id("u1").passwordHash("OLDHASH").build();
        when(repo.findById("u1")).thenReturn(Optional.of(user));
        when(encoder.matches("wrong", "OLDHASH")).thenReturn(false);

        assertThrows(BadCredentialsException.class,
                () -> service.changePassword("u1", new ChangePasswordDto("wrong", "random123")));
    }

    @Test
    void changePassword_throwsNotFound_whenUserMissing() {
        when(repo.findById("x")).thenReturn(Optional.empty());
        var ex = assertThrows(ResponseStatusException.class,
                () -> service.changePassword("x", new ChangePasswordDto("old", "random123")));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
    }
}