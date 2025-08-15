// Capacitor imports commented out - PWA mode only
// import { StatusBar, Style } from '@capacitor/status-bar';
// import { SplashScreen } from '@capacitor/splash-screen';
// import { App } from '@capacitor/app';
// import { Capacitor } from '@capacitor/core';
import { setupNotifications } from './notifications';
// import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { logger } from '@/utils/logger';

/**
 * Initialise tous les plugins Capacitor
 */
export async function initializeCapacitor() {
  // PWA elements (pour camera, etc. si besoin futur)
  // defineCustomElements(window);

  // PWA mode only - Capacitor not installed
  logger.info('Running as PWA');
  await setupNotifications();
  return;

  // Capacitor code commented out - PWA mode only
  /*
  try {
    // Configuration de la status bar
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1a1a1a' });
    
    // Configuration des notifications
    await setupNotifications();
    
    // Gestion du cycle de vie de l'app
    App.addListener('appStateChange', ({ isActive }: any) => {
      logger.info('App state changed. Is active?', isActive);
      if (isActive) {
        // L'app revient au premier plan
        window.dispatchEvent(new Event('app-resume'));
      } else {
        // L'app passe en arrière-plan
        window.dispatchEvent(new Event('app-pause'));
      }
    });
    
    // Gestion du bouton retour (Android)
    App.addListener('backButton', ({ canGoBack }: any) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });
    
    // Masquer le splash screen après initialisation
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    
    logger.info('Capacitor plugins initialized successfully');
  } catch (error) {
    logger.error('Error initializing Capacitor:', error);
  }
  */
}

/**
 * Vérifie si l'app tourne en mode natif
 */
export function isNative(): boolean {
  // PWA mode only
  return false;
}

/**
 * Obtient la plateforme actuelle
 */
export function getPlatform(): string {
  // PWA mode only
  return 'web';
}

/**
 * Vérifie si un plugin est disponible
 */
export function isPluginAvailable(_pluginName: string): boolean {
  // PWA mode only
  return false;
}
