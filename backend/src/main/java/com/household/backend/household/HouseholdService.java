package com.household.backend.household;
import com.household.backend.household.dto.HouseholdMemberResponse;
import com.household.backend.household.dto.HouseholdResponse;
import com.household.backend.household.dto.ScheduleDayResponse;
import com.household.backend.profile.Profile;
import com.household.backend.profile.ProfileNotFoundException;
import com.household.backend.profile.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.household.backend.auth.SupabaseAdminService;
import com.household.backend.household.dto.HouseholdMemberResponse;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final HouseholdMemberRepository householdMemberRepository;
    private final SupabaseAdminService supabaseAdminService;
    private final ProfileRepository profileRepository;

    public HouseholdService(
            HouseholdRepository householdRepository,
            HouseholdMemberRepository householdMemberRepository,
            SupabaseAdminService supabaseAdminService,
            ProfileRepository profileRepository
    ) {
        this.householdRepository = householdRepository;
        this.householdMemberRepository = householdMemberRepository;
        this.supabaseAdminService = supabaseAdminService;
        this.profileRepository = profileRepository;
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

    // household rotation logic

    @Transactional
    public HouseholdResponse updateRotationSettings(
            UUID householdId,
            LocalDate startDate,
            UUID startingMemberId
    ) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() ->
                        new HouseholdNotFoundException(householdId));

        HouseholdMember startingMember = householdMemberRepository
                .findByIdAndHouseholdId(startingMemberId, householdId)
                .orElseThrow(() ->
                        new HouseholdMemberNotFoundException(
                                startingMemberId, householdId));

        if (!startingMember.isActive()) {
            throw new InvalidRotationSettingsException(
                    "The starting member must be active");
        }

        household.setRotationStartDate(startDate);
        household.setRotationStartMemberId(startingMemberId);

        Household saved = householdRepository.save(household);

        List<HouseholdMember> members =
                householdMemberRepository
                        .findByHouseholdIdOrderByPositionAsc(householdId);

        return HouseholdResponse.from(saved,
                members.stream()
                        .map(HouseholdMemberResponse::from)
                        .toList());
    }

    // the ScheduleDay logic
    @Transactional(readOnly = true)
    public List<ScheduleDayResponse> getSchedule(
            UUID householdId,
            int days
    ) {
        if (days < 1 || days > 31) {
            throw new IllegalArgumentException(
                    "Days must be between 1 and 31");
        }

        Household household = householdRepository.findById(householdId)
                .orElseThrow(() ->
                        new HouseholdNotFoundException(householdId));

        if (household.getRotationStartDate() == null
                || household.getRotationStartMemberId() == null) {
            throw new InvalidRotationSettingsException(
                    "Rotation settings have not been configured");
        }

        List<HouseholdMember> activeMembers =
                householdMemberRepository
                        .findByHouseholdIdOrderByPositionAsc(householdId)
                        .stream()
                        .filter(HouseholdMember::isActive)
                        .toList();

        if (activeMembers.isEmpty()) {
            throw new InvalidRotationSettingsException(
                    "There are no active household members");
        }

        int startIndex = -1;
        for (int i = 0; i < activeMembers.size(); i++) {
            if (activeMembers.get(i).getId()
                    .equals(household.getRotationStartMemberId())) {
                startIndex = i;
                break;
            }
        }

        if (startIndex == -1) {
            throw new InvalidRotationSettingsException(
                    "The starting member is not active");
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = household.getRotationStartDate();

        List<ScheduleDayResponse> schedule = new ArrayList<>();

        for (int day = 0; day < days; day++) {
            LocalDate date = today.plusDays(day);

            if (date.isBefore(startDate)) {
                continue;
            }

            long daysSinceStart = java.time.temporal.ChronoUnit.DAYS
                    .between(startDate, date);

            int memberIndex = (int) ((startIndex + daysSinceStart)
                    % activeMembers.size());

            HouseholdMember member = activeMembers.get(memberIndex);

            Profile profile = profileRepository.findById(member.getUserId())
                    .orElseThrow(() ->
                            new ProfileNotFoundException(member.getUserId()));

            schedule.add(new ScheduleDayResponse(
                    date,
                    member.getId(),
                    member.getUserId(),
                    profile.getDisplayName(),
                    member.getPosition()
            ));
        }

        return schedule;
    }




}