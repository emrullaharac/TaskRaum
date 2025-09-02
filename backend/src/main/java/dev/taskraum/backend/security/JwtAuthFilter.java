package dev.taskraum.backend.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwt;

    public JwtAuthFilter(JwtUtil jwt) {
        this.jwt = jwt;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
        throws ServletException, IOException {
        try {
            String token = cookie(req, "access");
            if (token != null && !token.isBlank()) {
                var claims = jwt.parse(token);
                if ("access".equals(claims.get("typ"))) {
                    var userId = claims.getSubject();
                    var email = (String) claims.get("email");
                    var auth = new UsernamePasswordAuthenticationToken(
                            new UserPrincipal(userId, email),
                            null,
                            List.of(new SimpleGrantedAuthority("ROLE_USER")));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (JwtException ignored) {
            // ignored/expired access token -> stay unauthenticated;
            SecurityContextHolder.clearContext();
        }
        chain.doFilter(req, res);
    }

    private String cookie(HttpServletRequest req, String name) {
        var cookies =  req.getCookies();
        if (cookies == null) return null;

        for (Cookie c : cookies) {
            if (name.equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }
}
