import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader } from 'lucide-react';
import { checkSubscription } from '@/services/api-simple';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        navigate('/');
        return;
      }

      try {
        // Attendre un peu pour que Stripe webhook soit traité
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Vérifier le statut de l'abonnement
        const subscription = await checkSubscription();
        
        if (subscription.is_pro) {
          setIsSuccess(true);
          // Rediriger après 3 secondes
          setTimeout(() => {
            navigate('/upload');
          }, 3000);
        } else {
          // Si pas encore Pro, réessayer
          setTimeout(verifyPayment, 2000);
        }
      } catch (error) {
        console.error('Erreur vérification paiement:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {isVerifying ? (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Vérification du paiement...
              </h1>
              <p className="text-gray-600">
                Nous confirmons votre abonnement, cela ne prendra qu'un instant.
              </p>
            </>
          ) : isSuccess ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenue dans OmniScan Pro !
              </h1>
              <p className="text-gray-600 mb-6">
                Votre abonnement est actif. Vous allez être redirigé vers l'application.
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  Vous avez maintenant accès à toutes les fonctionnalités Pro :
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Scans illimités</li>
                  <li>• Analyse IA avancée</li>
                  <li>• Export sans limite</li>
                  <li>• Support prioritaire</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Traitement en cours...
              </h1>
              <p className="text-gray-600">
                Le paiement est en cours de traitement. Veuillez patienter.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}