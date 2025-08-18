import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/auth/auth.service';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Récupérer la session depuis l'URL
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('Error during auth callback:', error);
          navigate('/?error=auth_failed');
          return;
        }

        // Rediriger vers la page principale
        navigate('/');
      } catch (error) {
        console.error('Callback error:', error);
        navigate('/?error=callback_failed');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto"></div>
        <p className="mt-4 text-gray-400">Connexion en cours...</p>
      </div>
    </div>
  );
}