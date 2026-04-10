package com.hermes.hermes.service;

import com.hermes.hermes.model.AccessLog;
import com.hermes.hermes.repository.AccessLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AuthenticationEventListener {

    private final AccessLogRepository accessLogRepository;

    @EventListener
    public void onSuccess(AuthenticationSuccessEvent success) {
        String username = success.getAuthentication().getName();
        logAccess(username, "LOGIN_SUCCESS", "SUCCESS");
    }

    @EventListener
    public void onFailure(AbstractAuthenticationFailureEvent failure) {
        String username = failure.getAuthentication().getName();
        logAccess(username, "LOGIN_FAILURE", "FAILURE");
    }

    private void logAccess(String username, String action, String status) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        
        AccessLog log = AccessLog.builder()
                .username(username)
                .timestamp(LocalDateTime.now())
                .action(action)
                .status(status)
                .ipAddress(request.getRemoteAddr())
                .userAgent(request.getHeader("User-Agent"))
                .build();
        
        accessLogRepository.save(log);
    }
}
