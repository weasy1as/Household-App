
package com.household.backend.household;

import java.util.UUID;

public class HouseholdMemberNotFoundException
        extends RuntimeException {

    public HouseholdMemberNotFoundException(
            UUID memberId,
            UUID householdId
    ) {
        super("Member " + memberId
                + " was not found in household " + householdId);
    }
}
