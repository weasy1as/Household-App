package com.household.backend.household.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AddHouseholdMemberRequest(
        @NotBlank
        @Email
        String email
) {}