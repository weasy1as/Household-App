package com.household.backend.household;
import com.household.backend.household.dto.HouseholdMemberResponse;
import com.household.backend.household.dto.HouseholdResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.household.backend.auth.SupabaseAdminService;
import com.household.backend.household.dto.HouseholdMemberResponse;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

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


}