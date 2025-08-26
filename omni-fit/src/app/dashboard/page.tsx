"use client";

export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Play,
  Pause,
  BarChart3,
  Settings,
  Timer,
  Flame,
  Target,
  Trophy,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Dumbbell,
  Activity,
  ChevronRight,
  Star,
  Lock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExerciseCard } from "@/components/Exercise/ExerciseCard-Simple";
import { UpgradePrompt } from "@/components/Premium/UpgradePrompt-Simple";
import { PremiumBadge } from "@/components/Premium/PremiumBadge-Simple";
import { ReminderTimer } from "@/components/ReminderTimer";
import { AnalyticsSection } from "@/components/Dashboard/AnalyticsSection";
import { SettingsSection } from "@/components/Dashboard/SettingsSection";
import { WorkoutSection } from "@/components/Dashboard/WorkoutSection";
import { PricingSection } from "@/components/Dashboard/PricingSection";

// Import des stores refactorisés
import { useExercisesStore } from "@/stores/exercises.store";
import { useGamificationStore } from "@/stores/gamification.store";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "strength", name: "Force", emoji: "💪" },
  { id: "cardio", name: "Cardio", emoji: "❤️" },
  { id: "flexibility", name: "Souplesse", emoji: "🤸" },
  { id: "breathing", name: "Respiration", emoji: "🧘" },
  { id: "balance", name: "Équilibre", emoji: "⚖️" },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Stores
  const {
    exerciseTemplates,
    dailyStats,
    weeklyStats,
    isLoadingTemplates,
    isLoadingStats,
    loadExerciseTemplates,
    loadDailyStats,
    loadWeeklyStats,
  } = useExercisesStore();

  const gamificationStore = useGamificationStore();
  const authStore = useAuthStore();

  // Données extraites des stores
  const todayTotal = dailyStats?.totalCount || 0;
  const currentLevel = gamificationStore.userProgress.currentLevel || 1;
  const totalPoints = gamificationStore.userProgress.totalPoints || 0;
  const currentStreak = gamificationStore.userProgress.stats.currentStreak || 0;
  const showCelebration = gamificationStore.showCelebration || false;

  const isPremium = authStore.isPremium || false;
  const showUpgradePrompt = authStore.showUpgradePrompt || false;

  // État local
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [greeting, setGreeting] = useState("");
  const [activeSection, setActiveSection] = useState<
    "exercices" | "workout" | "analytics" | "settings" | "pricing"
  >("exercices");

  // Charger les données au montage
  useEffect(() => {
    console.log("🏠 Dashboard: Loading data on mount");
    console.log("🏠 Dashboard: Session data:", {
      user: session?.user?.name,
      status,
      isPremium,
    });

    loadExerciseTemplates();
    loadDailyStats();
    loadWeeklyStats();
  }, [loadExerciseTemplates, loadDailyStats, loadWeeklyStats, session, status, isPremium]);

  // Greeting basé sur l'heure
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  // Filtrer les exercices par catégorie
  const filteredExercises =
    selectedCategory === "all"
      ? exerciseTemplates
      : exerciseTemplates.filter(ex => ex.category === selectedCategory);

  // Progress calculation
  const dailyGoal = 300; // Points journaliers
  const progressPercent = Math.min(100, Math.round((todayTotal / dailyGoal) * 100));
  const userName = session?.user?.name?.split(" ")[0] || "Athlète";

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-300">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Connexion requise</h1>
          <p className="text-gray-300">Vous devez être connecté pour accéder à votre dashboard.</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header avec gamification */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-[#00D9B1]/50">
                <AvatarImage src={session.user?.image || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-[#00D9B1] to-[#00B89F] text-white text-sm font-bold">
                  {userName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold text-[#2D3436] flex items-center gap-2">
                  {greeting} {userName}
                  {isPremium && <PremiumBadge />}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-[#FDCB6E]" />
                    <span className="text-sm text-[#636E72]">Niveau {currentLevel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-[#E17055]" />
                    <span className="text-sm text-[#636E72]">{currentStreak} jours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#74B9FF]" />
                    <span className="text-sm text-[#636E72]">{totalPoints} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#636E72]">Objectif journalier</span>
              <span className="text-sm text-[#636E72]">
                {todayTotal} / {dailyGoal} points
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00D9B1] to-[#00B89F] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 pb-20 overflow-y-auto">
        {/* ReminderTimer en haut - uniquement sur la page exercices */}
        {activeSection === "exercices" && <ReminderTimer />}

        <div className="max-w-7xl mx-auto space-y-6 px-4">
          {/* Rendu conditionnel des sections */}
          {activeSection === "exercices" && (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-[#00D9B1]" />
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <span className="text-2xl font-bold text-[#2D3436]">
                        {dailyStats?.exercisesCompleted || 0}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm text-[#636E72]">Exercices aujourd'hui</h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Timer className="w-8 h-8 text-[#74B9FF]" />
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <span className="text-2xl font-bold text-[#2D3436]">
                        {dailyStats?.timeSpent || 0}m
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm text-[#636E72]">Temps d'entraînement</h3>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 text-[#E17055]" />
                    {isLoadingStats ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <span className="text-2xl font-bold text-[#2D3436]">
                        {weeklyStats ? Math.round(weeklyStats.average) : 0}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm text-[#636E72]">Moyenne hebdomadaire</h3>
                </motion.div>
              </div>

              {/* Catégories */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#2D3436]">Choisir une catégorie</h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    size="sm"
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                    className={
                      selectedCategory === "all"
                        ? "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] text-white border-0"
                        : "border-gray-300 text-[#636E72] bg-white hover:bg-[#E6FFF9] hover:border-[#00D9B1]"
                    }
                  >
                    Tous
                  </Button>
                  {CATEGORIES.map(category => (
                    <Button
                      key={category.id}
                      size="sm"
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className={
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-[#00D9B1] to-[#00B89F] text-white border-0"
                          : "border-gray-300 text-[#636E72] bg-white hover:bg-[#E6FFF9] hover:border-[#00D9B1]"
                      }
                    >
                      {category.emoji} {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Grille d'exercices */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#2D3436]">Exercices disponibles</h2>
                  {!isPremium && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveSection("pricing")}
                      className="text-[#FDCB6E] hover:text-[#E84393]"
                    >
                      <Crown className="w-4 h-4 mr-1" />
                      Débloquer tout
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {isLoadingTemplates
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton key={index} className="h-48 w-full rounded-xl" />
                      ))
                    : filteredExercises.map((exercise, index) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          index={index}
                          variant="default"
                          showDetails={true}
                        />
                      ))}
                </div>
              </div>

              {/* CTA Premium si non premium */}
              {!isPremium && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#FFF5D6] to-[#FFE8CC] rounded-xl p-6 border border-[#FDCB6E]/30 text-center shadow-sm"
                >
                  <Crown className="w-12 h-12 text-[#FDCB6E] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#2D3436] mb-2">
                    Débloquez votre potentiel complet
                  </h3>
                  <p className="text-[#636E72] mb-4">
                    Accédez à tous les exercices premium, programmes personnalisés et analyses
                    détaillées
                  </p>
                  <Button
                    onClick={() => setActiveSection("pricing")}
                    className="bg-gradient-to-r from-[#FDCB6E] to-[#E84393] hover:from-[#FDCB6E]/90 hover:to-[#E84393]/90 text-white font-bold"
                  >
                    Passer à Premium
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </>
          )}

          {/* Section Analytics */}
          {activeSection === "analytics" && <AnalyticsSection />}

          {/* Section Settings */}
          {activeSection === "settings" && <SettingsSection />}

          {/* Section Workout */}
          {activeSection === "workout" && <WorkoutSection />}

          {/* Section Pricing */}
          {activeSection === "pricing" && <PricingSection />}
        </div>
      </main>

      {/* Navigation Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 safe-bottom shadow-lg">
        <div className="flex justify-around py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("exercices")}
            className={`flex-col gap-1 h-auto py-2 transition-colors ${
              activeSection === "exercices"
                ? "text-[#00D9B1]"
                : "text-[#636E72] hover:text-[#00D9B1]"
            }`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs">Exercices</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("workout")}
            className={`flex-col gap-1 h-auto py-2 transition-colors ${
              activeSection === "workout" ? "text-[#74B9FF]" : "text-[#636E72] hover:text-[#74B9FF]"
            }`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs">Séance</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("analytics")}
            className={`flex-col gap-1 h-auto py-2 transition-colors ${
              activeSection === "analytics"
                ? "text-[#00D9B1]"
                : "text-[#636E72] hover:text-[#00D9B1]"
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Stats</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("settings")}
            className={`flex-col gap-1 h-auto py-2 transition-colors ${
              activeSection === "settings"
                ? "text-[#00D9B1]"
                : "text-[#636E72] hover:text-[#00D9B1]"
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs">Réglages</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection("pricing")}
            className={`flex-col gap-1 h-auto py-2 transition-colors ${
              activeSection === "pricing" ? "text-[#FDCB6E]" : "text-[#636E72] hover:text-[#FDCB6E]"
            }`}
          >
            <Crown className="w-6 h-6" />
            <span className="text-xs">Premium</span>
          </Button>
        </div>
      </nav>

      {/* Upgrade Prompt Modal */}
      <AnimatePresence>{showUpgradePrompt && <UpgradePrompt />}</AnimatePresence>

      {/* Celebration Effect */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {/* Confetti or celebration animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1 }}
                className="text-6xl"
              >
                🎉
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
