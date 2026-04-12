package com.hermes.hermes.controller;

import com.hermes.hermes.service.AuditService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@Tag(name = "Auditoria", description = "Logs de auditoria e acessos")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Listar logs de auditoria", description = "Retorna logs de mudanças recentes e acessos")
    public java.util.Map<String, Object> viewAuditLogs() {
        return java.util.Map.of(
            "auditLogs", auditService.getRecentChanges(100),
            "accessLogs", auditService.getRecentAccessLogs()
        );
    }
}


