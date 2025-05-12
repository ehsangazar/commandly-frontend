import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLogOut,
  FiCheckCircle,
  FiCreditCard,
  FiAlertCircle,
  FiSettings,
  FiRefreshCw,
  FiMoon,
  FiSun,
  FiCopy,
  FiMessageSquare,
  FiClipboard,
  FiGlobe,
} from "react-icons/fi";
import { getAuthToken, removeAuthToken } from "@/utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface User {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
}

interface Subscription {
  id: string;
  planId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  plan: Plan;
}

interface UserSettings {
  id: string;
  userId: string;
  theme: string;
  defaultTranslationLanguage: string;
  showCopyButton: boolean;
  showQuoteButton: boolean;
  showClipButton: boolean;
  showTranslateButton: boolean;
  disableIslandForSpecificDomains: string[];
  createdAt: string;
  updatedAt: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const [userResponse, subscriptionResponse, settingsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${API_BASE_URL}/subscription/status`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${API_BASE_URL}/settings`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const userData = await userResponse.json();
        const subscriptionData = await subscriptionResponse.json();
        const settingsData = await settingsResponse.json();

        if (userData.success) {
          setUser(userData.user);
        } else {
          setError(userData.error || "Failed to fetch user data");
        }

        if (subscriptionData.success) {
          setSubscription(subscriptionData.subscription || null);
        }

        if (settingsData.success) {
          setSettings(settingsData.settings);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    setLoading(true);
    removeAuthToken();
    navigate("/dashboard.html");
  };

  const handleSettingsUpdate = async (updates: Partial<UserSettings>) => {
    try {
      setIsSaving(true);
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      } else {
        setError(data.error || "Failed to update settings");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSettings = async () => {
    try {
      setIsSaving(true);
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/settings/reset`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      } else {
        setError(data.error || "Failed to reset settings");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset settings");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
              <FiSettings className="h-6 w-6 text-[var(--commandly-primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white/90">Settings</h2>
              <p className="text-sm text-white/60 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {error ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-white/50 gap-4">
            <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center">
              <FiAlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-1 text-red-400">{error}</p>
              <p className="text-sm text-white/50">Please try again later</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User Profile Card */}
            <div className="rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 p-5 transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-[var(--commandly-primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white/90">
                    User Profile
                  </h3>
                  <p className="text-sm text-white/60">Account information</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-white/70" />
                    <span className="text-white/90">{user?.email}</span>
                  </div>
                  {user?.isVerified && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30">
                      <FiCheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 p-5 transition-all duration-200 cursor-pointer">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
                  <FiCreditCard className="w-6 h-6 text-[var(--commandly-primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white/90">
                    Subscription
                  </h3>
                  <p className="text-sm text-white/60">Plan details</p>
                </div>
              </div>

              <div className="space-y-4">
                {subscription ? (
                  <>
                    <div className="p-4 rounded-lg bg-black/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60">Current Plan</span>
                        <span className="text-white/90 font-medium">
                          {subscription.plan.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Next Billing</span>
                        <span className="text-white/90">
                          {formatDate(subscription.currentPeriodEnd)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-black/20">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Status</span>
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            subscription.status === "active"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          }`}
                        >
                          {subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-black/20 text-center">
                    <p className="text-white/60">No active subscription</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences Card */}
            <div className="lg:col-span-2 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 p-5 transition-all duration-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
                    <FiSettings className="w-6 h-6 text-[var(--commandly-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white/90">
                      Preferences
                    </h3>
                    <p className="text-sm text-white/60">
                      Customize your experience
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleResetSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 border border-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiRefreshCw
                    className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm font-medium">
                    {isSaving ? "Resetting..." : "Reset to Defaults"}
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Theme Setting */}
                <div className="p-4 rounded-lg bg-black/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {settings?.theme === "dark" ? (
                        <FiMoon className="w-5 h-5 text-white/70" />
                      ) : (
                        <FiSun className="w-5 h-5 text-white/70" />
                      )}
                      <span className="text-white/90">Theme</span>
                    </div>
                    <select
                      value={settings?.theme || "light"}
                      onChange={(e) =>
                        handleSettingsUpdate({ theme: e.target.value })
                      }
                      className="bg-black/30 text-white/90 rounded-lg px-3 py-1.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]/20"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

                {/* Default Translation Language */}
                <div className="p-4 rounded-lg bg-black/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FiGlobe className="w-5 h-5 text-white/70" />
                      <span className="text-white/90">
                        Default Translation Language
                      </span>
                    </div>
                    <select
                      value={settings?.defaultTranslationLanguage || "en"}
                      onChange={(e) =>
                        handleSettingsUpdate({
                          defaultTranslationLanguage: e.target.value,
                        })
                      }
                      className="bg-black/30 text-white/90 rounded-lg px-3 py-1.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--commandly-primary)]/20"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                </div>

                {/* Button Visibility Settings */}
                <div className="p-4 rounded-lg bg-black/20">
                  <h4 className="text-white/90 mb-4">Button Visibility</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiCopy className="w-5 h-5 text-white/70" />
                        <span className="text-white/90">Show Copy Button</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.showCopyButton ?? true}
                          onChange={(e) =>
                            handleSettingsUpdate({
                              showCopyButton: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-black/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--commandly-primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--commandly-primary)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiMessageSquare className="w-5 h-5 text-white/70" />
                        <span className="text-white/90">Show Quote Button</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.showQuoteButton ?? true}
                          onChange={(e) =>
                            handleSettingsUpdate({
                              showQuoteButton: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-black/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--commandly-primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--commandly-primary)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiClipboard className="w-5 h-5 text-white/70" />
                        <span className="text-white/90">Show Clip Button</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.showClipButton ?? true}
                          onChange={(e) =>
                            handleSettingsUpdate({
                              showClipButton: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-black/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--commandly-primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--commandly-primary)]"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiGlobe className="w-5 h-5 text-white/70" />
                        <span className="text-white/90">
                          Show Translate Button
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.showTranslateButton ?? true}
                          onChange={(e) =>
                            handleSettingsUpdate({
                              showTranslateButton: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-black/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--commandly-primary)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--commandly-primary)]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="lg:col-span-2 flex justify-end">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 border border-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {loading ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
