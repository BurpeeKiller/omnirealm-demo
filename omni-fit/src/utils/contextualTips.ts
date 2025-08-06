// Utilitaire pour déclencher les tips contextuels

export const triggerContextualTip = (tipId: string) => {
  // Utiliser l'API globale exposée par ContextualTips
  if (typeof window !== 'undefined' && (window as any).showContextualTip) {
    (window as any).showContextualTip(tipId);
  }
};

export const TipTriggers = {
  // Déclencher après le premier exercice
  firstExercise: () => triggerContextualTip('first-exercise'),

  // Déclencher après 1 minute d'utilisation
  afterMinute: () => triggerContextualTip('consistency'),

  // Déclencher après 3 exercices
  threeExercises: () => triggerContextualTip('progress'),

  // Déclencher lors de la première série
  firstStreak: () => triggerContextualTip('streak'),
};

// Hook pour déclencher automatiquement les tips
export const useContextualTips = () => {
  const checkTriggers = (exerciseCount: number, streakCount: number) => {
    // Premier exercice
    if (exerciseCount === 1) {
      setTimeout(() => TipTriggers.firstExercise(), 1000);
    }

    // Trois exercices
    if (exerciseCount === 3) {
      setTimeout(() => TipTriggers.threeExercises(), 1000);
    }

    // Première série
    if (streakCount === 1) {
      setTimeout(() => TipTriggers.firstStreak(), 1000);
    }
  };

  return { checkTriggers };
};
