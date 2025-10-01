package dev.taskraum.backend.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    // Top-level SPA routes without dots
    @GetMapping("/{path:[^.]*}")
    public String forwardTop() {
        return "forward:/index.html";
    }

    // Nested SPA routes without dots
    @GetMapping("/**/{path:[^.]*}")
    public String forwardNested() {
        return "forward:/index.html";
    }
}