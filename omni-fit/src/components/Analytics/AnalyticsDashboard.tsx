"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Calendar,
  Award,
  Download,
  Brain,
  Users,
  Clock,
  Flame,
} from "lucide-react";
import { analytics } from "@/services/analytics";
import type { InsightData, RecommendationData, PredictionData } from "@/services/analytics";

interface AnalyticsDashboardProps {
  className?: string;
}

const COLORS = {
  primary: "#8B5CF6",
  secondary: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  burpees: "#8B5CF6",
  pushups: "#06B6D4",
  squats: "#10B981",
  others: "#F59E0B",
};

const CHART_COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];

export function AnalyticsDashboard({ className = "" }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "detailed" | "insights" | "realtime">(
    "overview"
  );
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<{
    insights: InsightData[];
    recommendations: RecommendationData[];
    predictions: PredictionData[];
    benchmarks: any;
  } | null>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);

  useEffect(() => {
    loadData();
    loadInsights();

    if (activeTab === "realtime") {
      loadRealTimeData();
      const interval = setInterval(loadRealTimeData, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [timeRange, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dailyData, weeklyData] = await Promise.all([
        analytics.getDailyMetrics(),
        analytics.getWeeklyMetrics(timeRange === "7d" ? 1 : timeRange === "30d" ? 4 : 12),
      ]);
      setData({ daily: dailyData, weekly: weeklyData });
    } catch (error) {
      console.error("Failed to load analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async () => {
    try {
      const insightsData = await analytics.getInsights();
      setInsights(insightsData);
    } catch (error) {
      console.error("Failed to load insights:", error);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const rtData = await analytics.getRealTimeStats();
      setRealTimeData(rtData);
    } catch (error) {
      console.error("Failed to load real-time data:", error);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const period = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      if (format === "csv") {
        await analytics.exportCSV(period);
      } else {
        await analytics.exportPDF(period);
      }
    } catch (error) {
      console.error(`Export ${format} failed:`, error);
    }
  };

  if (loading && !data) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Vue d'ensemble de tes performances et progrès</p>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 lg:mt-0">
          {/* Time Range Selector */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            {(["7d", "30d", "90d"] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  timeRange === range
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {range === "7d" ? "7 jours" : range === "30d" ? "30 jours" : "3 mois"}
              </button>
            ))}
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleExport("csv")}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Rapport PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        {[
          { id: "overview", label: "Vue d'ensemble", icon: BarChart },
          { id: "detailed", label: "Analyse détaillée", icon: TrendingUp },
          { id: "insights", label: "Insights IA", icon: Brain },
          { id: "realtime", label: "Temps réel", icon: Zap },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === id
                ? "border-purple-600 text-purple-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && <OverviewTab key="overview" data={data} />}
        {activeTab === "detailed" && <DetailedTab key="detailed" data={data} />}
        {activeTab === "insights" && <InsightsTab key="insights" insights={insights} />}
        {activeTab === "realtime" && <RealTimeTab key="realtime" data={realTimeData} />}
      </AnimatePresence>
    </div>
  );
}

// Vue d'ensemble
function OverviewTab({ data }: { data: any }) {
  if (!data) return null;

  const kpis = [
    {
      label: "Exercices aujourd'hui",
      value: data.daily?.totalExercises || 0,
      trend: "+12%",
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Calories brûlées",
      value: `${data.daily?.caloriesBurned || 0}`,
      trend: "+8%",
      icon: Flame,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Série actuelle",
      value: `${data.weekly?.trends?.currentStreak || 0} jours`,
      trend: "Stable",
      icon: Award,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Temps total",
      value: `${Math.round((data.daily?.duration || 0) / 60)}min`,
      trend: "+15%",
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`p-6 rounded-xl ${kpi.bgColor} border border-gray-700`}
          >
            <div className="flex items-center justify-between mb-4">
              <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
              <span
                className={`text-sm ${kpi.trend.startsWith("+") ? "text-green-400" : kpi.trend.startsWith("-") ? "text-red-400" : "text-gray-400"}`}
              >
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
            <div className="text-sm text-gray-400">{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Progress */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Progression hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data.weekly?.weeklyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="weekNumber" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="exercises"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Exercise Distribution */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Répartition des exercices</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={Object.entries(data.daily?.exerciseBreakdown || {}).map(([key, value]) => ({
                  name: key,
                  value,
                  color: COLORS[key as keyof typeof COLORS] || COLORS.others,
                }))}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
              >
                {Object.entries(data.daily?.exerciseBreakdown || {}).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Objectif quotidien</h3>
          <span className="text-sm text-gray-400">
            {data.daily?.totalExercises || 0}/10 exercices
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-cyan-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(data.daily?.goalProgress || 0, 100)}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-500">
          {(data.daily?.goalProgress || 0).toFixed(1)}% complété
        </div>
      </div>
    </motion.div>
  );
}

// Analyse détaillée
function DetailedTab({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Heatmap Calendar - GitHub Style */}
      <HeatmapCalendar data={data} />

      {/* Performance Trends */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Tendances de performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.weekly?.weeklyData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="weekNumber" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="exercises"
              stroke={COLORS.primary}
              strokeWidth={2}
              dot={{ fill: COLORS.primary, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke={COLORS.secondary}
              strokeWidth={2}
              dot={{ fill: COLORS.secondary, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h4 className="text-white font-semibold mb-4">Résumé de période</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total séances</span>
              <span className="text-white">{data.weekly?.summary?.totalWorkouts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total exercices</span>
              <span className="text-white">{data.weekly?.summary?.totalExercises || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Jours actifs</span>
              <span className="text-white">{data.weekly?.summary?.totalActiveDays || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Moyenne/semaine</span>
              <span className="text-white">
                {data.weekly?.trends?.averageWorkoutsPerWeek?.toFixed(1) || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h4 className="text-white font-semibold mb-4">Meilleure semaine</h4>
          {data.weekly?.trends?.bestWeek ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Période</span>
                <span className="text-white text-sm">{data.weekly.trends.bestWeek.week}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Exercices</span>
                <span className="text-white">{data.weekly.trends.bestWeek.exercises}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Séances</span>
                <span className="text-white">{data.weekly.trends.bestWeek.workouts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Jours actifs</span>
                <span className="text-white">{data.weekly.trends.bestWeek.activeDays}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Pas assez de données</p>
          )}
        </div>

        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h4 className="text-white font-semibold mb-4">Tendances</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Évolution hebdo</span>
              <div className="flex items-center gap-1">
                {(data.weekly?.trends?.weekOverWeekGrowth || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span
                  className={`text-sm ${(data.weekly?.trends?.weekOverWeekGrowth || 0) >= 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {(data.weekly?.trends?.weekOverWeekGrowth || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Série actuelle</span>
              <span className="text-white">{data.weekly?.trends?.currentStreak || 0} jours</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Heatmap Calendar (GitHub Style)
function HeatmapCalendar({ data }: { data: any }) {
  // Générer les données pour les 365 derniers jours
  const generateHeatmapData = () => {
    const days = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Simuler des données d'activité
      const intensity = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;

      days.push({
        date: date.toISOString().split("T")[0],
        intensity,
        count: intensity * Math.floor(Math.random() * 10) + intensity,
      });
    }

    return days;
  };

  const heatmapData = generateHeatmapData();
  const getIntensityColor = (intensity: number) => {
    const colors = ["#161B22", "#0E4429", "#006D32", "#26A641", "#39D353"];
    return colors[intensity] || colors[0];
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Calendrier d'activité</h3>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-53 gap-1 min-w-[800px]">
          {heatmapData.map((day, index) => (
            <div
              key={day.date}
              className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-110"
              style={{ backgroundColor: getIntensityColor(day.intensity) }}
              title={`${day.date}: ${day.count} exercices`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
          <span>Moins</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(intensity => (
              <div
                key={intensity}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getIntensityColor(intensity) }}
              />
            ))}
          </div>
          <span>Plus</span>
        </div>
      </div>
    </div>
  );
}

// Insights IA Tab
function InsightsTab({ insights }: { insights: any }) {
  if (!insights) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Chargement des insights IA...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Insights */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">🧠 Insights personnalisés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.insights?.map((insight: InsightData, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                insight.impact === "high"
                  ? "bg-red-500/10 border-red-500/30"
                  : insight.impact === "medium"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-blue-500/10 border-blue-500/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${
                    insight.type === "achievement"
                      ? "bg-green-500/20 text-green-400"
                      : insight.type === "warning"
                        ? "bg-red-500/20 text-red-400"
                        : insight.type === "progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {insight.type === "achievement" && <Award className="w-4 h-4" />}
                  {insight.type === "warning" && <TrendingDown className="w-4 h-4" />}
                  {insight.type === "progress" && <TrendingUp className="w-4 h-4" />}
                  {insight.type === "performance" && <Zap className="w-4 h-4" />}
                  {insight.type === "consistency" && <Calendar className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{insight.title}</h4>
                  <p className="text-gray-300 text-sm mb-2">{insight.message}</p>
                  {insight.recommendation && (
                    <p className="text-gray-400 text-xs italic">{insight.recommendation}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">💡 Recommandations</h3>
        <div className="space-y-4">
          {insights.recommendations?.map((rec: RecommendationData, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 p-6 rounded-xl border border-gray-700"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-white font-semibold">{rec.title}</h4>
                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : rec.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      rec.difficulty === "hard"
                        ? "bg-red-500/20 text-red-400"
                        : rec.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {rec.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mb-3">{rec.message}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-400">{rec.estimatedImpact}</span>
                <span className="text-xs text-gray-500">{rec.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Predictions */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">🔮 Prédictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.predictions?.map((pred: PredictionData, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 p-6 rounded-xl border border-purple-500/30"
            >
              <h4 className="text-white font-semibold mb-2">{pred.title}</h4>
              <p className="text-gray-300 mb-3">{pred.message}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-purple-400">{pred.timeframe}</span>
                <span className="text-gray-400">
                  {Math.round(pred.confidence * 100)}% confiance
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benchmarks */}
      {insights.benchmarks && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">📊 Benchmarks communautaires</h3>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  #{insights.benchmarks.userRank}
                </div>
                <div className="text-sm text-gray-400">Classement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {insights.benchmarks.percentile}%
                </div>
                <div className="text-sm text-gray-400">Percentile</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {insights.benchmarks.userAverage.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Ta moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 mb-1">
                  {insights.benchmarks.communityAverage}
                </div>
                <div className="text-sm text-gray-400">Moyenne communauté</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-white font-medium">{insights.benchmarks.message}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Temps réel Tab
function RealTimeTab({ data }: { data: any }) {
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-400">Chargement des données temps réel...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-green-400" />
              <span className="text-sm text-gray-400">Utilisateurs actifs</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{data.activeUsers}</div>
            <div className="text-sm text-green-400">🟢 En ligne maintenant</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/10 rounded-full blur-xl"></div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-gray-400">Workouts aujourd'hui</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{data.workoutsToday}</div>
            <div className="text-sm text-purple-400">📈 +12% vs hier</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-xl"></div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-sm text-gray-400">Exercices/min</span>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{data.exercisesPerMinute}</div>
            <div className="text-sm text-yellow-400">⚡ Temps réel</div>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Popular Exercises */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          🔥 Exercices populaires (temps réel)
        </h3>
        <div className="space-y-4">
          {data.popularExercises?.map((exercise: any, index: number) => (
            <motion.div
              key={exercise.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    index === 0
                      ? "bg-yellow-400"
                      : index === 1
                        ? "bg-gray-300"
                        : index === 2
                          ? "bg-orange-400"
                          : "bg-gray-600"
                  } animate-pulse`}
                ></div>
                <span className="text-white font-medium">{exercise.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{exercise.count}</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">📡 Activité en temps réel</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {/* Simuler un feed d'activité */}
          {[
            { user: "Alex", action: "a terminé 15 burpees", time: "à l'instant" },
            { user: "Sarah", action: "a battu son record de pompes", time: "il y a 2 min" },
            { user: "Mike", action: "a débloqué le niveau 5", time: "il y a 3 min" },
            { user: "Emma", action: "a terminé un workout de 20min", time: "il y a 5 min" },
            { user: "Tom", action: "a atteint une série de 7 jours", time: "il y a 8 min" },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {activity.user[0]}
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">{activity.user}</span>
                <span className="text-gray-300"> {activity.action}</span>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
