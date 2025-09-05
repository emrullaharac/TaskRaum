package dev.taskraum.backend.auth;

import dev.taskraum.backend.auth.dto.LoginRequest;
import dev.taskraum.backend.auth.dto.RegisterRequest;
import dev.taskraum.backend.security.JwtUtil;
import dev.taskraum.backend.security.UserPrincipal;
import dev.taskraum.backend.users.UserDto;
import dev.taskraum.backend.users.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService users;
    private final JwtUtil jwt;

    @PostMapping("/register")
    public UserDto register(@Valid @RequestBody RegisterRequest req){
        return users.register(req.email(), req.name(), req.surname(),  req.password());
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@Valid @RequestBody LoginRequest req) {
        var user = users.authenticate(req.email(), req.password());
        var access = jwt.createAccessToken(user.id(), user.email());
        var refresh = jwt.createRefreshToken(user.id());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwt.accessCookie(access).toString())
                .header(HttpHeaders.SET_COOKIE, jwt.refreshCookie(refresh).toString())
                .body(user);
    }

    @GetMapping("/me")
    public UserDto me(Authentication auth) {
        if (auth == null || auth.getAuthorities() == null || auth.getAuthorities().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        var p = (UserPrincipal) auth.getPrincipal();
        return users.findDto(p.id());
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserDto> refresh(@CookieValue(name="refresh", required = false) String refreshToken) {
        if (refreshToken == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
        var claims = jwt.parse(refreshToken);
        if (!"refresh".equals(claims.get("typ"))) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        var user = users.findDto(claims.getSubject());
        var newAccess = jwt.createAccessToken(user.id(), user.email());
        var newRefresh = jwt.createRefreshToken(user.id());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwt.accessCookie(newAccess).toString())
                .header(HttpHeaders.SET_COOKIE, jwt.refreshCookie(newRefresh).toString())
                .body(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwt.clearAccessCookie().toString())
                .header(HttpHeaders.SET_COOKIE, jwt.clearRefreshCookie().toString())
                .build();
    }
}
