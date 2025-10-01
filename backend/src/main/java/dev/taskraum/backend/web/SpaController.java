package dev.taskraum.backend.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // Top-level: first segment must NOT be auth|api|assets; no dots
    @GetMapping("/{p1:^(?!auth|api|assets)[^.]*}")
    public String forwardTop() {
        return "forward:/index.html";
    }

    // Nested: same first-segment rule; remaining segments no dots
    @GetMapping("/{p1:^(?!auth|api|assets)[^.]*}/**/{path:[^.]*}")
    public String forwardNested() {
        return "forward:/index.html";
    }
}