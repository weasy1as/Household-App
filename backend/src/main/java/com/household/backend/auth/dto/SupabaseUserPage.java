
package com.household.backend.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SupabaseUserPage(
        List<SupabaseUser> users,
        @JsonProperty("next_page") String nextPage
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SupabaseUser(
            UUID id,
            String email
    ) {}
}
