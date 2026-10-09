
package com.household.backend.household;

public class UserAlreadyInHouseholdException
        extends RuntimeException {

    public UserAlreadyInHouseholdException() {
        super("This user already belongs to a household");
    }
}
