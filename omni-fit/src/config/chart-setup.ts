// Configuration centralisée de Chart.js avec imports optimisés
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';

// Enregistrement unique des composants nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// Configuration par défaut optimisée
export const defaultChartOptions: ChartOptions<'line' | 'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: 'rgb(243, 244, 246)',
      bodyColor: 'rgb(209, 213, 219)',
      borderColor: 'rgb(55, 65, 81)',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function(context: TooltipItem<'line' | 'bar'>) {
          return context.parsed.y + ' répétitions';
        }
      }
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(55, 65, 81, 0.3)',
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
        stepSize: 10,
      },
    },
  },
};

// Options spécifiques pour graphique en ligne
export const lineChartOptions: ChartOptions<'line'> = {
  ...defaultChartOptions,
  elements: {
    line: {
      tension: 0.3,
      borderWidth: 3,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 6,
    },
  },
};

// Options spécifiques pour graphique en barres
export const barChartOptions: ChartOptions<'bar'> = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        padding: 16,
        color: 'rgb(156, 163, 175)',
        usePointStyle: true,
        pointStyle: 'rectRounded',
      },
    },
  },
  scales: {
    ...defaultChartOptions.scales,
    x: {
      ...defaultChartOptions.scales?.x,
      stacked: true,
    },
    y: {
      ...defaultChartOptions.scales?.y,
      stacked: true,
    },
  },
};