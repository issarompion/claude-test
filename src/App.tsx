import HelloMessage from './components/HelloMessage';
import { UserCard } from './components/UserCard';
import type { User } from './components/UserCard';
import styles from './App.module.css';

const DEMO_USER: User = {
  id: 'demo',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  status: 'online',
};

export default function App() {
  return (
    <main>
      <HelloMessage />
      <section className={styles.cardSection}>
        <UserCard user={DEMO_USER} />
      </section>
    </main>
  );
}
