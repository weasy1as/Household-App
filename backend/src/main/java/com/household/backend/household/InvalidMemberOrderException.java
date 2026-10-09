package com.household.backend.household;

public class InvalidMemberOrderException extends RuntimeException {
    public InvalidMemberOrderException(String message) {
        super(message);
    }
}