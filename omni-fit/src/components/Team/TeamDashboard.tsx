"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  Award,
  Clock,
  Heart,
  Calendar,
  Target,
  Zap,
  Trophy,
  Activity,
  BarChart3,
  Download,
  Settings,
  Crown,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: "beginner" | "intermediate" | "advanced";
  currentStreak: number;
  totalExercises: number;
  weeklyGoal: number;
  weeklyProgress: number;
  lastActivity: Date;
  department: string;
  isActive: boolean;
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalExercises: number;
  averageStreak: number;
  weeklyEngagement: number;
  wellnessScore: number;
  departmentLeadership: Record<string, number>;
  trendData: Array<{
    date: string;
    exercises: number;
    engagement: number;
    satisfaction: number;
  }>;
}

interface TeamDashboardProps {
  teamId: string;
  isManager?: boolean;
  className?: string;
}

export function TeamDashboard({ teamId, isManager = false, className = "" }: TeamDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("week");
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - In real app, fetch from API
  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setTeamStats({
        totalMembers: 48,
        activeMembers: 42,
        totalExercises: 1247,
        averageStreak: 12,
        weeklyEngagement: 87,
        wellnessScore: 8.4,
        departmentLeadership: {
          Tech: 92,
          Marketing: 84,
          Sales: 78,
          HR: 95,
          Finance: 71,
        },
        trendData: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          exercises: Math.floor(Math.random() * 200) + 100,
          engagement: Math.floor(Math.random() * 30) + 70,
          satisfaction: Math.floor(Math.random() * 2) + 8,
        })),
      });

      setTeamMembers([
        {
          id: "1",
          name: "Marie Dubois",
          email: "marie@company.com",
          avatar: "MD",
          level: "advanced",
          currentStreak: 23,
          totalExercises: 156,
          weeklyGoal: 15,
          weeklyProgress: 12,
          lastActivity: new Date(),
          department: "Tech",
          isActive: true,
        },
        {
          id: "2",
          name: "Thomas Martin",
          email: "thomas@company.com",
          avatar: "TM",
          level: "intermediate",
          currentStreak: 8,
          totalExercises: 89,
          weeklyGoal: 10,
          weeklyProgress: 7,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
          department: "Marketing",
          isActive: true,
        },
        // Add more members...
      ]);

      setLoading(false);
    };

    fetchTeamData();
  }, [teamId, dateRange]);

  if (loading || !teamStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
            <Activity className="w-6 h-6 text-[#00D9B1]" />
          </motion.div>
          <span className="text-gray-600">Chargement des données...</span>
        </div>
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
    color = "text-[#00D9B1]",
    format = "number",
  }: any) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {format === "percentage"
              ? `${value}%`
              : format === "decimal"
                ? `${value}/10`
                : value.toLocaleString("fr-FR")}
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#00D9B1]" />
            Dashboard Équipe
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Enterprise
            </Badge>
          </h1>
          <p className="text-gray-600 mt-1">
            Suivi du bien-être et de l'engagement de votre équipe
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>

          {isManager && (
            <>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Membres actifs"
          value={teamStats.activeMembers}
          change={8}
          color="text-[#00D9B1]"
        />
        <StatCard
          icon={Activity}
          title="Exercices total"
          value={teamStats.totalExercises}
          change={12}
          color="text-blue-600"
        />
        <StatCard
          icon={Zap}
          title="Engagement moyen"
          value={teamStats.weeklyEngagement}
          change={5}
          color="text-yellow-600"
          format="percentage"
        />
        <StatCard
          icon={Heart}
          title="Score bien-être"
          value={teamStats.wellnessScore}
          change={3}
          color="text-pink-600"
          format="decimal"
        />
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="members">Équipe</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Engagement Trend */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tendance d'engagement</h3>
                <Badge variant="secondary">7 derniers jours</Badge>
              </div>

              <div className="space-y-4">
                {teamStats.trendData.map((day, idx) => (
                  <div key={day.date} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {new Date(day.date).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="font-medium text-gray-900">{day.exercises} exercices</span>
                    </div>
                    <Progress value={(day.exercises / 200) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Performers */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>

              <div className="space-y-4">
                {teamMembers
                  .sort((a, b) => b.currentStreak - a.currentStreak)
                  .slice(0, 5)
                  .map((member, idx) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : idx === 1
                                ? "bg-gray-100 text-gray-800"
                                : idx === 2
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-r from-[#00D9B1] to-[#00B89F] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.department}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{member.currentStreak}</div>
                        <div className="text-xs text-gray-500">jours</div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* Department Performance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance par département</h3>
              <BarChart3 className="w-5 h-5 text-[#00D9B1]" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(teamStats.departmentLeadership).map(([dept, score]) => (
                <div key={dept} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-[#E6FFF9] to-[#E6F7FF] rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#00B89F]">{score}</span>
                  </div>
                  <div className="font-medium text-gray-900">{dept}</div>
                  <div className="text-xs text-gray-500">Score wellness</div>
                  <Progress value={score} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Membres de l'équipe ({teamMembers.length})
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{teamStats.activeMembers} actifs</Badge>
                {isManager && (
                  <Button size="sm" variant="outline">
                    Inviter des membres
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Membre</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Niveau</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Série actuelle
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cette semaine</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      Dernière activité
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map(member => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#00D9B1] to-[#00B89F] rounded-full flex items-center justify-center text-white font-semibold">
                            {member.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            member.level === "advanced"
                              ? "default"
                              : member.level === "intermediate"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {member.level === "advanced"
                            ? "Avancé"
                            : member.level === "intermediate"
                              ? "Intermédiaire"
                              : "Débutant"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-500" />
                          <span className="font-semibold text-gray-900">
                            {member.currentStreak}
                          </span>
                          <span className="text-gray-500 text-sm">jours</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {member.weeklyProgress}/{member.weeklyGoal}
                            </span>
                            <span className="text-gray-500">
                              {Math.round((member.weeklyProgress / member.weeklyGoal) * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={(member.weeklyProgress / member.weeklyGoal) * 100}
                            className="h-2"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(member.lastActivity).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            member.isActive ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Other tabs content... */}
        <TabsContent value="departments">
          <Card className="p-6">
            <p className="text-gray-600">Analyse détaillée par département à venir...</p>
          </Card>
        </TabsContent>

        <TabsContent value="challenges">
          <Card className="p-6">
            <p className="text-gray-600">Challenges et compétitions d'équipe à venir...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
