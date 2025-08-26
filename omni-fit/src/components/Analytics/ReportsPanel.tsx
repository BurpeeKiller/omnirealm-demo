"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  Share2,
  Mail,
  Clock,
  Target,
  Zap,
  Brain,
} from "lucide-react";
import { analytics } from "@/services/analytics";

interface ReportsPanelProps {
  className?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  isPremium: boolean;
  estimatedTime: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "performance-summary",
    name: "Résumé de Performance",
    description: "Vue d'ensemble complète de tes progrès et statistiques",
    icon: TrendingUp,
    features: [
      "Métriques clés",
      "Graphiques de progression",
      "Comparaisons périodiques",
      "Objectifs",
    ],
    isPremium: false,
    estimatedTime: "30 jours",
  },
  {
    id: "ai-insights-report",
    name: "Rapport d'Insights IA",
    description: "Analyse approfondie avec recommandations personnalisées",
    icon: Brain,
    features: ["Insights IA", "Prédictions", "Recommandations", "Benchmarks communautaires"],
    isPremium: true,
    estimatedTime: "90 jours",
  },
  {
    id: "achievement-showcase",
    name: "Vitrine des Accomplissements",
    description: "Célèbre tes réussites et records personnels",
    icon: Award,
    features: ["Badges débloqués", "Records battus", "Séries accomplies", "Milestones"],
    isPremium: false,
    estimatedTime: "Tout temps",
  },
  {
    id: "detailed-analytics",
    name: "Analytics Détaillées",
    description: "Analyse technique complète pour les utilisateurs avancés",
    icon: Target,
    features: ["Heatmaps", "Cohort analysis", "Retention metrics", "A/B test results"],
    isPremium: true,
    estimatedTime: "90 jours",
  },
];

const exportFormats = [
  { id: "pdf", name: "PDF", icon: FileText, description: "Rapport formaté pour impression" },
  { id: "csv", name: "CSV", icon: Download, description: "Données brutes pour analyse" },
] as const;

export function ReportsPanel({ className = "" }: ReportsPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(reportTemplates[0].id);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "csv">("pdf");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  const selectedTemplateData = reportTemplates.find(t => t.id === selectedTemplate);

  useEffect(() => {
    // Simuler des rapports récents
    setRecentReports([
      {
        id: "1",
        name: "Résumé Performance - Janvier 2025",
        type: "performance-summary",
        format: "pdf",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        size: "2.4 MB",
        downloads: 3,
      },
      {
        id: "2",
        name: "Données Export - Décembre 2024",
        type: "detailed-analytics",
        format: "csv",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        size: "156 KB",
        downloads: 1,
      },
    ]);
  }, []);

  const generateReport = async () => {
    if (!selectedTemplateData) return;

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulation du processus de génération
      const steps = [
        "Collecte des données...",
        "Analyse des métriques...",
        "Génération des graphiques...",
        "Application du template...",
        "Création du fichier...",
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(((i + 1) / steps.length) * 100);
      }

      // Déclencher le téléchargement réel
      const period =
        timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365;

      if (selectedFormat === "pdf") {
        await analytics.exportPDF(period);
      } else {
        await analytics.exportCSV(period);
      }

      // Ajouter à la liste des rapports récents
      const newReport = {
        id: Date.now().toString(),
        name: `${selectedTemplateData.name} - ${new Date().toLocaleDateString("fr-FR")}`,
        type: selectedTemplate,
        format: selectedFormat,
        createdAt: new Date(),
        size: selectedFormat === "pdf" ? "2.1 MB" : "89 KB",
        downloads: 1,
      };

      setRecentReports(prev => [newReport, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  return (
    <div className={`p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Rapports & Exports</h1>
          <p className="text-gray-400">Génère des rapports détaillés de tes performances</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Choisir un template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map(template => (
                  <motion.div
                    key={template.id}
                    layoutId={`template-${template.id}`}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          selectedTemplate === template.id ? "bg-purple-500/20" : "bg-gray-600/50"
                        }`}
                      >
                        <template.icon
                          className={`w-5 h-5 ${
                            selectedTemplate === template.id ? "text-purple-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-white text-sm">{template.name}</h4>
                          {template.isPremium && (
                            <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{template.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {template.estimatedTime}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 2).map(feature => (
                          <span
                            key={feature}
                            className="text-xs px-2 py-0.5 bg-gray-600/50 text-gray-300 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {template.features.length > 2 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-600/50 text-gray-300 rounded">
                            +{template.features.length - 2} autres
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Format Selection */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Format</h3>
                <div className="space-y-3">
                  {exportFormats.map(format => (
                    <label
                      key={format.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format.id}
                        checked={selectedFormat === format.id}
                        onChange={e => setSelectedFormat(e.target.value as "pdf" | "csv")}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <format.icon className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-white font-medium">{format.name}</div>
                        <div className="text-xs text-gray-400">{format.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Période</h3>
                <div className="space-y-2">
                  {[
                    { value: "7d", label: "7 derniers jours", icon: "📅" },
                    { value: "30d", label: "30 derniers jours", icon: "🗓️" },
                    { value: "90d", label: "3 derniers mois", icon: "📊" },
                    { value: "all", label: "Tout l'historique", icon: "📈" },
                  ].map(range => (
                    <label
                      key={range.value}
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700/30 transition-colors"
                    >
                      <input
                        type="radio"
                        name="timeRange"
                        value={range.value}
                        checked={timeRange === range.value}
                        onChange={e => setTimeRange(e.target.value as any)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-lg">{range.icon}</span>
                      <span className="text-white">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Generation Button */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Génération</h3>
                  {selectedTemplateData && (
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedTemplateData.name} • {selectedFormat.toUpperCase()} •{" "}
                      {timeRange === "7d"
                        ? "7 jours"
                        : timeRange === "30d"
                          ? "30 jours"
                          : timeRange === "90d"
                            ? "3 mois"
                            : "Tout l'historique"}
                    </p>
                  )}
                </div>
                <button
                  onClick={generateReport}
                  disabled={isGenerating || !selectedTemplateData}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Générer le rapport
                    </>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progression</span>
                    <span className="text-white">{Math.round(generationProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            {selectedTemplateData && (
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Aperçu</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <selectedTemplateData.icon className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">{selectedTemplateData.name}</div>
                      <div className="text-xs text-gray-400">
                        {selectedTemplateData.description}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-white mb-2">Inclus :</div>
                    <ul className="space-y-1">
                      {selectedTemplateData.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-gray-300">
                          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedTemplateData.isPremium && (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-purple-400 text-sm">
                        <Zap className="w-4 h-4" />
                        Fonctionnalité Premium
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Reports */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Rapports récents</h3>
              <div className="space-y-3">
                {recentReports.length > 0 ? (
                  recentReports.map(report => (
                    <div
                      key={report.id}
                      className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white mb-1">{report.name}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <FileText className="w-3 h-3" />
                            {report.format.toUpperCase()} • {report.size}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {report.createdAt.toLocaleDateString("fr-FR")} • {report.downloads}{" "}
                            téléchargements
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-white transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun rapport généré</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">Partager sur les réseaux</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">Envoyer par email</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm">Programmer l\'envoi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
