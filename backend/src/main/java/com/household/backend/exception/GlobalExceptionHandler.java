
package com.household.backend.exception;

import com.household.backend.auth.UserNotFoundException;
import com.household.backend.household.HouseholdNotFoundException;
import com.household.backend.household.UserAlreadyInHouseholdException;
import com.household.backend.profile.ProfileNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            HouseholdNotFoundException.class,
            ProfileNotFoundException.class,
            UserNotFoundException.class
    })
    public ResponseEntity<ApiErrorResponse> handleNotFound(
            RuntimeException exception) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiErrorResponse.of(
                        404,
                        "Not Found",
                        exception.getMessage()
                ));
    }

    @ExceptionHandler(UserAlreadyInHouseholdException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateMembership(
            UserAlreadyInHouseholdException exception) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiErrorResponse.of(
                        409,
                        "Conflict",
                        exception.getMessage()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
            MethodArgumentNotValidException exception) {

        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": "
                        + error.getDefaultMessage())
                .findFirst()
                .orElse("Request validation failed");

        return ResponseEntity.badRequest()
                .body(ApiErrorResponse.of(
                        400,
                        "Bad Request",
                        message
                ));
    }
}
