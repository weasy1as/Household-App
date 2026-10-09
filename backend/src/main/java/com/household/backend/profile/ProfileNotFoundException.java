package com.household.backend.profile;

import java.util.UUID;

public class ProfileNotFoundException
        extends RuntimeException {

    public ProfileNotFoundException(UUID id) {
        super("Profile not found: " + id);
    }
}