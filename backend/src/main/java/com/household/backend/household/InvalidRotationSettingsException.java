package com.household.backend.household;

public class InvalidRotationSettingsException extends RuntimeException {
    public InvalidRotationSettingsException(String message) {
        super(message);
    }
}