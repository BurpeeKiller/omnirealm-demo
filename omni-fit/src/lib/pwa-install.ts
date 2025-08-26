// PWA Installation utilities
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

class PWAInstallManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private callbacks: ((canInstall: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    // Écouter l'événement beforeinstallprompt
    window.addEventListener("beforeinstallprompt", e => {
      console.log("💡 PWA: Before install prompt triggered");
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notifyCallbacks(true);
    });

    // Détecter si l'app est déjà installée
    window.addEventListener("appinstalled", () => {
      console.log("✅ PWA: App installed successfully");
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifyCallbacks(false);
    });

    // Détecter le mode standalone (app installée)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("🎯 PWA: Running in standalone mode");
      this.isInstalled = true;
    }
  }

  private notifyCallbacks(canInstall: boolean) {
    this.callbacks.forEach(callback => callback(canInstall));
  }

  /**
   * Afficher le prompt d'installation
   */
  async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn("⚠️ PWA: No install prompt available");
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      console.log(`🎯 PWA: User ${outcome} the install prompt`);

      if (outcome === "accepted") {
        this.deferredPrompt = null;
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ PWA: Error showing install prompt:", error);
      return false;
    }
  }

  /**
   * Vérifier si l'installation est possible
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  /**
   * Vérifier si l'app est installée
   */
  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * S'abonner aux changements d'état d'installation
   */
  onInstallStateChange(callback: (canInstall: boolean) => void) {
    this.callbacks.push(callback);

    // Appeler immédiatement avec l'état actuel
    callback(this.canInstall());

    // Retourner fonction de désabonnement
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Obtenir des informations sur la plateforme
   */
  getPlatformInfo() {
    if (!this.deferredPrompt) return null;

    return {
      platforms: this.deferredPrompt.platforms,
      isInstallable: this.canInstall(),
      isInstalled: this.isInstalled,
    };
  }
}

// Instance singleton
export const pwaInstallManager = new PWAInstallManager();

// Hook React pour utiliser le PWA Install Manager
export function usePWAInstall() {
  const [canInstall, setCanInstall] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = pwaInstallManager.onInstallStateChange(setCanInstall);
    return unsubscribe;
  }, []);

  return {
    canInstall,
    isInstalled: pwaInstallManager.isAppInstalled(),
    showInstallPrompt: () => pwaInstallManager.showInstallPrompt(),
    platformInfo: pwaInstallManager.getPlatformInfo(),
  };
}

// Utilitaire pour détecter si on est sur mobile
export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Détection mobile basique
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent);
}

// Utilitaire pour détecter iOS
export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Utilitaire pour détecter si on est dans Safari iOS
export function isIOSSafari(): boolean {
  if (!isIOSDevice()) return false;

  const isStandalone = (navigator as any).standalone;
  const isSafari = /safari/i.test(navigator.userAgent);

  return isSafari && !isStandalone;
}

import React from "react";
