package com.hermes.hermes.repository;

import com.hermes.hermes.model.SecurityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SecurityRuleRepository extends JpaRepository<SecurityRule, Long> {
    Optional<SecurityRule> findByUrlPatternAndHttpMethod(String urlPattern, String httpMethod);
}
