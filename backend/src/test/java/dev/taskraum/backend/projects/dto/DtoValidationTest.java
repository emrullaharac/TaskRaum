package dev.taskraum.backend.projects.dto;

import jakarta.validation.*;
import org.junit.jupiter.api.*;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class DtoValidationTest {
    private Validator v;

    @BeforeEach void init() {
        v = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void createProjectDto_requiresTitleAndMaxes() {
        var dto = new CreateProjectDto(); // no title -> invalid
        Set<ConstraintViolation<CreateProjectDto>> violations = v.validate(dto);
        assertThat(violations).anyMatch(cv -> cv.getPropertyPath().toString().equals("title"));

        dto.setTitle("a".repeat(121));
        assertThat(v.validate(dto)).anyMatch(cv -> cv.getPropertyPath().toString().equals("title"));

        dto.setTitle("Ok"); dto.setDescription("x".repeat(2001));
        assertThat(v.validate(dto)).anyMatch(cv -> cv.getPropertyPath().toString().equals("description"));
    }

    @Test
    void updateProjectDto_optionalButBounded() {
        var dto = new UpdateProjectDto();
        assertThat(v.validate(dto)).isEmpty(); // all nulls allowed

        dto.setTitle("a".repeat(121));
        assertThat(v.validate(dto)).anyMatch(cv -> cv.getPropertyPath().toString().equals("title"));
    }
}