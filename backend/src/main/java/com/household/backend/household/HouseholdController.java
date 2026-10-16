package com.household.backend.household;

import com.household.backend.household.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/households")
public class HouseholdController {

    private final HouseholdAuthorizationService householdAuthorizationService;
    private final HouseholdService householdService;


    public HouseholdController(HouseholdAuthorizationService householdAuthorizationService, HouseholdService householdService) {
        this.householdAuthorizationService = householdAuthorizationService;
        this.householdService = householdService;
    }

    private UUID currentUserId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }

    @PostMapping
    public Household createHousehold(
            @Valid @RequestBody CreateHouseholdRequest request, @AuthenticationPrincipal Jwt jwt) {
        UUID ownerId = currentUserId(jwt);
        return householdService.createHousehold(
                request.name(),
                ownerId
        );
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteHousehold(
            @PathVariable UUID householdId,
            @AuthenticationPrincipal Jwt jwt
    ){
        UUID userId = currentUserId(jwt);

        householdAuthorizationService.requireOwner(householdId, userId);

        householdService.deleteHousehold(householdId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{householdId}")
    public HouseholdResponse getHousehold(
            @PathVariable UUID householdId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = currentUserId(jwt);

        householdAuthorizationService.requireMember(householdId, userId);

        return householdService.getHousehold(householdId);
    }
    @PostMapping("/{householdId}/members")
    public HouseholdMemberResponse addMember(
            @PathVariable UUID householdId,
            @Valid @RequestBody AddHouseholdMemberRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = currentUserId(jwt);
        householdAuthorizationService.requireMember(householdId, userId);
        return householdService.addMember(
                householdId,
                request.email()
        );
    }

    //delete household member
    @DeleteMapping("/{householdId}/members/{memberId}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable UUID householdId,
            @PathVariable UUID memberId,
            @AuthenticationPrincipal Jwt jwt
            ){

        UUID userId = currentUserId(jwt);
        householdAuthorizationService.requireMember(householdId, userId);

         householdService.deleteHouseholdMember(memberId,householdId);
        return ResponseEntity.noContent().build();

    }

    // update member by active/inactive
    @PatchMapping("/{householdId}/members/{memberId}/status")
    public HouseholdMemberResponse updateMemberStatus(
            @PathVariable UUID householdId,
            @PathVariable UUID memberId,
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateMemberStatusRequest request
    ) {
        UUID userId = currentUserId(jwt);
        householdAuthorizationService.requireMember(householdId, userId);
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
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ReorderMembersRequest request
    ) {
        UUID userId = currentUserId(jwt);
        householdAuthorizationService.requireMember(householdId, userId);

        return householdService.reorderMembers(
                householdId,
                request.memberIds()
        );
    }

    // rotation
    @PutMapping("/{householdId}/rotation-settings")
    public HouseholdResponse updateRotationSettings(
            @PathVariable UUID householdId,
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateRotationSettingsRequest request
    ) {
        UUID userId = currentUserId(jwt);
        householdAuthorizationService.requireMember(householdId, userId);
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

    // get my household
    @GetMapping("/me")
    public ResponseEntity<?> getMyHousehold(
            @AuthenticationPrincipal Jwt jwt) {
        UUID userId = currentUserId(jwt);

        return householdService.getHouseholdForUser(userId)
                .map(household -> ResponseEntity.ok(
                        Map.of("householdId", household.getId())
                ))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }



}