import React from 'react';

interface MetricCardProps {
  value: string;
  label: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  description?: string;
}

const MetricCard= ({ value, label, color, description }: MetricCardProps) => {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className={`text-4xl font-bold ${colorClasses[color]} mb-2`}>{value}</div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{label}</div>
      {description && <div className="text-xs text-gray-600 dark:text-gray-400">{description}</div>}
    </div>
  );
};

export default MetricCard;
