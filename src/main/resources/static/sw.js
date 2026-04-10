self.addEventListener('push', function(event) {
    const data = event.data ? event.data.text() : 'Notificação do Hermes';
    
    const options = {
        body: data,
        icon: '/images/icon.png', // Fallback icon
        badge: '/images/badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        }
    };

    event.waitUntil(
        self.registration.showNotification('Hermes', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
