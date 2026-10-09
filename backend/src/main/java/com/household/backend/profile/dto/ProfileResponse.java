package com.household.backend.profile.dto;

import com.household.backend.profile.Profile;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProfileResponse(
        UUID id,
        String displayName,
        OffsetDateTime createdAt
) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getDisplayName(),
                profile.getCreatedAt()
        );
    }
}
