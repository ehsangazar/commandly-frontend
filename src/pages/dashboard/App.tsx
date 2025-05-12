import { useSearchParams } from "react-router-dom";
import GlassmorphismBackground from "@/components-dashboard/GlassmorphismBackground";
import Clips from "./Clips";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import BrowserStatistics from "./BrowserStatistics";
import Chat from "./Chat";

export interface Widget {
  id: string;
  type: "stats" | "clips" | "clock" | "diagram" | "chat";
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
  const showBrowserStatistics =
    searchParams.get("browser-statistics") === "true";
  const showChat = searchParams.get("chat") === "true";
  return (
    <GlassmorphismBackground className="!backdrop-blur-2xl !bg-black/50">
      <div className="p-6 h-full">
        {showSettings ? (
          <Settings />
        ) : showClip ? (
          <div className="h-full">
            <Clips />
          </div>
        ) : showBrowserStatistics ? (
          <BrowserStatistics />
        ) : showChat ? (
          <Chat />
        ) : (
          <Dashboard />
        )}
      </div>
    </GlassmorphismBackground>
  );
};

export default App;
