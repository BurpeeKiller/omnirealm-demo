import { render, screen } from '@testing-library/react';
import MetricCard from './MetricCard';

describe('MetricCard', () => {
  const mockProps = {
    label: 'Test Metric',
    value: '100%',
    color: 'blue' as const,
    description: 'This is a test metric description',
  };

  it('renders metric card with all props', () => {
    render(<MetricCard {...mockProps} />);

    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('This is a test metric description')).toBeInTheDocument();
  });

  it('renders metric card with minimal props', () => {
    render(<MetricCard label="Simple Test" value="50" color="green" />);

    expect(screen.getByText('Simple Test')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});
