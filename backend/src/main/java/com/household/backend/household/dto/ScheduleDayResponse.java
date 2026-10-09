
package com.household.backend.household.dto;

import java.time.LocalDate;
import java.util.UUID;

public record ScheduleDayResponse(
        LocalDate date,
        UUID memberId,
        UUID userId,
        String displayName,
        int position
) {}
