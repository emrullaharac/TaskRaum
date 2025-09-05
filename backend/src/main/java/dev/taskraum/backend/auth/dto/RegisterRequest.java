package dev.taskraum.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @Email @NotBlank String email,
        @NotBlank String name,
        @NotBlank String surname,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password
) {
}
