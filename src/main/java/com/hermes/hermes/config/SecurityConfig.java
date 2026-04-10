package com.hermes.hermes.config;

import com.hermes.hermes.model.SecurityRule;
import com.hermes.hermes.repository.SecurityRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationEventPublisher;
import org.springframework.security.authentication.DefaultAuthenticationEventPublisher;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.web.util.pattern.PathPatternParser;
import org.springframework.http.server.PathContainer;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SecurityRuleRepository securityRuleRepository;
    private final PathPatternParser parser = new PathPatternParser();

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                .requestMatchers("/login", "/debug/**", "/css/**", "/js/**", "/webjars/**", "/images/**", "/plugins/**", "/dist/**", "/favicon.ico").permitAll()
                .anyRequest().access((authentication, context) -> {
                    Authentication auth = authentication.get();
                    if (auth == null || !auth.isAuthenticated()) {
                        return new AuthorizationDecision(false);
                    }

                    // Debug Log
                    System.out.println("DEBUG: Accessing " + context.getRequest().getRequestURI() + " | User: " + auth.getName() + " | Authorities: " + auth.getAuthorities());

                    // Block Anonymous purely (optional if handle isAuthenticated correctly)
                    if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ANONYMOUS"))) {
                        return new AuthorizationDecision(false);
                    }

                    // Global ADMIN Override
                    boolean isAdmin = auth.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .anyMatch(a -> a.toUpperCase().equals("ROLE_ADMIN"));
                    if (isAdmin) {
                        System.out.println("DEBUG: User is ADMIN. Granting access.");
                        return new AuthorizationDecision(true);
                    }

                    // Check Database Rules using Spring Web PathPatterns
                    PathContainer path = PathContainer.parsePath(context.getRequest().getRequestURI());
                    List<SecurityRule> rules = securityRuleRepository.findAll();
                    
                    for (SecurityRule rule : rules) {
                        try {
                            if (parser.parse(rule.getUrlPattern()).matches(path)) {
                                String requiredRole = rule.getRequiredRole();
                                if ("PERMIT_ALL".equalsIgnoreCase(requiredRole)) return new AuthorizationDecision(true);
                                
                                boolean hasRole = auth.getAuthorities().stream()
                                        .map(GrantedAuthority::getAuthority)
                                        .anyMatch(a -> a.equals("ROLE_" + requiredRole));
                                if (hasRole) return new AuthorizationDecision(true);
                            }
                        } catch (Exception e) {
                            // Ignorar patterns invlidos no banco
                        }
                    }

                    return new AuthorizationDecision(false);
                })
                )
                .formLogin((form) -> form
                .loginPage("/login")
                .defaultSuccessUrl("/", true)
                .failureUrl("/login?error=true")
                .permitAll()
                )
                .logout((logout) -> logout
                .logoutSuccessUrl("/login?logout=true")
                .permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationEventPublisher authenticationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        return new DefaultAuthenticationEventPublisher(applicationEventPublisher);
    }
}
