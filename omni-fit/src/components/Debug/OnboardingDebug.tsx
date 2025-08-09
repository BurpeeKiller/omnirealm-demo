import { useOnboarding } from '@/hooks/useOnboarding';
import { useNotification } from '@/hooks/useNotification';

export const OnboardingDebug = () => {
  const { state, resetOnboarding, skipOnboarding } = useOnboarding();
  const { permission, isSupported } = useNotification();

  return (
    <div
      className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg text-xs text-gray-300 z-[9999]"
      style={{ zIndex: 9999 }}
    >
      <h3 className="font-bold mb-2">Debug Onboarding</h3>
      <div className="space-y-1">
        <p>Step: {state.currentStep}</p>
        <p>Completed: {state.isCompleted ? '✅' : '❌'}</p>
        <p>Welcome: {state.hasSeenWelcome ? '✅' : '❌'}</p>
        <p>Notifications: {state.hasGrantedNotifications ? '✅' : '❌'}</p>
        <p>First Exercise: {state.hasCompletedFirstExercise ? '✅' : '❌'}</p>
        <p>Notif Permission: {permission}</p>
        <p>Notif Support: {isSupported ? '✅' : '❌'}</p>
      </div>
      <div className="mt-2 space-x-2">
        <button onClick={resetOnboarding} className="px-2 py-1 bg-red-600 rounded text-white">
          Reset
        </button>
        <button onClick={skipOnboarding} className="px-2 py-1 bg-green-600 rounded text-white">
          Skip
        </button>
      </div>
      <div className="mt-2">
        <button
          onClick={() => {
            // Force absolue : effacer directement et recharger
            localStorage.setItem(
              'omni-fit-onboarding',
              JSON.stringify({
                isCompleted: true,
                currentStep: 3,
                hasSeenWelcome: true,
                hasGrantedNotifications: false,
                hasCompletedFirstExercise: true,
              }),
            );
            window.location.reload();
          }}
          className="w-full px-2 py-1 bg-red-600 rounded text-white text-xs"
        >
          FORCE CLOSE 🚨
        </button>
      </div>
    </div>
  );
};
