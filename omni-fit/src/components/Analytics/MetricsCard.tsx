"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}

export function MetricsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = "blue",
}: MetricsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
    orange: "bg-orange-50 border-orange-200 text-orange-900",
    red: "bg-red-50 border-red-200 text-red-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900",
  };

  const trendColors = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    neutral: "text-gray-600 bg-gray-100",
  };

  return (
    <Card className={`p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-sm opacity-60">{subtitle}</p>}
        </div>
        {icon && <div className="text-2xl opacity-70">{icon}</div>}
      </div>
      {trend && (
        <div className="mt-4 flex items-center space-x-2">
          <Badge className={`px-2 py-1 text-xs ${trendColors[trend.direction]}`}>
            {trend.direction === "up" ? "↗" : trend.direction === "down" ? "↘" : "→"}
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </Badge>
          <span className="text-sm opacity-60">{trend.label}</span>
        </div>
      )}
    </Card>
  );
}
