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
  settings: UserSettings;
  setSettings: (value: UserSettings) => void;
}

const defaultConfig: ConfigContextType = {
  theme: "light",
  chat: "",
  setChat: () => {},
  settings: {
    id: "",
    userId: "",
    theme: "light",
    defaultTranslationLanguage: "en",
    showCopyButton: true,
    showQuoteButton: true,
    showClipButton: true,
    showTranslateButton: true,
    disableIslandForSpecificDomains: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  setSettings: () => {},
};

const ConfigContext = createContext<ConfigContextType>(defaultConfig);

interface ConfigProviderProps {
  children: ReactNode;
  config?: Partial<ConfigContextType>;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  children,
  config = {},
}) => {
  const [chat, setChat] = useState("");
  const [settings, setSettings] = useState<UserSettings>(
    defaultConfig.settings
  );

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
      setSettings(data?.settings || defaultConfig.settings);
    };

    fetchSettings();
  }, []);

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
