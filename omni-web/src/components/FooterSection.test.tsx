import { render, screen } from '@testing-library/react';
import FooterSection from './FooterSection';

describe('FooterSection', () => {
  it('renders footer with company information', () => {
    render(<FooterSection />);

    expect(screen.getByText('OmniRealm')).toBeInTheDocument();
    expect(screen.getByText(/Construisons une IA distribuée/)).toBeInTheDocument();
  });
  it('renders navigation links', () => {
    render(<FooterSection />);

    // Check for navigation links that are actually present in the footer
    expect(screen.getByText('Produits')).toBeInTheDocument();
    expect(screen.getByText('Communauté')).toBeInTheDocument();
    expect(screen.getByText('Ressources')).toBeInTheDocument();
  });
  it('renders contact information', () => {
    render(<FooterSection />);

    const emailLink = screen.getByLabelText(/Email/i);
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@omnirealm.tech');
  });
});
