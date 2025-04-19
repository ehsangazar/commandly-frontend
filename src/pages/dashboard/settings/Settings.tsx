import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../../utils/auth";

interface Settings {
  notifications: boolean;
  theme: "light" | "dark" | "system";
  language: string;
}

export const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    theme: "system",
    language: "en",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate("/login");
          return;
        }

        // TODO: Fetch settings from API
        setLoading(false);
      } catch (error) {
        console.error("Failed to load settings:", error);
        setError("Failed to load settings");
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleSettingChange = (
    key: keyof Settings,
    value: Settings[keyof Settings]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div>
            <h2 className="font-medium">Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive notifications about your activity
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) =>
              handleSettingChange("notifications", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="font-medium mb-4">Theme</h2>
          <div className="space-y-2">
            {(["light", "dark", "system"] as const).map((theme) => (
              <label key={theme} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="theme"
                  value={theme}
                  checked={settings.theme === theme}
                  onChange={() => handleSettingChange("theme", theme)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="capitalize">{theme}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="font-medium mb-4">Language</h2>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange("language", e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </div>
  );
};
