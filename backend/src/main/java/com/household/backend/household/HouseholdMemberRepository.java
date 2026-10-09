package com.household.backend.household;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface HouseholdMemberRepository
        extends JpaRepository<HouseholdMember, UUID> {

    List<HouseholdMember> findByHouseholdIdOrderByPositionAsc(
            UUID householdId
    );

    Optional<HouseholdMember> findByUserId(UUID userId);

    Optional<HouseholdMember> findByIdAndHouseholdId(
            UUID memberId,
            UUID householdId
    );

}