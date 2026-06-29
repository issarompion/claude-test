import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserCard } from './UserCard';
import type { User } from './UserCard.types';

const mockUser: User = {
  id: '1',
  name: 'Alice Martin',
  email: 'alice@example.com',
  avatarUrl: 'https://example.com/avatar.jpg',
  status: 'online',
};

describe('UserCard', () => {
  describe('[US-05] Loading state', () => {
    it('should render loading skeleton when isLoading is true', () => {
      render(<UserCard isLoading />);
      const card = screen.getByRole('article', { name: /loading user information/i });
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('aria-busy', 'true');
    });

    it('should not render user data while loading', () => {
      render(<UserCard isLoading user={mockUser} />);
      expect(screen.queryByText('Alice Martin')).not.toBeInTheDocument();
    });
  });

  describe('[US-06] Error state', () => {
    it('should render an alert when error is provided', () => {
      render(<UserCard error="Failed to load user" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should show a generic user-friendly error message', () => {
      render(<UserCard error="NetworkError: ECONNREFUSED 127.0.0.1:5432" />);
      expect(
        screen.getByText(/unable to load user information/i),
      ).toBeInTheDocument();
    });

    it('should not expose technical error details', () => {
      render(<UserCard error="NetworkError: ECONNREFUSED 127.0.0.1:5432" />);
      expect(screen.queryByText(/ECONNREFUSED/i)).not.toBeInTheDocument();
    });
  });

  describe('[US-01] Avatar display', () => {
    it('should render avatar image when avatarUrl is provided', () => {
      render(<UserCard user={mockUser} />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', mockUser.avatarUrl);
      expect(img).toHaveAttribute('alt', "Alice Martin's avatar");
    });

    it('should render initials fallback when no avatarUrl is given', () => {
      render(<UserCard user={{ ...mockUser, avatarUrl: undefined }} />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      // initials are aria-hidden (decorative); getByText searches all DOM text
      expect(screen.getByText('AM')).toBeInTheDocument();
    });

    it('should switch to initials fallback when the image fails to load', () => {
      render(<UserCard user={mockUser} />);
      const img = screen.getByRole('img');
      fireEvent.error(img);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.getByText('AM')).toBeInTheDocument();
    });
  });

  describe('[US-02] Name display', () => {
    it('should display the full user name', () => {
      render(<UserCard user={mockUser} />);
      expect(screen.getByText('Alice Martin')).toBeInTheDocument();
    });

    it('should show "Unknown user" when name is empty', () => {
      render(<UserCard user={{ ...mockUser, name: '' }} />);
      expect(screen.getByText('Unknown user')).toBeInTheDocument();
    });

    it('should show "Unknown user" when name contains only whitespace', () => {
      render(<UserCard user={{ ...mockUser, name: '   ' }} />);
      expect(screen.getByText('Unknown user')).toBeInTheDocument();
    });

    it('should apply truncation class when name exceeds 40 characters', () => {
      const longName = 'A'.repeat(41);
      render(<UserCard user={{ ...mockUser, name: longName }} />);
      const nameEl = screen.getByText(longName);
      expect(nameEl.className).toMatch(/truncate/);
    });

    it('should not apply truncation class for names of exactly 40 characters', () => {
      const exactName = 'A'.repeat(40);
      render(<UserCard user={{ ...mockUser, name: exactName }} />);
      const nameEl = screen.getByText(exactName);
      expect(nameEl.className).not.toMatch(/truncate/);
    });
  });

  describe('Email display', () => {
    it('should display email when provided', () => {
      render(<UserCard user={mockUser} />);
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    });

    it('should not render email when not provided', () => {
      render(<UserCard user={{ ...mockUser, email: undefined }} />);
      expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument();
    });
  });

  describe('[US-03] Status indicator', () => {
    it('should display "Online" status label', () => {
      render(<UserCard user={{ ...mockUser, status: 'online' }} />);
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('should display "Away" status label', () => {
      render(<UserCard user={{ ...mockUser, status: 'away' }} />);
      expect(screen.getByText('Away')).toBeInTheDocument();
    });

    it('should display "Offline" status label', () => {
      render(<UserCard user={{ ...mockUser, status: 'offline' }} />);
      expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('status dot should be aria-hidden (color alone is not the only indicator)', () => {
      render(<UserCard user={{ ...mockUser, status: 'online' }} />);
      const dots = document.querySelectorAll('[aria-hidden="true"]');
      const hasDot = Array.from(dots).some((el) =>
        el.className.includes('statusDot'),
      );
      expect(hasDot).toBe(true);
    });
  });

  describe('[US-07] Accessibility', () => {
    it('should render a semantic article element', () => {
      render(<UserCard user={mockUser} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('should give the avatar a meaningful alt attribute', () => {
      render(<UserCard user={mockUser} />);
      expect(screen.getByRole('img')).toHaveAttribute(
        'alt',
        "Alice Martin's avatar",
      );
    });

    it('should not render anything when neither user, isLoading nor error are set', () => {
      const { container } = render(<UserCard />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('className prop', () => {
    it('should merge additional className onto the card root', () => {
      const { container } = render(
        <UserCard user={mockUser} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('[US-08] Multiple independent cards', () => {
    it('should render two cards independently without interference', () => {
      const user2: User = { id: '2', name: 'Bob Smith', status: 'offline' };
      render(
        <div>
          <UserCard user={mockUser} />
          <UserCard user={user2} />
        </div>,
      );
      expect(screen.getByText('Alice Martin')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });
  });

  describe('Initials logic', () => {
    it('should derive two initials from a two-word name', () => {
      render(<UserCard user={{ ...mockUser, avatarUrl: undefined, name: 'Jane Doe' }} />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should use only the first letter for a single-word name', () => {
      render(<UserCard user={{ ...mockUser, avatarUrl: undefined, name: 'Madonna' }} />);
      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('should use first and last initials for a three-word name', () => {
      render(
        <UserCard user={{ ...mockUser, avatarUrl: undefined, name: 'Alice Mary Martin' }} />,
      );
      expect(screen.getByText('AM')).toBeInTheDocument();
    });
  });
});
