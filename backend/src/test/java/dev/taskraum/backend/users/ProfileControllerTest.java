package dev.taskraum.backend.users;

import dev.taskraum.backend.security.UserPrincipal;
import dev.taskraum.backend.users.dto.ChangePasswordDto;
import dev.taskraum.backend.users.dto.UpdateProfileDto;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = ProfileController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class ProfileControllerTest {
    @Autowired MockMvc mvc;
    @MockitoBean UserService users;

    @BeforeEach
    void setAuth() {
        var auth = new UsernamePasswordAuthenticationToken(new UserPrincipal("u1", "me@mail.com"),
                null);
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach void clear() {SecurityContextHolder.clearContext();}

    @Test
    void update_ok_returnsDto() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        when(users.update(eq("u1"), any(UpdateProfileDto.class)))
                .thenReturn(new UserDto("u1", "me@mail.com", "New", "S"));

        mvc.perform(put("/api/me")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"New","surname":"S"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("u1"))
                .andExpect(jsonPath("$.name").value("New"));
        verify(users).update(eq("u1"), any(UpdateProfileDto.class));
    }

    @Test
    void changePassword_ok_returns200() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        mvc.perform(put("/api/me/password")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"currentPassword":"oldPass","newPassword":"newPass123"}
                                """))
                .andExpect(status().isOk());

        verify(users).changePassword("u1",
                new ChangePasswordDto("oldPass", "newPass123"));
    }

    @Test
    void changePassword_validationError_whenNewTooShort() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        mvc.perform(put("/api/me/password")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"currentPassword":"old","newPassword":"short"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("ValidationError"));
    }
}