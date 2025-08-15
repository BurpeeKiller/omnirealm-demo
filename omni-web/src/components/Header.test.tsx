import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeaderNoContext from './HeaderNoContext';

describe('Header', () => {
  it('renders Omnirealm title', () => {
    render(<HeaderNoContext />);
    expect(screen.getByText('Omnirealm')).toBeInTheDocument();
  });
  it('shows navigation links', () => {
    render(<HeaderNoContext />);
    expect(screen.getByText('Manifeste')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Inscription')).toBeInTheDocument();
  });
});
