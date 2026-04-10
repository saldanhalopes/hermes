package com.hermes.hermes.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.hermes.hermes.model.User;
import com.hermes.hermes.repository.UserRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.Optional;

@Component
public class FirebaseAuthenticationProvider implements AuthenticationProvider {

    @Value("${firebase.web.api.key}")
    private String firebaseApiKey;

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public FirebaseAuthenticationProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String email = authentication.getName();
        String password = authentication.getCredentials().toString();

        try {
            String url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + firebaseApiKey;
            String body = objectMapper.createObjectNode()
                    .put("email", email)
                    .put("password", password)
                    .put("returnSecureToken", true)
                    .toString();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode jsonResponse = objectMapper.readTree(response.body());
                String uid = jsonResponse.get("localId").asText();
                
                // Resolve role from local database
                String role = userRepository.findByUsername(email)
                        .or(() -> userRepository.findByEmail(email))
                        .map(User::getRole)
                        .map(String::trim)
                        .orElse("USER");

                System.out.println("Firebase Login SUCCESS: " + email + " | Resolved Role: " + role);
                return new UsernamePasswordAuthenticationToken(email, password, 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));
            } else {
                throw new BadCredentialsException("Invalid Firebase credentials");
            }
        } catch (Exception e) {
            throw new BadCredentialsException("Could not authenticate with Firebase", e);
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}
