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

interface UserSettings {
  theme: "light" | "dark";
  defaultTranslationLanguage: string;
  showCopyButton: boolean;
  showQuoteButton: boolean;
  showClipButton: boolean;
  showTranslateButton: boolean;
  disableIslandForSpecificDomains: string[];
}

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
      const response = await fetch(`${API_BASE_URL}/settings`);
      const data = await response.json();
      setSettings(data);
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
