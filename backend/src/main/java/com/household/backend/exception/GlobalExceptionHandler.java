package com.household.backend.exception;
import com.household.backend.household.HouseholdNotFoundException;
import com.household.backend.profile.ProfileNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            HouseholdNotFoundException.class,
            ProfileNotFoundException.class
    })
    public ResponseEntity<Map<String, String>> handleNotFound(
            RuntimeException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", exception.getMessage()));
    }
}
