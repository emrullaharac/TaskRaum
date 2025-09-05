package dev.taskraum.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    private final String ACCESS = "access";
    private final String REFRESH = "refresh";

    private final SecretKey key;
    private final long accessMs;
    private final long refreshMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.accessMinutes}") long accessMinutes,
            @Value("${jwt.refreshDays}") long refreshDays
    ) {
        SecretKey k;
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            k = Keys.hmacShaKeyFor(decoded);
        } catch (IllegalArgumentException e) {
            k = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
        this.key = k;
        this.accessMs = Duration.ofMinutes(accessMinutes).toMillis();
        this.refreshMs = Duration.ofDays(refreshDays).toMillis();
    }

    public String createAccessToken(String userId, String email) {
        var now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(userId)
                .claims(Map.of("email", email, "typ", ACCESS))
                .issuedAt(new Date(now))
                .expiration(new Date(now + accessMs))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public String createRefreshToken(String userId) {
        var now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(userId)
                .claims(Map.of("typ", REFRESH))
                .issuedAt(new Date(now))
                .expiration(new Date(now + refreshMs))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public Claims parse(String token) throws JwtException {
        // throws JwtException on invalid/expired tokens
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public ResponseCookie accessCookie(String token) {
        return ResponseCookie.from(ACCESS, token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofMillis(accessMs))
                .build();
    }

    public ResponseCookie refreshCookie(String token) {
        return ResponseCookie.from(REFRESH, token)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/auth")
                .maxAge(Duration.ofMillis(refreshMs))
                .build();
    }

    public ResponseCookie clearAccessCookie() {
        return ResponseCookie.from(ACCESS, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
    }

    public ResponseCookie clearRefreshCookie() {
        return ResponseCookie.from(REFRESH, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/auth")
                .maxAge(0)
                .build();
    }
}
