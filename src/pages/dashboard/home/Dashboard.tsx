import StatsWidget from "../../../components/Widgets/StatsWidget/StatsWidget";
import ClipsWidget from "../../../components/Widgets/ClipsWidget/ClipsWidget";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div className="md:col-span-1">
        <StatsWidget />
      </div>
      <div className="md:col-span-2">
        <ClipsWidget />
      </div>
    </div>
  );
};

export default Dashboard;
