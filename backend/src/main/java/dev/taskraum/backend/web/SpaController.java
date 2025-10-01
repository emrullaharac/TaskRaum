package dev.taskraum.backend.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SpaController {

    // Top-level: first segment must NOT be auth|api|assets; no dots
    @SuppressWarnings("java:S1172") // Sonar: unused parameter (intentional)
    @GetMapping("/{p1:^(?!auth|api|assets)[^.]*}")
    public String forwardTop(@PathVariable("p1") String p1) {
        return "forward:/index.html";
    }

    // Nested: same first-segment rule; remaining segments no dots
    @SuppressWarnings("java:S1172") // Sonar: unused parameter (intentional)
    @GetMapping("/{p1:^(?!auth|api|assets)[^.]*}/**/{path:[^.]*}")
    public String forwardNested(
            @PathVariable("p1") String p1,
            @PathVariable("path") String path
    ) {
        return "forward:/index.html";
    }
}