import { useTheme } from "../../../context/ThemeContext";
import styles from "./ScreenTime.module.css";
import StatsWidget from "../../../components/Widgets/StatsWidget/StatsWidget";

const ScreenTime = () => {
  const { theme } = useTheme();

  return (
    <div className={styles.container} data-theme={theme}>
      <div className={styles.content}>
        <StatsWidget />
      </div>
    </div>
  );
};

export default ScreenTime;
