package com.hermes.hermes.config;

import com.hermes.hermes.model.SecurityRule;
import com.hermes.hermes.repository.SecurityRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class SecurityRuleSync {

    private final SecurityRuleRepository securityRuleRepository;
    private final RequestMappingHandlerMapping requestMappingHandlerMapping;

    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        log.info("Iniciando sincronizao de rotas de segurana...");
        
        requestMappingHandlerMapping.getHandlerMethods().forEach((info, method) -> {
            Set<String> patterns = info.getDirectPaths();
            if (patterns.isEmpty() && info.getPathPatternsCondition() != null) {
                patterns = info.getPathPatternsCondition().getPatternValues();
            }

            for (String pattern : patterns) {
                // Pular rotas de infraestrutura e erro
                if (pattern.equals("/error") || pattern.startsWith("/debug")) continue;

                syncRoute(pattern);
            }
        });
        
        log.info("Sincronizao de rotas concluda.");
    }

    private void syncRoute(String pattern) {
        securityRuleRepository.findByUrlPatternAndHttpMethod(pattern, "ALL")
                .ifPresentOrElse(
                    rule -> {}, // J existe
                    () -> {
                        log.info("Nova rota detectada: {}. Registrando acesso ADMIN.", pattern);
                        securityRuleRepository.save(SecurityRule.builder()
                                .urlPattern(pattern)
                                .httpMethod("ALL")
                                .requiredRole("ADMIN")
                                .description("Auto-generated for " + pattern)
                                .build());
                    }
                );
    }
}
