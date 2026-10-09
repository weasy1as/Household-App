package com.household.backend.household.dto;

import com.household.backend.household.Household;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record HouseholdResponse(
        UUID id,
        String name,
        UUID ownerId,
        LocalDate rotationStartDate,
        UUID rotationStartMemberId,
        List<HouseholdMemberResponse> members
) {
    public static HouseholdResponse from(
            Household household,
            List<HouseholdMemberResponse> members) {
        return new HouseholdResponse(
                household.getId(),
                household.getName(),
                household.getOwnerId(),
                household.getRotationStartDate(),
                household.getRotationStartMemberId(),
                members
        );
    }
}
