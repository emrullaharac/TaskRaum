package dev.taskraum.backend.users;

public record UserDto(String id, String email, String name, String surname) {
    public static UserDto from(User u) {return new UserDto(u.getId(), u.getEmail(), u.getName(), u.getSurname());}
}
