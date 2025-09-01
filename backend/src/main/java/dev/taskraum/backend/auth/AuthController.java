package dev.taskraum.backend.auth;

import dev.taskraum.backend.auth.dto.LoginRequest;
import dev.taskraum.backend.auth.dto.RegisterRequest;
import dev.taskraum.backend.users.UserDto;
import dev.taskraum.backend.users.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService users;

    @PostMapping("/register")
    public UserDto register(@Valid @RequestBody RegisterRequest req){
        return users.register(req.email(), req.name(), req.surname(),  req.password());
    }

    @PostMapping("/login")
    public UserDto login(@Valid @RequestBody LoginRequest req) {
        return users.authenticate(req.email(), req.password());
    }

    @GetMapping("/me")
    public UserDto me(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        if (userIdHeader == null || userIdHeader.isBlank()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id (DEV)");
        }
        return users.findDto(userIdHeader);
    }
}
