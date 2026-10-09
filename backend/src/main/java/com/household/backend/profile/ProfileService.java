package com.household.backend.profile;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public Profile getProfile(UUID id) {
        return profileRepository.findById(id)
                .orElseThrow(() ->
                        new ProfileNotFoundException(id));
    }
}
