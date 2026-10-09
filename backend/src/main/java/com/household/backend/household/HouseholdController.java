package com.household.backend.household;

import com.household.backend.household.dto.CreateHouseholdRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/households")
public class HouseholdController {

    private final HouseholdService householdService;

    public HouseholdController(HouseholdService householdService) {
        this.householdService = householdService;
    }

    @PostMapping
    public Household createHousehold(
            @Valid @RequestBody CreateHouseholdRequest request) {

        return householdService.createHousehold(
                request.name(),
                java.util.UUID.fromString(request.ownerId())
        );
    }
}