
package com.household.backend.exception;

import java.time.OffsetDateTime;

public record ApiErrorResponse(
        OffsetDateTime timestamp,
        int status,
        String error,
        String message
) {
    public static ApiErrorResponse of(
            int status,
            String error,
            String message
    ) {
        return new ApiErrorResponse(
                OffsetDateTime.now(),
                status,
                error,
                message
        );
    }
}
