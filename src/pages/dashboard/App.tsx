import { useSearchParams } from "react-router-dom";
import GlassmorphismBackground from "@/components-dashboard/GlassmorphismBackground";
import Clips from "./Clips";
import Dashboard from "./Dashboard";
import Settings from "./Settings";

export interface Widget {
  id: string;
  type: "stats" | "clips" | "clock" | "diagram";
  x: number;
  y: number;
  w: number;
  h: number;
  staticH: boolean;
}

const App = () => {
  const [searchParams] = useSearchParams();
  const showClip = searchParams.get("clip") === "true";
  const showSettings = searchParams.get("settings") === "true";
  return (
    <GlassmorphismBackground
      className="!backdrop-blur-2xl !bg-black/30"
    >
      <div className="p-6">
        {showSettings ? (
          <Settings />
        ) : showClip ? (
          <div className="h-full">
            <Clips />
          </div>
        ) : (
          <Dashboard />
        )}
      </div>
    </GlassmorphismBackground>
  );
};

export default App;
