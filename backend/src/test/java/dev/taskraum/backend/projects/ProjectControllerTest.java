package dev.taskraum.backend.projects;

import dev.taskraum.backend.common.enums.ProjectStatus;
import dev.taskraum.backend.projects.dto.CreateProjectDto;
import dev.taskraum.backend.projects.dto.ProjectResponse;
import dev.taskraum.backend.projects.dto.UpdateProjectDto;
import dev.taskraum.backend.security.UserPrincipal;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(ProjectController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class ProjectControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean ProjectService service;

    @BeforeEach
    void setAuth() {
        var auth = new UsernamePasswordAuthenticationToken(
                new UserPrincipal("u1","user@example.com"), null,
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
    @AfterEach void clear() { SecurityContextHolder.clearContext(); }

    @Test @WithMockUser
    void list_returnsPage() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                new UserPrincipal("u1","user@example.com"),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        var pr = ProjectResponse.builder().id("p1").ownerId("u1").title("T")
                .status(ProjectStatus.ACTIVE).createdAt(Instant.now()).updatedAt(Instant.now()).build();
        Mockito.when(service.list(eq("u1"), eq(ProjectStatus.ACTIVE), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(pr)));

        mvc.perform(get("/api/projects")
                .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value("p1"));
    }

    @Test @WithMockUser
    void create_validateAndReturns201()  throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                new UserPrincipal("u1","user@example.com"),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        var body = """
                {"title":"New project","description":"desc"}
                """;
        var pr = ProjectResponse.builder()
                .id("p2")
                .ownerId("u1")
                .title("New Project")
                .status(ProjectStatus.ACTIVE)
                .build();
        Mockito.when(service.create(eq("u1"), any(CreateProjectDto.class))).thenReturn(pr);

        mvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .with(authentication(auth)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Project"));
    }

    @Test
    @WithMockUser
    void update_forwardsDto() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                new UserPrincipal("u1", "user@example.com"),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        var pr = ProjectResponse.builder()
                .id("p1")
                .ownerId("u1")
                .title("New")
                .status(ProjectStatus.ACTIVE)
                .build();
        Mockito.when(service.update(eq("u1"), eq("p1"), any(UpdateProjectDto.class))).thenReturn(pr);

        mvc.perform(put("/api/projects/p1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"New\"}")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New"));
    }

    @Test
    @WithMockUser
    void delete_withoutForce_returns409() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                new UserPrincipal("u1", "user@example.com"),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        mvc.perform(delete("/api/projects/p1")
                        .with(authentication(auth)))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser
    void delete_withForce_callsServiceAndReturns204() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                new UserPrincipal("u1", "user@example.com"),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
        mvc.perform(delete("/api/projects/p1")
                        .param("force", "true")
                        .with(authentication(auth)))
                .andExpect(status().isNoContent());
    }
}