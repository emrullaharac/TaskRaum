package dev.taskraum.backend.tasks;


import dev.taskraum.backend.common.enums.TaskStatus;
import dev.taskraum.backend.security.UserPrincipal;
import dev.taskraum.backend.tasks.dto.CreateTaskDto;
import dev.taskraum.backend.tasks.dto.TaskResponse;
import dev.taskraum.backend.tasks.dto.UpdateTaskDto;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerTest {

    @Autowired private MockMvc mvc;
    @MockitoBean TaskService service;

    @BeforeEach
    void setAuth() {
        var auth = new UsernamePasswordAuthenticationToken(
                new UserPrincipal("u1", "user@example.com"),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_USER")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @AfterEach void clear() {SecurityContextHolder.clearContext();}

    private TaskResponse resp(String id) {
        return TaskResponse.builder()
                .id(id).projectId("p1").title("T").status(TaskStatus.TODO)
                .order(100).createdAt(Instant.now()).updatedAt(Instant.now()).build();
    }

    @Test
    void list_ok_returnsArray() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        when(service.list("u1", "p1", TaskStatus.TODO))
                .thenReturn(List.of(resp("t1"), resp("t2")));

        mvc.perform(get("/api/projects/{pid}/tasks", "p1")
                        .param("status", "TODO")
                .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("t1"))
                .andExpect(jsonPath("$[1].id").value("t2"));
    }

    @Test
    void list_missingStatus_returns400() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        mvc.perform(get("/api/projects/{pid}/tasks", "p1")
                .with(authentication(auth)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_valid_returns201() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        when(service.create(eq("u1"), eq("p1"), any(CreateTaskDto.class)))
                .thenReturn(resp("t1"));

        var body = """
                 {"title":"New task","description":"d"}
                """;

        mvc.perform(post("/api/projects/{pid}/tasks", "p1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .with(authentication(auth)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("t1"));
    }

    @Test
    void create_invalidTitle_returns400() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var body = """
                {"title":"  "}
                """;
        mvc.perform(post("/api/projects/{pid}/tasks", "p1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .with(authentication(auth)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_ok_returns200() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        when(service.update(eq("u1"), eq("t1"), any(UpdateTaskDto.class)))
                .thenReturn(resp("t1"));

        var body = """
                {"title":"Renamed"}
                """;

        mvc.perform(put("/api/tasks/{id}", "t1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("t1"));
    }

    @Test
    void update_invalidTitle_returns400() throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var body = """
                {"title": ""}
                """;
        mvc.perform(put("/api/tasks/{id}", "t1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .with(authentication(auth)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void delete_noContent()  throws Exception {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        mvc.perform(delete("/api/tasks/{id}", "t1")
                .with(authentication(auth)))
                .andExpect(status().isNoContent());
        verify(service).delete("u1", "t1");
    }
}