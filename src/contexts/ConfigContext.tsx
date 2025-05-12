import { UserSettings } from "@/pages/dashboard/Settings";
import { getAuthToken } from "@/utils/auth";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface ConfigContextType {
  theme: "light" | "dark";
  chat: string;
  setChat: (value: string) => void;
  settings: UserSettings | null;
  setSettings: (value: UserSettings) => void;
}

const defaultConfig: ConfigContextType = {
  theme: "light",
  chat: "",
  setChat: () => {},
  settings: null,
  setSettings: () => {},
};

const ConfigContext = createContext<ConfigContextType>(defaultConfig);

interface ConfigProviderProps {
  children: ReactNode;
  config?: Partial<ConfigContextType>;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

export const LoadingSkeleton = () => (
  <div className="h-full">
    {/* Header Skeleton */}
    <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
          <div>
            <div className="h-7 w-32 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-white/5 rounded-lg animate-pulse mt-2" />
          </div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div
      className="flex-1 overflow-y-auto p-6 custom-scrollbar"
      style={{
        height: "calc(100% - 100px)",
      }}
    >
      <div className="mx-auto space-y-6">
        {/* Top Row - Profile and Subscription Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Card Skeleton */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mt-2" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-10 bg-white/5 rounded-lg animate-pulse mt-4" />
            </div>
          </div>

          {/* Subscription Card Skeleton */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mt-2" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
              <div className="mt-4">
                <div className="h-4 w-24 bg-white/5 rounded-lg animate-pulse mb-2" />
                <div className="space-y-2">
                  <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
                  <div className="h-8 bg-white/5 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section Skeleton */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
              <div>
                <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-white/5 rounded-lg animate-pulse mt-2" />
              </div>
            </div>
            <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme and Language Settings Skeleton */}
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-white/5 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-white/5 rounded-lg animate-pulse" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-white/5 rounded animate-pulse" />
                    <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="h-8 w-24 bg-white/5 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>

            {/* Button Visibility Settings Skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-24 bg-white/5 rounded-lg animate-pulse mb-2" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-white/5 rounded animate-pulse" />
                      <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-11 bg-white/5 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  config = {},
}) => {
  const [chat, setChat] = useState("");
  const [settings, setSettings] = useState<UserSettings | null>(null);

  const value = {
    ...defaultConfig,
    ...config,
    chat,
    setChat,
    settings,
    setSettings,
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      const data = await response.json();
      setSettings(data?.settings);
    };

    fetchSettings();
  }, []);

  if (settings === null) {
    return <LoadingSkeleton />;
  }

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
