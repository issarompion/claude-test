import styles from './HelloMessage.module.css';

export default function HelloMessage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Hello World</h1>
    </div>
  );
}
