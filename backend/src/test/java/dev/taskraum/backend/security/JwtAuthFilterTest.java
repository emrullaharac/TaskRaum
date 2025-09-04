package dev.taskraum.backend.security;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthFilterTest {
    JwtUtil jwt;
    JwtAuthFilter jwtAuthFilter;

    @BeforeEach
    void setUp() {
        String secret = System.getenv().getOrDefault(
                "JWT_SECRET_TEST",
                "PXogpzVEHDFTbJhNm3hZAG2hLj/9HtzdQK8fHaOnpKgDgyhMBwLkkBg/V6G7u0fG"
        );
        jwt = new JwtUtil(secret, 5, 7);
        jwtAuthFilter = new JwtAuthFilter(jwt);
    }



    @AfterEach void clear() { SecurityContextHolder.clearContext(); }

    @Test
    void setsAuthenticationFromValidAccess() throws Exception{
        var token = jwt.createAccessToken("uid1", "u@mail.com");
        var req = new MockHttpServletRequest();
        req.setCookies(new Cookie("access", token));
        var res = new MockHttpServletResponse();
        var chain = new MockFilterChain();

        jwtAuthFilter.doFilterInternal(req, res, chain);

        var auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth);
        var p = (UserPrincipal) auth.getPrincipal();
        assertEquals("uid1", p.id());
        assertEquals("u@mail.com", p.email());
        assertTrue(auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
    }

    @Test
    void invalidTokenKeepsUnauthenticated() throws Exception{
        var req = new MockHttpServletRequest();
        req.setCookies(new Cookie("access", "bad"));
        var res = new MockHttpServletResponse();
        jwtAuthFilter.doFilterInternal(req, res, new MockFilterChain());
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }
}