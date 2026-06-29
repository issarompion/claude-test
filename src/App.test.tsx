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

  describe('UserCard integration', () => {
    it('should render a UserCard below the HelloMessage [US-01]', () => {
      render(<App />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should display demo user name "Jane Doe" [US-02]', () => {
      render(<App />);
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('should display demo user email [US-02]', () => {
      render(<App />);
      expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
    });

    it('should display the status label [US-02]', () => {
      render(<App />);
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should render the heading before the card in DOM order [EF-01/EF-02]', () => {
      render(<App />);
      const heading = screen.getByRole('heading', { name: /hello world/i });
      const card = screen.getByRole('article');
      expect(
        heading.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });
  });
});
