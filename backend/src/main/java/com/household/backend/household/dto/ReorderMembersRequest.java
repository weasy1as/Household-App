package com.household.backend.household.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record ReorderMembersRequest(
        @NotEmpty List<@NotNull UUID> memberIds
) {}