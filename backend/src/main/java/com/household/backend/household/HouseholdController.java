package com.household.backend.household;

import com.household.backend.household.dto.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    // reorder members lis
    @PutMapping("/{householdId}/members/order")
    public List<HouseholdMemberResponse> reorderMembers(
            @PathVariable UUID householdId,
            @Valid @RequestBody ReorderMembersRequest request
    ) {
        return householdService.reorderMembers(
                householdId,
                request.memberIds()
        );
    }

    // rotation
    @PutMapping("/{householdId}/rotation-settings")
    public HouseholdResponse updateRotationSettings(
            @PathVariable UUID householdId,
            @Valid @RequestBody UpdateRotationSettingsRequest request
    ) {
        return householdService.updateRotationSettings(
                householdId,
                request.startDate(),
                request.startingMemberId()
        );
    }

    //schedueleDay list
    @GetMapping("/{householdId}/schedule")
    public List<ScheduleDayResponse> getSchedule(
            @PathVariable UUID householdId,
            @RequestParam(defaultValue = "7") int days
    ) {
        return householdService.getSchedule(householdId, days);
    }



}