"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall, isMobileDevice, isIOSSafari } from "@/lib/pwa-install";

export function PWAInstallPrompt() {
  const { canInstall, showInstallPrompt } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  // Ne pas afficher si pas installable ou déjà fermé
  if (!canInstall || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);

    try {
      const success = await showInstallPrompt();
      if (success) {
        setIsVisible(false);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Sauvegarder la préférence de l'utilisateur
    localStorage.setItem("omnifit-pwa-dismissed", Date.now().toString());
  };

  const isMobile = isMobileDevice();
  const isIOSInSafari = isIOSSafari();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {isMobile ? (
                  <Smartphone className="w-6 h-6 text-[#00D9B1]" />
                ) : (
                  <Monitor className="w-6 h-6 text-[#00D9B1]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#2D3436] mb-1">Installer OmniFit</h3>

                {isIOSInSafari ? (
                  <p className="text-xs text-[#636E72] mb-3">
                    Appuyez sur le bouton de partage <span className="inline-block">📤</span> puis
                    "Ajouter à l'écran d'accueil"
                  </p>
                ) : (
                  <p className="text-xs text-[#636E72] mb-3">
                    Installez l'app pour un accès rapide et une meilleure expérience
                  </p>
                )}

                <div className="flex items-center gap-2">
                  {!isIOSInSafari && (
                    <Button
                      onClick={handleInstall}
                      disabled={isInstalling}
                      size="sm"
                      className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white border-0 text-xs px-3 py-1.5 h-auto"
                    >
                      {isInstalling ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                          Installation...
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3 mr-1.5" />
                          Installer
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-[#636E72] hover:text-[#2D3436] hover:bg-gray-100 text-xs px-2 py-1.5 h-auto"
                  >
                    Plus tard
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-[#636E72] hover:text-[#2D3436] hover:bg-gray-100 p-1 h-auto w-auto flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook pour gérer l'affichage du prompt selon les préférences utilisateur
export function usePWAPromptVisibility() {
  const [shouldShow, setShouldShow] = useState(false);
  const { canInstall } = usePWAInstall();

  React.useEffect(() => {
    // Vérifier si l'utilisateur a déjà dismissé le prompt récemment
    const dismissed = localStorage.getItem("omnifit-pwa-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    // Afficher si installable et pas dismissé récemment
    setShouldShow(canInstall && dismissedTime < oneWeekAgo);
  }, [canInstall]);

  return shouldShow;
}

// Composant wrapper qui gère l'affichage intelligent
export function SmartPWAInstallPrompt() {
  const shouldShow = usePWAPromptVisibility();

  if (!shouldShow) {
    return null;
  }

  return <PWAInstallPrompt />;
}
