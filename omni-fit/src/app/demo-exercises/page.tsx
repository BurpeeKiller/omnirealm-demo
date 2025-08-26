"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExerciseCard, ExerciseGrid } from "@/components/Exercise";
import {
  FREE_EXERCISES,
  PREMIUM_EXERCISES,
  getExercisesByCategory,
  getExercisesByDifficulty,
} from "@/data/exercises";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function DemoExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "Tous", count: FREE_EXERCISES.length + PREMIUM_EXERCISES.length },
    { id: "strength", name: "Force", count: getExercisesByCategory("strength").length },
    { id: "cardio", name: "Cardio", count: getExercisesByCategory("cardio").length },
    { id: "flexibility", name: "Souplesse", count: getExercisesByCategory("flexibility").length },
    { id: "breathing", name: "Respiration", count: getExercisesByCategory("breathing").length },
  ];

  const difficulties = [
    { id: "beginner", name: "Débutant", count: getExercisesByDifficulty("beginner").length },
    {
      id: "intermediate",
      name: "Intermédiaire",
      count: getExercisesByDifficulty("intermediate").length,
    },
    { id: "advanced", name: "Avancé", count: getExercisesByDifficulty("advanced").length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            🏋️‍♂️ Système d'Exercices Révolutionnaire
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Découvre notre collection complète de 21 exercices avec animations Framer Motion,
            feedback multisensoriel et expérience utilisateur Apple-style.
          </p>

          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge
              variant="outline"
              className="px-4 py-2 text-lg bg-blue-500/20 border-blue-500/50 text-blue-300"
            >
              {FREE_EXERCISES.length} Exercices Gratuits
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 text-lg bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
            >
              {PREMIUM_EXERCISES.length} Exercices Premium
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 text-lg bg-green-500/20 border-green-500/50 text-green-300"
            >
              Feedback Multisensoriel
            </Badge>
          </div>
        </motion.div>

        {/* Tabs pour organiser les exercices */}
        <Tabs defaultValue="free" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 mb-8">
            <TabsTrigger
              value="free"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300"
            >
              Gratuits ({FREE_EXERCISES.length})
            </TabsTrigger>
            <TabsTrigger
              value="premium"
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300"
            >
              Premium ({PREMIUM_EXERCISES.length})
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300"
            >
              Par Catégorie
            </TabsTrigger>
            <TabsTrigger
              value="showcase"
              className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              Démo Interactive
            </TabsTrigger>
          </TabsList>

          {/* Exercices Gratuits */}
          <TabsContent value="free">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-400 flex items-center gap-2">
                    🆓 Exercices Gratuits
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Exercices accessibles à tous, parfaits pour débuter ta transformation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExerciseGrid
                    exercises={FREE_EXERCISES}
                    variant="default"
                    showDetails={true}
                    columns={3}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Exercices Premium */}
          <TabsContent value="premium">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
                    💎 Exercices Premium
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Exercices avancés avec effets de glow et animations premium
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExerciseGrid
                    exercises={PREMIUM_EXERCISES}
                    variant="default"
                    showDetails={true}
                    columns={3}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Par Catégories */}
          <TabsContent value="categories">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {categories
                .filter(cat => cat.id !== "all")
                .map(category => {
                  const exercises = getExercisesByCategory(category.id as any);
                  if (exercises.length === 0) return null;

                  return (
                    <Card key={category.id} className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-2xl text-white flex items-center gap-2">
                          {category.id === "strength" && "💪"}
                          {category.id === "cardio" && "❤️"}
                          {category.id === "flexibility" && "🧘‍♂️"}
                          {category.id === "breathing" && "🫁"}
                          {category.name} ({category.count})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ExerciseGrid
                          exercises={exercises}
                          variant="compact"
                          showDetails={true}
                          columns={4}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
            </motion.div>
          </TabsContent>

          {/* Démo Interactive */}
          <TabsContent value="showcase">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Hero Exercise - Variante grande */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-400">
                    🌟 Exercice Héro - Variante Grande
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Démonstration de l'exercice en version héro avec tous les détails
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <ExerciseCard
                      exercise={FREE_EXERCISES[0]} // Squats
                      index={0}
                      variant="hero"
                      showDetails={true}
                      className="max-w-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Grille Compacte */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-400">
                    📱 Vue Compacte - Pour Mobile
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Format compact optimisé pour les écrans mobiles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExerciseGrid
                    exercises={FREE_EXERCISES.slice(0, 4)}
                    variant="compact"
                    columns={2}
                    className="max-w-2xl mx-auto"
                  />
                </CardContent>
              </Card>

              {/* Exercices Bureau */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-400">💼 Exercices de Bureau</CardTitle>
                  <CardDescription className="text-gray-300">
                    Exercices silencieux parfaits pour le bureau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExerciseGrid
                    exercises={FREE_EXERCISES.filter(
                      ex =>
                        ex.equipment.length === 0 &&
                        !ex.name.toLowerCase().includes("burpee") &&
                        !ex.name.toLowerCase().includes("saut")
                    )}
                    variant="default"
                    showDetails={true}
                    columns={3}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Footer avec statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {difficulties.map(diff => (
              <Card key={diff.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-white mb-1">{diff.count}</div>
                  <div className="text-sm text-gray-400">{diff.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-gray-400">
            <p className="mb-2">
              🎯 Système d'exercices révolutionnaire avec animations Framer Motion
            </p>
            <p className="mb-2">🔊 Feedback audio et haptique pour une expérience immersive</p>
            <p>💎 Effets premium avec particules et glow pour les abonnés</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
