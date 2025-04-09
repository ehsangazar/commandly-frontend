import { useTheme } from "../context/ThemeContext";
import styles from "../styles/ScreenTime.module.css";
import StatsWidget from "../components/StatsWidget";

const ScreenTime = () => {
  const { theme } = useTheme();

  return (
    <div className={styles.container} data-theme={theme}>
      <header className={styles.header}>
        <h1>Screen Time Analytics</h1>
        <p>Track and analyze your command usage patterns</p>
      </header>

      <div className={styles.content}>
        <StatsWidget />
      </div>
    </div>
  );
};

export default ScreenTime;
