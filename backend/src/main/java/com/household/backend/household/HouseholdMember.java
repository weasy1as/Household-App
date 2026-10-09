package com.household.backend.household;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "household_members",
        schema = "public",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "household_members_user_unique",
                        columnNames = "user_id"
                ),
                @UniqueConstraint(
                        name = "household_members_position_unique",
                        columnNames = {"household_id", "position"}
                ),
                @UniqueConstraint(
                        name = "household_members_id_household_unique",
                        columnNames = {"id", "household_id"}
                )
        }
)
public class HouseholdMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "household_id", nullable = false)
    private UUID householdId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected HouseholdMember() {
    }

    public UUID getId() {
        return id;
    }

    public UUID getHouseholdId() {
        return householdId;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    public Integer getPosition() {
        return position;
    }

    public boolean isActive() {
        return active;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}