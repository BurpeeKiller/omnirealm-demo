"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface BreakdownData {
  [key: string]: number;
}

interface ExerciseBreakdownProps {
  data: BreakdownData;
  title: string;
  type: "category" | "difficulty";
}

export function ExerciseBreakdown({ data, title, type }: ExerciseBreakdownProps) {
  const colors = {
    category: {
      strength: "#FF6B6B",
      cardio: "#4ECDC4",
      flexibility: "#45B7D1",
      breathing: "#96CEB4",
      balance: "#FFEAA7",
    },
    difficulty: {
      beginner: "#55A3FF",
      intermediate: "#FFA726",
      advanced: "#EF5350",
    },
  };

  const emojis = {
    category: {
      strength: "💪",
      cardio: "❤️",
      flexibility: "🤸",
      breathing: "🧘",
      balance: "⚖️",
    },
    difficulty: {
      beginner: "🟢",
      intermediate: "🟡",
      advanced: "🔴",
    },
  };

  const labels = {
    category: {
      strength: "Force",
      cardio: "Cardio",
      flexibility: "Souplesse",
      breathing: "Respiration",
      balance: "Équilibre",
    },
    difficulty: {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
    },
  };

  const pieData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
    label: labels[type][key as keyof (typeof labels)[typeof type]] || key,
    emoji: emojis[type][key as keyof (typeof emojis)[typeof type]] || "",
    color: colors[type][key as keyof (typeof colors)[typeof type]] || "#8884d8",
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">
            {data.emoji} {data.label}
          </p>
          <p className="text-sm text-blue-600">{data.value} exercices</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>
              {entry.payload.emoji} {entry.payload.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const totalExercises = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <Card className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{totalExercises} exercices au total</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
