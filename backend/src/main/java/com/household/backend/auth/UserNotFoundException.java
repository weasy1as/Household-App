package com.household.backend.auth;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String email) {
        super("No registered user found for that email");
    }
}