import { useState, useEffect } from 'react';
import { subscriptionService } from '@/services/subscription';

export type AppView = 'landing' | 'dashboard' | 'onboarding';

export function useAppState() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  useEffect(() => {
    // Éviter le double déclenchement en mode dev
    let mounted = true;
    
    const initializeView = () => {
      if (!mounted) return;
      
      // Vérifier les paramètres d'URL pour le mode dev
      const urlParams = new URLSearchParams(window.location.search);
      
      // Force l'affichage de la landing page avec ?view=landing
      if (urlParams.get('view') === 'landing') {
        setCurrentView('landing');
        return;
      }
      
      // Force l'affichage du dashboard avec ?view=dashboard
      if (urlParams.get('view') === 'dashboard') {
        setCurrentView('dashboard');
        return;
      }
      
      // Tester si localStorage est disponible
      let localStorageAvailable = true;
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
      } catch (e) {
        localStorageAvailable = false;
      }
      
      // Si localStorage n'est pas disponible (navigation privée), toujours afficher la landing
      if (!localStorageAvailable) {
        setCurrentView('landing');
        return;
      }
      
      // Vérifier si c'est la première visite
      const hasVisited = localStorage.getItem('omnifit_has_visited');
      const hasCompletedOnboarding = localStorage.getItem('omnifit_onboarding_completed') === 'true';
      
      if (hasVisited) {
        setIsFirstVisit(false);
        // Si l'utilisateur a déjà visité, aller directement au dashboard
        // sauf s'il n'a pas complété l'onboarding
        if (hasCompletedOnboarding) {
          setCurrentView('dashboard');
        } else {
          setCurrentView('onboarding');
        }
      } else {
        // Première visite ou localStorage vide - afficher la landing page
        setCurrentView('landing');
      }
      
      // Vérifier les paramètres d'URL (retour de Stripe, etc.)
      if (urlParams.get('subscription') === 'success') {
        // L'utilisateur revient de Stripe après souscription
        setCurrentView('dashboard');
      }
    };
    
    // Délai pour éviter le double montage en React 18 StrictMode
    const timer = setTimeout(initializeView, 0);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);
  
  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    
    // Marquer la première visite
    if (isFirstVisit && view !== 'landing') {
      try {
        localStorage.setItem('omnifit_has_visited', 'true');
        setIsFirstVisit(false);
      } catch (e) {
        // En navigation privée, on ne peut pas sauvegarder
        console.warn('Impossible de sauvegarder l\'état de visite (navigation privée?)');
      }
    }
  };
  
  const startApp = (withTrial: boolean = false) => {
    if (withTrial) {
      subscriptionService.startFreeTrial();
    }
    
    // Si c'est la première fois, montrer l'onboarding
    let hasCompletedOnboarding = false;
    try {
      hasCompletedOnboarding = localStorage.getItem('omnifit_onboarding_completed') === 'true';
    } catch (e) {
      // En navigation privée, toujours montrer l'onboarding
      hasCompletedOnboarding = false;
    }
    
    if (!hasCompletedOnboarding) {
      navigateTo('onboarding');
    } else {
      navigateTo('dashboard');
    }
  };
  
  const completeOnboarding = () => {
    try {
      localStorage.setItem('omnifit_onboarding_completed', 'true');
    } catch (e) {
      // En navigation privée, on ne peut pas sauvegarder
      console.warn('Impossible de sauvegarder la complétion de l\'onboarding');
    }
    navigateTo('dashboard');
  };
  
  const resetApp = () => {
    // Effacer toutes les données locales
    try {
      localStorage.removeItem('omnifit_has_visited');
      localStorage.removeItem('omnifit_onboarding_completed');
      localStorage.removeItem('omnifit_subscription');
    } catch (e) {
      // En navigation privée, on ne peut pas modifier localStorage
      console.warn('Impossible de réinitialiser localStorage');
    }
    setCurrentView('landing');
    setIsFirstVisit(true);
  };
  
  return {
    currentView,
    isFirstVisit,
    navigateTo,
    startApp,
    completeOnboarding,
    resetApp
  };
}