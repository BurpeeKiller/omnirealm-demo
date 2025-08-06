// Configuration LemonSqueezy
export const LEMONSQUEEZY_CONFIG = {
  storeId: import.meta.env.VITE_LEMONSQUEEZY_STORE_ID || '',
  apiUrl: 'https://api.lemonsqueezy.com/v1',

  // Plans de tarification
  plans: {
    free: {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      currency: 'EUR',
      features: ['3 rappels par jour', 'Statistiques de base', 'Export CSV', 'PWA installable'],
      limits: {
        remindersPerDay: 3,
        statsHistory: 7, // jours
        exportEnabled: true,
        syncDevices: 1,
      },
    },
    pro: {
      id: 'pro',
      variantId: '', // À remplir avec l'ID LemonSqueezy
      name: 'Pro',
      price: 29,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Rappels illimités',
        'Statistiques avancées',
        'Export CSV/PDF',
        'Synchronisation multi-appareils',
        'Widgets personnalisables',
        'Support prioritaire',
      ],
      limits: {
        remindersPerDay: -1, // illimité
        statsHistory: -1, // illimité
        exportEnabled: true,
        syncDevices: 5,
      },
    },
    team: {
      id: 'team',
      variantId: '', // À remplir avec l'ID LemonSqueezy
      name: 'Team',
      price: 99,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Tout du plan Pro',
        "Jusqu'à 10 utilisateurs",
        'Tableau de bord équipe',
        'Défis collectifs',
        'API access',
        'Support dédié',
      ],
      limits: {
        remindersPerDay: -1,
        statsHistory: -1,
        exportEnabled: true,
        syncDevices: 50,
        teamMembers: 10,
      },
    },
  },

  // URLs de checkout
  checkoutUrls: {
    pro: '', // À remplir
    team: '', // À remplir
  },
};
