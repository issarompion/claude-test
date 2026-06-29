import { forwardRef, useState } from 'react';
import type { UserCardProps, UserStatus } from './UserCard.types';
import styles from './UserCard.module.css';

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'U';
  const words = trimmed.split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const STATUS_LABELS: Record<UserStatus, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

const STATUS_DOT_CLASSES: Record<UserStatus, string> = {
  online: styles.statusDotOnline,
  away: styles.statusDotAway,
  offline: styles.statusDotOffline,
};

export const UserCard = forwardRef<HTMLElement, UserCardProps>(
  ({ user, isLoading = false, error = null, className }, ref) => {
    const [avatarFailed, setAvatarFailed] = useState(false);

    const cardClass = [styles.card, className].filter(Boolean).join(' ');

    if (isLoading) {
      return (
        <article
          ref={ref}
          className={cardClass}
          aria-busy="true"
          aria-label="Loading user information"
        >
          <div className={styles.skeleton}>
            <div className={styles.skeletonAvatar} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLine} style={{ width: '65%' }} />
              <div className={styles.skeletonLine} style={{ width: '45%' }} />
              <div className={styles.skeletonLine} style={{ width: '30%' }} />
            </div>
          </div>
        </article>
      );
    }

    if (error) {
      return (
        <article ref={ref} className={cardClass}>
          <div role="alert" className={styles.errorMessage}>
            Unable to load user information. Please try again later.
          </div>
        </article>
      );
    }

    if (!user) {
      return null;
    }

    const displayName = user.name.trim() || 'Unknown user';
    const isLongName = displayName.length > 40;
    const showInitials = !user.avatarUrl || avatarFailed;
    const statusLabel = STATUS_LABELS[user.status];

    return (
      <article ref={ref} className={cardClass}>
        <div className={styles.avatarSection}>
          {showInitials ? (
            <div className={styles.avatarFallback} aria-hidden="true">
              {getInitials(displayName)}
            </div>
          ) : (
            <img
              src={user.avatarUrl}
              alt={`${displayName}'s avatar`}
              className={styles.avatar}
              onError={() => setAvatarFailed(true)}
            />
          )}
        </div>
        <div className={styles.content}>
          <span
            className={
              isLongName
                ? `${styles.name} ${styles.truncate}`
                : styles.name
            }
          >
            {displayName}
          </span>
          {user.email && (
            <span className={styles.email}>{user.email}</span>
          )}
          <span className={styles.statusIndicator}>
            <span
              className={`${styles.statusDot} ${STATUS_DOT_CLASSES[user.status]}`}
              aria-hidden="true"
            />
            <span className={styles.statusLabel}>{statusLabel}</span>
          </span>
        </div>
      </article>
    );
  },
);

UserCard.displayName = 'UserCard';
