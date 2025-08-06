// Service Worker personnalisé pour Background Sync et Notifications

// Gestion du Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'fitness-sync') {
    console.log('🔄 Background Sync déclenché');
    event.waitUntil(syncData());
  }
});

// Fonction de synchronisation des données
async function syncData() {
  try {
    // Récupérer la queue de synchronisation depuis IndexedDB ou localStorage
    const cache = await caches.open('sync-cache');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
        }
      } catch (error) {
        console.error('Erreur sync:', error);
      }
    }
  } catch (error) {
    console.error('Erreur Background Sync:', error);
  }
}

// Gestion des notifications périodiques
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'fitness-reminder') {
    console.log('⏰ Vérification des rappels...');
    event.waitUntil(checkAndSendReminders());
  }
});

// Vérifier et envoyer les rappels
async function checkAndSendReminders() {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Récupérer les paramètres de rappel depuis IndexedDB
    const db = await openDB();
    const settings = await getSettings(db);
    
    if (settings && settings.remindersEnabled) {
      const { startHour, endHour, intervalMinutes } = settings;
      
      // Vérifier si c'est l'heure d'un rappel
      if (currentHour >= startHour && currentHour <= endHour) {
        if (currentMinute % intervalMinutes === 0) {
          await sendNotification();
        }
      }
    }
  } catch (error) {
    console.error('Erreur vérification rappels:', error);
  }
}

// Envoyer une notification
async function sendNotification() {
  const exercises = ['Burpees', 'Pompes', 'Squats'];
  const exercise = exercises[Math.floor(Math.random() * exercises.length)];
  const count = 10;
  
  const options = {
    body: `C'est l'heure de faire ${count} ${exercise}! 💪`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'fitness-reminder',
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: 'complete', title: 'Fait ✓' },
      { action: 'snooze', title: 'Plus tard' }
    ],
    data: {
      exercise,
      count,
      timestamp: Date.now()
    }
  };
  
  await self.registration.showNotification('Fitness Reminder', options);
}

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'complete') {
    // Marquer l'exercice comme complété
    event.waitUntil(
      clients.openWindow('/?completed=' + event.notification.data.exercise)
    );
  } else if (event.action === 'snooze') {
    // Reporter de 15 minutes
    event.waitUntil(
      scheduleSnooze(15)
    );
  } else {
    // Ouvrir l'app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Reporter une notification
async function scheduleSnooze(minutes) {
  setTimeout(() => {
    sendNotification();
  }, minutes * 60 * 1000);
}

// Ouvrir la base de données IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FitnessReminderDB', 2);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Récupérer les paramètres
async function getSettings(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get('reminders');
    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error);
  });
}

// Gestion du cache offline
self.addEventListener('fetch', (event) => {
  // Stratégie Network First avec fallback cache pour l'API
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cloner la réponse pour la mettre en cache
          const responseToCache = response.clone();
          caches.open('api-cache').then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // En cas d'échec, utiliser le cache
          return caches.match(event.request);
        })
    );
  }
});

// Message depuis l'app principale
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'SYNC_NOW') {
    event.waitUntil(syncData());
  }
  
  if (event.data.type === 'CHECK_REMINDERS') {
    event.waitUntil(checkAndSendReminders());
  }
});

console.log('✅ Service Worker personnalisé chargé');