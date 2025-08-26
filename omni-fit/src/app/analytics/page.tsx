"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnalyticsDashboard } from "@/components/Analytics/AnalyticsDashboard";
import { ReportsPanel } from "@/components/Analytics/ReportsPanel";
import { useAnalyticsStore, useAnalyticsAutoRefresh } from "@/stores/analytics.store";
import { BarChart3, FileText, Settings, Shield, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    description: "Vue d'ensemble de tes performances",
  },
  {
    id: "reports",
    label: "Rapports",
    icon: FileText,
    description: "Génère des rapports détaillés",
  },
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    description: "Configure tes préférences analytics",
  },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const router = useRouter();

  const {
    isOptedOut,
    autoRefresh,
    refreshInterval,
    isLoading,
    lastUpdated,
    refreshAllData,
    optIn,
    optOut,
    setAutoRefresh,
    setRefreshInterval,
  } = useAnalyticsStore();

  // Auto-refresh hook
  useAnalyticsAutoRefresh();

  // Charger les données au montage
  useEffect(() => {
    if (!isOptedOut) {
      refreshAllData();
    }
  }, [isOptedOut, refreshAllData]);

  // Afficher la notice de confidentialité si c'est la première visite
  useEffect(() => {
    const hasSeenNotice = localStorage.getItem("omnifit-analytics-notice-seen");
    if (!hasSeenNotice && !isOptedOut) {
      setShowPrivacyNotice(true);
    }
  }, [isOptedOut]);

  const handlePrivacyAccept = () => {
    localStorage.setItem("omnifit-analytics-notice-seen", "true");
    setShowPrivacyNotice(false);
    refreshAllData();
  };

  const handlePrivacyDecline = () => {
    localStorage.setItem("omnifit-analytics-notice-seen", "true");
    setShowPrivacyNotice(false);
    optOut();
  };

  if (showPrivacyNotice) {
    return <PrivacyNotice onAccept={handlePrivacyAccept} onDecline={handlePrivacyDecline} />;
  }

  if (isOptedOut) {
    return <OptOutView onOptIn={optIn} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D3436]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-[#E6FFF9] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#636E72]" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[#2D3436]">Analytics</h1>
                <p className="text-sm text-[#636E72] hidden sm:block">
                  Analyse détaillée de tes performances
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="hidden md:flex items-center gap-2 text-sm text-[#636E72]">
                  <RefreshCw className="w-4 h-4" />
                  Mis à jour {lastUpdated.toLocaleTimeString("fr-FR")}
                </div>
              )}

              <button
                onClick={() => refreshAllData()}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] hover:from-[#00B89F] hover:to-[#00A890] text-white"
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#00D9B1] text-[#00D9B1] bg-[#E6FFF9]"
                    : "border-transparent text-[#636E72] hover:text-[#2D3436] hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <div className="text-left hidden sm:block">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-500">{tab.description}</div>
                </div>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "dashboard" && <AnalyticsDashboard />}
          {activeTab === "reports" && <ReportsPanel />}
          {activeTab === "settings" && (
            <SettingsPanel
              autoRefresh={autoRefresh}
              refreshInterval={refreshInterval}
              onAutoRefreshChange={setAutoRefresh}
              onRefreshIntervalChange={setRefreshInterval}
              onOptOut={optOut}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Notice de confidentialité
function PrivacyNotice({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 p-8 rounded-2xl max-w-md w-full border border-gray-700"
      >
        <div className="text-center mb-6">
          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Analytics & Confidentialité</h2>
          <p className="text-gray-400 text-sm">
            Nous collectons des données d'usage pour améliorer ton expérience OmniFit.
          </p>
        </div>

        <div className="space-y-4 mb-6 text-sm">
          <div>
            <h3 className="text-white font-medium mb-2">✅ Ce que nous collectons :</h3>
            <ul className="text-gray-400 space-y-1 text-xs">
              <li>• Exercices réalisés (types et quantités)</li>
              <li>• Temps d'utilisation de l'app</li>
              <li>• Préférences et paramètres</li>
              <li>• Données de performance (anonymisées)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium mb-2">🚫 Ce que nous ne collectons PAS :</h3>
            <ul className="text-gray-400 space-y-1 text-xs">
              <li>• Informations personnelles identifiables</li>
              <li>• Données de géolocalisation précise</li>
              <li>• Photos ou contenus privés</li>
              <li>• Accès à d'autres apps</li>
            </ul>
          </div>

          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-purple-300 text-xs">
              🔒 Toutes les données sont chiffrées, anonymisées et conformes au RGPD. Tu peux te
              désinscrire à tout moment.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            Refuser
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
          >
            Accepter
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          En acceptant, tu peux accéder aux analytics avancées et insights personnalisés
        </p>
      </motion.div>
    </div>
  );
}

// Vue opt-out
function OptOutView({ onOptIn }: { onOptIn: () => void }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-8 rounded-2xl max-w-md w-full border border-gray-700 text-center"
      >
        <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Analytics désactivées</h2>
        <p className="text-gray-400 mb-6">
          Tu as choisi de désactiver la collecte de données. Tu peux réactiver les analytics à tout
          moment pour accéder aux insights personnalisés.
        </p>

        <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
          <h3 className="text-white font-medium mb-2">Ce que tu manques :</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Graphiques de progression</li>
            <li>• Insights IA personnalisés</li>
            <li>• Rapports détaillés</li>
            <li>• Comparaisons de performance</li>
            <li>• Prédictions et recommandations</li>
          </ul>
        </div>

        <button
          onClick={onOptIn}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Réactiver les Analytics
        </button>

        <p className="text-xs text-gray-500 mt-4">Conforme RGPD • Données anonymisées • Sécurisé</p>
      </motion.div>
    </div>
  );
}

// Panneau de paramètres
function SettingsPanel({
  autoRefresh,
  refreshInterval,
  onAutoRefreshChange,
  onRefreshIntervalChange,
  onOptOut,
}: {
  autoRefresh: boolean;
  refreshInterval: number;
  onAutoRefreshChange: (enabled: boolean) => void;
  onRefreshIntervalChange: (seconds: number) => void;
  onOptOut: () => void;
}) {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paramètres Analytics</h2>
        <p className="text-gray-400">
          Configure tes préférences de collecte et d'affichage des données
        </p>
      </div>

      {/* Actualisation automatique */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Actualisation automatique</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-white">Actualisation automatique</span>
              <p className="text-sm text-gray-400">Actualise les données périodiquement</p>
            </div>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={e => onAutoRefreshChange(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
          </label>

          {autoRefresh && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block">
                <span className="text-white mb-2 block">Intervalle d'actualisation</span>
                <select
                  value={refreshInterval}
                  onChange={e => onRefreshIntervalChange(Number(e.target.value))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value={30}>30 secondes</option>
                  <option value={60}>1 minute</option>
                  <option value={300}>5 minutes</option>
                  <option value={600}>10 minutes</option>
                  <option value={1800}>30 minutes</option>
                </select>
              </label>
            </motion.div>
          )}
        </div>
      </div>

      {/* Confidentialité */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Confidentialité & Données</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2">🔒 Tes données sont protégées</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Chiffrement end-to-end</li>
              <li>• Stockage anonymisé</li>
              <li>• Conformité RGPD</li>
              <li>• Aucune vente à des tiers</li>
            </ul>
          </div>

          <button
            onClick={onOptOut}
            className="w-full p-3 bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
          >
            Désactiver complètement les Analytics
          </button>

          <p className="text-xs text-gray-500">
            En désactivant, tu perdras l'accès aux graphiques, insights et rapports personnalisés
          </p>
        </div>
      </div>

      {/* Export des données */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Export des données</h3>
        <p className="text-gray-400 text-sm mb-4">
          Télécharge tes données personnelles à tout moment (droit RGPD)
        </p>
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
            Export CSV
          </button>
          <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}
