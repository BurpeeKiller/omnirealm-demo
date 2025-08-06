import type {
  ChartData,
  ChartOptions} from 'chart.js';
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
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Enregistrer les composants Chart.js une seule fois
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

interface ChartComponentsProps {
  data: ChartData<'line' | 'bar'>;
  options: ChartOptions<'line' | 'bar'>;
  type: 'line' | 'bar';
}

const ChartComponents = ({ data, options, type }: ChartComponentsProps) => {
  if (type === 'line') {
    return <Line data={data as ChartData<'line'>} options={options as ChartOptions<'line'>} />;
  }
  return <Bar data={data as ChartData<'bar'>} options={options as ChartOptions<'bar'>} />;
};

export default ChartComponents;
