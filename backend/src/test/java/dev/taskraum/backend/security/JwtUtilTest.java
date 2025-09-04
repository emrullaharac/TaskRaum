package dev.taskraum.backend.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtUtilTest {
    JwtUtil jwt = new JwtUtil("H2nBdK+hSN07HIY4ZxvLZWc/xeH+68STSkeFJVJSB7rNpplTmkqY5/gafFtf6xDh", 5, 7);

    @Test
    void createAccessWithClaims() {
        String token = jwt.createAccessToken("uid1", "u@mail.com");
        var claims = jwt.parse(token);

        assertEquals("uid1", claims.getSubject());
        assertEquals("u@mail.com", claims.get("email"));
        assertEquals("access", claims.get("typ"));
    }

    @Test
    void createsRefreshWithTyp() {
        String token = jwt.createRefreshToken("uid1");
        var claims = jwt.parse(token);
        assertEquals("refresh", claims.get("typ"));
    }

    @Test
    void parseInvalidThrows() {
        assertThrows(io.jsonwebtoken.JwtException.class, () -> jwt.parse("invalid"));
    }

    @Test
    void cookiesHaveExpectedProps() {
        var ac = jwt.accessCookie("tok");
        assertTrue(ac.isHttpOnly());
        assertEquals("/", ac.getPath());
        assertEquals("Lax", ac.getSameSite());
        assertFalse(ac.getMaxAge().toString().isBlank());
        var clr = jwt.clearAccessCookie();
        assertTrue(clr.getMaxAge().isZero());
    }

}