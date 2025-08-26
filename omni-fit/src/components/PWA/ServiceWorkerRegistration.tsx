"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // next-pwa gère automatiquement l'enregistrement du service worker
    // Ce composant peut être utilisé pour de la logique PWA personnalisée

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(registration => {
          console.log("✅ PWA: Service Worker ready:", registration.scope);

          // Écouter les mises à jour de l'app
          registration.addEventListener("updatefound", () => {
            console.log("🔄 PWA: New update available");
            // Optionnel: Notifier l'utilisateur qu'une mise à jour est disponible
          });
        })
        .catch(error => {
          console.error("❌ PWA: Service Worker error:", error);
        });
    }
  }, []);

  return null; // Ce composant ne rend rien visuellement
}
