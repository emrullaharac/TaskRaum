package dev.taskraum.backend.users.dto;

import jakarta.validation.constraints.Size;

public record ChangePasswordDto (String currentPassword, @Size(min = 8) String newPassword) {}
