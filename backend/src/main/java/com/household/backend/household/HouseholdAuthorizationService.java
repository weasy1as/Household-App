package com.household.backend.household;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HouseholdAuthorizationService {

    private final HouseholdMemberRepository householdMemberRepository;
    private final HouseholdRepository householdRepository;

    public void requireMember(UUID householdId, UUID userId) {
        boolean isMember = householdMemberRepository
                .findByUserId(userId)
                .filter(member ->
                        member.getHouseholdId().equals(householdId))
                .filter(HouseholdMember::isActive)
                .isPresent();

        if (!isMember) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not an active member of this household."
            );
        }
    }

    public void requireOwner(UUID householdId, UUID userId) {
        requireMember(householdId, userId);

        boolean isOwner = householdRepository
                .findById(householdId)
                .filter(household ->
                        household.getOwnerId().equals(userId))
                .isPresent();

        if (!isOwner) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only the household owner can perform this action."
            );
        }
    }
}
