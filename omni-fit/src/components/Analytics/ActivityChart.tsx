"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/card";

interface ActivityData {
  date: string;
  sessions: number;
  duration: number;
  calories: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  type?: "line" | "bar";
  metric?: "sessions" | "duration" | "calories";
  title?: string;
  color?: string;
}

export function ActivityChart({
  data,
  type = "line",
  metric = "sessions",
  title = "Activité quotidienne",
  color = "#00D9B1",
}: ActivityChartProps) {
  const formatValue = (value: number) => {
    switch (metric) {
      case "duration":
        return `${Math.round(value / 60)}min`;
      case "calories":
        return `${value}cal`;
      default:
        return value.toString();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{formatDate(label)}</p>
          <p className="text-sm text-blue-600">{formatValue(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis tickFormatter={value => formatValue(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={metric}
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis tickFormatter={value => formatValue(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={metric} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
