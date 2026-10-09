package com.household.backend.profile;

import com.household.backend.profile.dto.ProfileResponse;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{id}")
    public ProfileResponse getProfile(@PathVariable UUID id) {
        return ProfileResponse.from(
                profileService.getProfile(id)
        );
    }
}
