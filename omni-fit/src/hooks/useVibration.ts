/**
 * Hook pour gérer les vibrations sur mobile
 */
export function useVibration() {
  const vibrate = (pattern: number | number[] = 50) => {
    // Vérifier si l'API Vibration est disponible
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const canVibrate = () => {
    return 'vibrate' in navigator;
  };

  return {
    vibrate,
    canVibrate,
  };
}
