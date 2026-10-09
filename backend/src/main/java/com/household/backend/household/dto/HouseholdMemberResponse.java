package com.household.backend.household.dto;

import com.household.backend.household.HouseholdMember;
import java.util.UUID;

public record HouseholdMemberResponse(
        UUID id,
        UUID userId,
        String role,
        Integer position,
        boolean active
) {
    public static HouseholdMemberResponse from(
            HouseholdMember member) {
        return new HouseholdMemberResponse(
                member.getId(),
                member.getUserId(),
                member.getRole(),
                member.getPosition(),
                member.isActive()
        );
    }
}

