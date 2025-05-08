import { useSearchParams } from "react-router-dom";
import GlassmorphismBackground from "@/components-dashboard/GlassmorphismBackground";
import ClipsWidget from "@/components-dashboard/Widgets/ClipsWidget/ClipsWidget";
import Dashboard from "./Dashboard";

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

  return (
    <GlassmorphismBackground className="!backdrop-blur-2xl !bg-black/10">
      <div className="p-6">
        {showClip ? (
          <div className="h-full">
            <ClipsWidget />
          </div>
        ) : (
          <Dashboard />
        )}
      </div>
    </GlassmorphismBackground>
  );
};

export default App;
