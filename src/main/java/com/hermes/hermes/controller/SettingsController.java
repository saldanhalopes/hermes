package com.hermes.hermes.controller;

import com.hermes.hermes.service.SettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Tag(name = "Configurações", description = "Gerenciamento de parâmetros do sistema")
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    @Operation(summary = "Obter configurações", description = "Retorna todos os parâmetros globais do sistema")
    public java.util.Map<String, String> getSettings() {
        return settingsService.getAllSettingsAsMap(); // I'll assume this exists or I'll create it
    }

    @PostMapping
    @Operation(summary = "Atualizar configurações", description = "Atualiza múltiplos parâmetros simultaneamente")
    public void updateSettings(@RequestBody Map<String, String> settings) {

        settings.forEach((key, value) -> settingsService.saveSetting(key, value, "GENERAL", "Update via API"));
    }
}

