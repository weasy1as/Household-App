
package com.household.backend.household.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record UpdateRotationSettingsRequest(
        @NotNull LocalDate startDate,
        @NotNull UUID startingMemberId
) {}
