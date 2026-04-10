package com.hermes.hermes.service;

import com.hermes.hermes.model.PushSubscription;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Utils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.security.Security;

@Service
public class PushNotificationService {

    @Value("${vapid.public.key}")
    private String publicKey;

    @Value("${vapid.private.key}")
    private String privateKey;

    private PushService pushService;

    @jakarta.annotation.PostConstruct
    public void init() {
        try {
            Security.addProvider(new BouncyCastleProvider());
            pushService = new PushService(publicKey, privateKey, "mailto:admin@hermes.com");
        } catch (Exception e) {
            System.err.println("WARNING: PushNotificationService could not be initialized (Check VAPID keys): " + e.getMessage());
        }
    }

    public void sendPushNotification(PushSubscription subscription, String message) {
        try {
            Notification notification = new Notification(
                    subscription.getEndpoint(),
                    subscription.getP256dh(),
                    subscription.getAuth(),
                    message
            );
            pushService.send(notification);
        } catch (Exception e) {
            System.err.println("Error sending push: " + e.getMessage());
        }
    }
}
