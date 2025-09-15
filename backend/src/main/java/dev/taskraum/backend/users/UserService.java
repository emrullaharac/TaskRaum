package dev.taskraum.backend.users;

import dev.taskraum.backend.users.dto.ChangePasswordDto;
import dev.taskraum.backend.users.dto.UpdateProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserDto register(String email, String name, String surname, String rawPassword) {
        repo.findByEmail(email)
                .ifPresent(user -> {
                    throw new ResponseStatusException(CONFLICT, "Email already registered");
                });
        var user = User.builder()
                .email(email.trim().toLowerCase())
                .name(name)
                .surname(surname)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .build();
        return UserDto.from(repo.save(user));
    }

    public UserDto authenticate(String email, String rawPassword) {
        var user = repo.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid password");
        }
        return UserDto.from(user);
    }

    public UserDto findDto(String id) {
        return repo.findById(id).map(UserDto::from)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
    }

    public UserDto update(String id, UpdateProfileDto dto) {
        var user = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        if (dto.name() != null) user.setName(dto.name().trim());
        if (dto.surname() != null) user.setSurname(dto.surname().trim());
        return UserDto.from(repo.save(user));
    }

    public void changePassword(String id, ChangePasswordDto dto) {
        var user = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));
        if (!passwordEncoder.matches(dto.currentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid password");
        }
        user.setPasswordHash(passwordEncoder.encode(dto.currentPassword()));
        repo.save(user);
    }
}
