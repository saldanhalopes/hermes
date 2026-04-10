package com.hermes.hermes.controller;

import com.hermes.hermes.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    public String viewAuditLogs(Model model) {
        model.addAttribute("auditLogs", auditService.getRecentChanges(100));
        model.addAttribute("accessLogs", auditService.getRecentAccessLogs());
        return "admin/audit";
    }
}
