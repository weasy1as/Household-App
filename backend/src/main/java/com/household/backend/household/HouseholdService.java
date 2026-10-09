package com.household.backend.household;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class HouseholdService {

    private final HouseholdRepository householdRepository;

    public HouseholdService(
            HouseholdRepository householdRepository) {
        this.householdRepository = householdRepository;
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
}