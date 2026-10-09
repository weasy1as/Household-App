package com.household.backend.household;

import com.household.backend.household.dto.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @GetMapping("/{id}")
    public HouseholdResponse getHousehold(@PathVariable UUID id) {
        return householdService.getHousehold(id);
    }


    @PostMapping("/{householdId}/members")
    public HouseholdMemberResponse addMember(
            @PathVariable UUID householdId,
            @Valid @RequestBody AddHouseholdMemberRequest request
    ) {
        return householdService.addMember(
                householdId,
                request.email()
        );
    }

    // update member by active/inactive


    @PatchMapping("/{householdId}/members/{memberId}/status")
    public HouseholdMemberResponse updateMemberStatus(
            @PathVariable UUID householdId,
            @PathVariable UUID memberId,
            @Valid @RequestBody UpdateMemberStatusRequest request
    ) {
        return householdService.updateMemberStatus(
                householdId,
                memberId,
                request.active()
        );
    }


}