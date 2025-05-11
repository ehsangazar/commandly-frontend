import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ConfigContextType {
  theme: 'light' | 'dark';
  chat: string;
  setChat: (value: string) => void;
}

const defaultConfig: ConfigContextType = {
  theme: 'light',
  chat: "",
  setChat: () => {},
};

const ConfigContext = createContext<ConfigContextType>(defaultConfig);

interface ConfigProviderProps {
  children: ReactNode;
  config?: Partial<ConfigContextType>;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const [chat, setChat] = useState("");

  const value = {
    ...defaultConfig,
    ...config,
    chat,
    setChat,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}; 