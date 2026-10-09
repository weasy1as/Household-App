package com.household.backend.household.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateHouseholdRequest(
        @NotBlank
        @Size(max = 100)
        String name,

        @NotBlank
        String ownerId
) {
}