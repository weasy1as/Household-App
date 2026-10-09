package com.household.backend.household;
import java.util.UUID;

public class HouseholdNotFoundException
        extends RuntimeException {

    public HouseholdNotFoundException(UUID id) {
        super("Household not found: " + id);
    }
}