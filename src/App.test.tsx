import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('should render without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('should contain the HelloMessage heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument();
  });

  it('should render a main landmark element', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
