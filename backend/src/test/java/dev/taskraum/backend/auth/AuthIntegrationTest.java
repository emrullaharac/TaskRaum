package dev.taskraum.backend.auth;

import dev.taskraum.backend.security.JwtUtil;
import dev.taskraum.backend.users.User;
import dev.taskraum.backend.users.UserRepository;
import jakarta.servlet.http.Cookie;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class AuthIntegrationTest {

    @Container static MongoDBContainer mongo = new MongoDBContainer("mongo:7");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry reg) {
        reg.add("spring.data.mongodb.uri", mongo::getReplicaSetUrl);
        reg.add("jwt.secret",
                () -> "PXogpzVEHDFTbJhNm3hZAG2hLj/9HtzdQK8fHaOnpKgDgyhMBwLkkBg/V6G7u0fG");
        reg.add("jwt.accessMinutes", () -> 5);
        reg.add("jwt.refreshDays", () -> 7);
    }

    @Autowired MockMvc mvc;
    @Autowired JwtUtil jwt;
    @Autowired UserRepository repo;

    @Test
    void registerLoginMeFlow() throws Exception {
        mvc.perform(post("/auth/register")
                .contentType(APPLICATION_JSON)
                .content("""
                    {"email":"a@b.com",
                    "name":"N",
                    "surname":"S",
                    "password":"pass12345"}"""))
                .andExpect(status().isOk());

        MvcResult login = mvc.perform(post("/auth/login")
                .contentType(APPLICATION_JSON)
                .content("""
                {
                 "email": "a@b.com",
                 "password": "pass12345"
                }
                """))
                .andExpect(status().isOk())
                .andReturn();

        var accessCookie = login.getResponse().getCookie("access");

        mvc.perform(get("/auth/me").cookie(accessCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("a@b.com"));
    }

    @Test
    void refreshFlow() throws Exception {
        var u = repo.save(User.builder().email("x@y.com").passwordHash("HASH").name("N").surname("S").build());
        var refresh = jwt.createRefreshToken(u.getId());

        mvc.perform(post("/auth/refresh").cookie(new Cookie("refresh", refresh)))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.SET_COOKIE, Matchers.containsString("access=")));
    }
}