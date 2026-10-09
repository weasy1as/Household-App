package com.household.backend.household;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "households", schema = "public")
public class Household {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(name = "rotation_start_date")
    private LocalDate rotationStartDate;

    @Column(name = "rotation_start_member_id")
    private UUID rotationStartMemberId;

    @Column(
            name = "created_at",
            nullable = false,
            insertable = false,
            updatable = false
    )
    private OffsetDateTime createdAt;

    protected Household() {
    }

    public Household(String name, UUID ownerId) {
        this.name = name;
        this.ownerId = ownerId;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public LocalDate getRotationStartDate() {
        return rotationStartDate;
    }

    public UUID getRotationStartMemberId() {
        return rotationStartMemberId;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}