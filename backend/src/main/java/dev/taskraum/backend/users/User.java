package dev.taskraum.backend.users;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id private String id;
    @Indexed(unique = true) private String email;
    private String passwordHash;
    private String name;
    private String surname;
    @Builder.Default private List<String> roles = List.of("USER");

}
