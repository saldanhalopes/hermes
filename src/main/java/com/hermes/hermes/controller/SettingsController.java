package com.hermes.hermes.controller;

import com.hermes.hermes.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping({"", "/"})
    public String viewSettings(Model model) {
        model.addAttribute("settings", settingsService.getAllSettings());
        
        // Adicionar valores atuais das propriedades (caso não estejam no banco ainda)
        model.addAttribute("geminiApiKey", settingsService.getSetting("gemini.api.key", ""));
        model.addAttribute("geminiApiUrl", settingsService.getSetting("gemini.api.url", ""));
        model.addAttribute("vapidPublicKey", settingsService.getSetting("vapid.public.key", ""));
        model.addAttribute("vapidPrivateKey", settingsService.getSetting("vapid.private.key", ""));
        
        return "settings";
    }

    @PostMapping("/update")
    public String updateSettings(@RequestParam Map<String, String> params) {
        // As chaves enviadas no form devem ser as chaves reais das configurações
        settingsService.saveSetting("gemini.api.key", params.get("geminiApiKey"), "AI", "Chave de API do Gemini 1.5");
        settingsService.saveSetting("gemini.api.url", params.get("geminiApiUrl"), "AI", "Endpoint da API do Gemini");
        settingsService.saveSetting("vapid.public.key", params.get("vapidPublicKey"), "NOTIFICATIONS", "Chave pública VAPID");
        settingsService.saveSetting("vapid.private.key", params.get("vapidPrivateKey"), "NOTIFICATIONS", "Chave privada VAPID");
        
        return "redirect:/settings?success=true";
    }
}
