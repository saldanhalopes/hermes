package com.hermes.hermes.controller;

import com.hermes.hermes.model.PushSubscription;
import com.hermes.hermes.repository.PushSubscriptionRepository;
import com.hermes.hermes.service.PushNotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class PushNotificationController {

    private final PushSubscriptionRepository repository;
    private final PushNotificationService service;

    public PushNotificationController(PushSubscriptionRepository repository, PushNotificationService service) {
        this.repository = repository;
        this.service = service;
    }

    @PostMapping("/subscribe")
    public void subscribe(@RequestBody PushSubscription subscription, Authentication authentication) {
        subscription.setUserEmail(authentication.getName());
        repository.save(subscription);
    }

    @PostMapping("/test")
    public String testPush(Authentication authentication) {
        List<PushSubscription> subscriptions = repository.findByUserEmail(authentication.getName());
        if (subscriptions.isEmpty()) {
            return "Nenhuma inscrição encontrada para " + authentication.getName();
        }
        for (PushSubscription sub : subscriptions) {
            service.sendPushNotification(sub, "Teste de Notificação Hermes - Sucesso!");
        }
        return "Notificação enviada para " + subscriptions.size() + " dispositivos.";
    }
}
