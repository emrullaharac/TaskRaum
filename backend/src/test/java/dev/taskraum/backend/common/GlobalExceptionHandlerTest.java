package dev.taskraum.backend.common;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {
    GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleBadCreds401() {
        var res = handler.handleBadCreds(new BadCredentialsException("Invalid password"));
        assertEquals(401, res.getStatusCode().value());
        Assertions.assertNotNull(res.getBody());
        assertEquals("Unauthorized", res.getBody().error());
    }

    @Test
    void rsePassThrough() {
        var rse = new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        var res = handler.handleRse(rse);
        assertEquals(404, res.getStatusCode().value());
        Assertions.assertNotNull(res.getBody());
        assertEquals("404 NOT_FOUND", res.getBody().error());
        assertEquals("User not found", res.getBody().message());
    }
}