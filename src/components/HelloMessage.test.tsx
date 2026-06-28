import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HelloMessage from './HelloMessage';

describe('HelloMessage', () => {
  describe('US-01: welcome message visible', () => {
    it('should render an h1 heading with text "Hello World"', () => {
      render(<HelloMessage />);
      expect(
        screen.getByRole('heading', { name: /hello world/i, level: 1 }),
      ).toBeInTheDocument();
    });

    it('should display the exact text "Hello World"', () => {
      render(<HelloMessage />);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });
  });

  // CSS centering, responsive padding, and visual styling are applied via
  // HelloMessage.module.css. jsdom does not process CSS rules, so tests verify
  // that the correct CSS module classes are attached to each element.
  // Visual acceptance (centering, no overflow at 320px, background colour) is
  // covered by browser QA (DevTools responsive mode, visual regression).
  describe('US-02 / US-03 / US-04: layout, responsive and visual classes', () => {
    it('should apply the container CSS module class to the wrapper element', () => {
      const { container } = render(<HelloMessage />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toMatch(/container/);
    });

    it('should apply the heading CSS module class to the h1 element', () => {
      render(<HelloMessage />);
      expect(
        screen.getByRole('heading', { level: 1 }).className,
      ).toMatch(/heading/);
    });
  });
});
