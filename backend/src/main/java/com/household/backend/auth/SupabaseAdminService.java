package com.household.backend.auth;

import com.household.backend.auth.dto.SupabaseUserPage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Service
public class SupabaseAdminService {

    private final RestClient restClient;

    public SupabaseAdminService(
            @Value("${SUPABASE_URL}") String supabaseUrl,
            @Value("${SUPABASE_SERVICE_ROLE_KEY}") String serviceKey) {

        this.restClient = RestClient.builder()
                .baseUrl(supabaseUrl + "/auth/v1")
                .defaultHeader("apikey", serviceKey)
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + serviceKey)
                .build();
    }


    public UUID findUserIdByEmail(String email) {
        int page = 1;
        int perPage = 100;

        while (true) {
            final int currentPage = page;

            SupabaseUserPage response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/admin/users")
                            .queryParam("page", currentPage)
                            .queryParam("per_page", perPage)
                            .build())
                    .retrieve()
                    .body(SupabaseUserPage.class);

            if (response == null || response.users() == null) {
                throw new IllegalStateException(
                        "Could not retrieve users from Supabase");
            }

            for (var user : response.users()) {
                if (user.email() != null
                        && user.email().equalsIgnoreCase(email.trim())) {
                    return user.id();
                }
            }

            if (response.users().size() < perPage) {
                break;
            }

            page++;
        }

        throw new UserNotFoundException(email);
    }

}
