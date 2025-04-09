import { useTheme } from "../../context/ThemeContext";
import styles from "./ScreenTime.module.css";
import StatsWidget from "../../components/widgets/StatsWidget";
import DashboardHeader from "../../components/DashboardHeader";

const ScreenTime = () => {
  const { theme } = useTheme();

  return (
    <div className={styles.container} data-theme={theme}>
      <DashboardHeader
        title="Screen Time Analytics"
        subtitle="Track and analyze your command usage patterns"
      />
      <div className={styles.content}>
        <StatsWidget />
      </div>
    </div>
  );
};

export default ScreenTime;
