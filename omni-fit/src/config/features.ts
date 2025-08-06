// Configuration des fonctionnalités de l'application
// Permet d'activer/désactiver facilement des features pendant le développement

export const FEATURES = {
  // Onboarding automatique au premier lancement
  // DÉSACTIVÉ temporairement car bloque l'app sur mobile
  ONBOARDING_AUTO_SHOW: false,

  // Afficher les boutons de debug
  DEBUG_MODE: true,

  // Notifications
  NOTIFICATIONS_ENABLED: true,

  // Backup automatique
  AUTO_BACKUP_ENABLED: true,

  // Analytics
  ANALYTICS_ENABLED: true,
};

// Helper pour vérifier si une feature est activée
export const isFeatureEnabled = (feature: keyof typeof FEATURES): boolean => {
  return FEATURES[feature] ?? false;
};
