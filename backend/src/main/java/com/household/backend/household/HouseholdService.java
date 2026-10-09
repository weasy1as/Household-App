package com.household.backend.household;
import com.household.backend.household.dto.HouseholdMemberResponse;
import com.household.backend.household.dto.HouseholdResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.household.backend.auth.SupabaseAdminService;
import com.household.backend.household.dto.HouseholdMemberResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final SupabaseAdminService supabaseAdminService;

    public HouseholdService(
            HouseholdRepository householdRepository,
            HouseholdMemberRepository householdMemberRepository,
            SupabaseAdminService supabaseAdminService
    ) {
        this.householdRepository = householdRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.supabaseAdminService = supabaseAdminService;
    }

    @Transactional
    public Household createHousehold(
            String name, UUID ownerId) {

        if (householdRepository.findByOwnerId(ownerId).isPresent()) {
            throw new IllegalStateException(
                    "This user already owns a household");
        }

        Household household = new Household(name,ownerId);
        return householdRepository.save(household);
    }

    @Transactional(readOnly = true)
    public HouseholdResponse getHousehold(UUID householdId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() ->
                        new HouseholdNotFoundException(householdId));

        var members = householdMemberRepository
                .findByHouseholdIdOrderByPositionAsc(householdId)
                .stream()
                .map(HouseholdMemberResponse::from)
                .toList();

        return HouseholdResponse.from(household, members);
    }



    @Transactional
    public HouseholdMemberResponse addMember(UUID householdId, String email) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() ->
                        new HouseholdNotFoundException(householdId));

        UUID userId = supabaseAdminService.findUserIdByEmail(email);

        if (householdMemberRepository.findByUserId(userId).isPresent()) {
            throw new UserAlreadyInHouseholdException();
        }

        List<HouseholdMember> members =
                householdMemberRepository
                        .findByHouseholdIdOrderByPositionAsc(householdId);

        int nextPosition = members.stream()
                .mapToInt(HouseholdMember::getPosition)
                .max()
                .orElse(0) + 1;

        HouseholdMember member = new HouseholdMember(
                householdId,
                userId,
                "member",
                nextPosition,
                true
        );

        HouseholdMember saved = householdMemberRepository.save(member);

        return HouseholdMemberResponse.from(saved);
    }

    // update member active/inactive


    @Transactional
    public HouseholdMemberResponse updateMemberStatus(
            UUID householdId,
            UUID memberId,
            boolean active
    ) {
        HouseholdMember member = householdMemberRepository
                .findByIdAndHouseholdId(memberId, householdId)
                .orElseThrow(() ->
                        new HouseholdMemberNotFoundException(
                                memberId, householdId));

        member.setActive(active);

        HouseholdMember saved = householdMemberRepository.save(member);

        return HouseholdMemberResponse.from(saved);
    }

    // reorder members list

    @Transactional
    public List<HouseholdMemberResponse> reorderMembers(
            UUID householdId,
            List<UUID> memberIds
    ) {
        // Ensure the household exists
        householdRepository.findById(householdId)
                .orElseThrow(() ->
                        new HouseholdNotFoundException(householdId));

        List<HouseholdMember> members =
                householdMemberRepository
                        .findByHouseholdIdOrderByPositionAsc(householdId);

        // Reject duplicate IDs
        if (new HashSet<>(memberIds).size() != memberIds.size()) {
            throw new InvalidMemberOrderException(
                    "The member list contains duplicate IDs");
        }

        // Require every household member exactly once
        Set<UUID> existingIds = members.stream()
                .map(HouseholdMember::getId)
                .collect(Collectors.toSet());

        if (memberIds.size() != members.size()
                || !existingIds.equals(new HashSet<>(memberIds))) {
            throw new InvalidMemberOrderException(
                    "Provide every member of this household exactly once");
        }

        // Move positions above the current range to avoid unique conflicts
        int nextPosition = members.stream()
                .mapToInt(HouseholdMember::getPosition)
                .max()
                .orElse(0) + 1;

        for (HouseholdMember member : members) {
            member.setPosition(nextPosition++);
        }

        householdMemberRepository.saveAllAndFlush(members);

        // Apply the requested order, starting at position 1
        Map<UUID, HouseholdMember> membersById = members.stream()
                .collect(Collectors.toMap(
                        HouseholdMember::getId,
                        Function.identity()
                ));

        List<HouseholdMember> reordered = new ArrayList<>();

        for (int i = 0; i < memberIds.size(); i++) {
            HouseholdMember member = membersById.get(memberIds.get(i));
            member.setPosition(i + 1);
            reordered.add(member);
        }

        householdMemberRepository.saveAllAndFlush(reordered);

        return reordered.stream()
                .map(HouseholdMemberResponse::from)
                .toList();
    }


}