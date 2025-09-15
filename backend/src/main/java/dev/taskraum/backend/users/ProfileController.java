package dev.taskraum.backend.users;

import dev.taskraum.backend.security.UserPrincipal;
import dev.taskraum.backend.users.dto.ChangePasswordDto;
import dev.taskraum.backend.users.dto.UpdateProfileDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class ProfileController {
    private final UserService userService;

    @PutMapping
    public UserDto update(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody @Valid UpdateProfileDto dto
            ) {
        return userService.update(me.id(), dto);
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserPrincipal me,
            @RequestBody @Valid ChangePasswordDto dto
    ) {
        userService.changePassword(me.id(), dto);
        return ResponseEntity.ok().build();
    }
}
