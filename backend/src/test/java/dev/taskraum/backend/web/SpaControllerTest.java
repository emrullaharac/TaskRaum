package dev.taskraum.backend.web;

import dev.taskraum.backend.security.JwtAuthFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SpaController.class)
@AutoConfigureMockMvc(addFilters = false) // ignore security filters in this slice test
@TestPropertySource(properties = "spring.mvc.pathmatch.matching-strategy=ant_path_matcher")
class SpaControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean JwtAuthFilter jwtAuthFilter;

    @Test
    void topLevelNonDot_forwards() throws Exception {
        mvc.perform(get("/login"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

    @Test
    void nestedNonDot_forwards() throws Exception {
        mvc.perform(get("/app/tasks/123"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

    @Test
    void asset_withDot_notHandled() throws Exception {
        mvc.perform(get("/assets/app.js"))
                .andExpect(status().isNotFound());
    }

    @Test
    void api_like_notHandled() throws Exception {
        mvc.perform(get("/auth/login"))
                .andExpect(status().isNotFound());
    }
}
