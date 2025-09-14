package dev.taskraum.backend.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        var msg = ex.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        return ResponseEntity.badRequest().body(ApiError.of("ValidationError", msg, 400));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCreds(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiError.of("Unauthorized", ex.getMessage(), 401));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleRse(ResponseStatusException ex) {
        var status = ex.getStatusCode().value();
        var reason = ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString();
        return ResponseEntity.status(status)
                .body(ApiError.of(ex.getStatusCode().toString(), reason, status));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex) {
        String code = ex.getMessage();
        HttpStatus status = (code != null && code.endsWith("_NOT_FOUND")) ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
        String error = (status == HttpStatus.NOT_FOUND) ? "NotFound" : "BadRequest";
        String message = switch (code) {
            case "PROJECT_NOT_FOUND" -> "Project not found";
            case "TASK_NOT_FOUND"    -> "Task not found";
            default                  -> code != null ? code : "Bad request.";
        };
        return ResponseEntity.status(status).body(ApiError.of(error, message, status.value()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleIllegalState(IllegalStateException ex) {
        // Read-only / Conflict
        HttpStatus status = HttpStatus.CONFLICT;
        return ResponseEntity.status(status)
                .body(ApiError.of("Conflict", ex.getMessage(), status.value()));
    }
}
