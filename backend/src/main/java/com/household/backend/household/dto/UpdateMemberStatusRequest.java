
package com.household.backend.household.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateMemberStatusRequest(
        @NotNull Boolean active
) {}
