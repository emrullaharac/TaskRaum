package dev.taskraum.backend.auth;

import dev.taskraum.backend.security.JwtUtil;
import dev.taskraum.backend.users.UserDto;
import dev.taskraum.backend.users.UserService;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired MockMvc mvc;
    @MockitoBean
    UserService users;
    @MockitoBean JwtUtil jwt;

    @Test
    void registerOk() throws Exception {
        var dto = new UserDto("id1", "a@b.com", "N", "S");
        when(users.register(any(), any(), any(), any())).thenReturn(dto);

        mvc.perform(post("/auth/register")
                .contentType(APPLICATION_JSON)
                .content("""
                    {"email":"a@b.com","name":"N","surname":"S","password":"pass12345"}
                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("a@b.com"));
    }

    @Test
    void loginSetsCookies() throws Exception {
        var dto = new UserDto("id1", "a@b.com", "N", "S");
        when(users.authenticate("a@b.com", "pass12345")).thenReturn(dto);

        when(jwt.createAccessToken("id1", "a@b.com")).thenReturn("AT");
        when(jwt.createRefreshToken("id1")).thenReturn("RT");

        when(jwt.accessCookie("AT"))
                .thenReturn(ResponseCookie.from("access","AT").path("/").httpOnly(true).build());
        when(jwt.refreshCookie("RT"))
                .thenReturn(ResponseCookie.from("refresh","RT").path("/auth").httpOnly(true).build());

        mvc.perform(post("/auth/login")
                .contentType(APPLICATION_JSON)
                .content("""
                        {"email":"a@b.com","password":"pass12345"}
                        """))
                .andExpect(status().isOk())
                .andExpect(header().stringValues(HttpHeaders.SET_COOKIE, Matchers.hasItem(Matchers.containsString("access="))))
                .andExpect(header().stringValues(HttpHeaders.SET_COOKIE, Matchers.hasItem(Matchers.containsString("refresh="))));
    }

    @Test
    void registerValidationError() throws Exception {
        mvc.perform(post("/auth/register")
                .contentType(APPLICATION_JSON)
                .content("""
                        {"email":"bad","name":"N","surname":"S","password":"short"}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("ValidationError"));
    }
}