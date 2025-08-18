// Import optimisé - la configuration est déjà faite dans chart-setup.ts
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { lineChartOptions, barChartOptions } from '@/config/chart-setup';

// Export direct des composants pour le lazy loading
export { Line, Bar, Doughnut };
export { lineChartOptions, barChartOptions };

// Export des options de configuration communes
export const getLineChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#e5e7eb',
      },
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#e5e7eb',
      bodyColor: '#e5e7eb',
    },
  },
  scales: {
    x: {
      grid: {
        color: '#374151',
      },
      ticks: {
        color: '#9ca3af',
      },
    },
    y: {
      grid: {
        color: '#374151',
      },
      ticks: {
        color: '#9ca3af',
      },
    },
  },
});

export const getDoughnutChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#e5e7eb',
      },
    },
    tooltip: {
      backgroundColor: '#1f2937',
      titleColor: '#e5e7eb',
      bodyColor: '#e5e7eb',
    },
  },
});
