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
  FiMessageSquare,
  FiClipboard,
  FiGlobe,
  FiCopy,
} from "react-icons/fi";
import { getAuthToken, removeAuthToken } from "@/utils/auth";
import languages from "@/configs/languages";
import { useConfig } from "@/contexts/ConfigContext";

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

export interface UserSettings {
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
  const { settings, setSettings } = useConfig();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
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
    removeAuthToken();
    setTimeout(() => {
      navigate("/dashboard.html");
    }, 200);
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
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center shadow-lg shadow-[var(--commandly-primary)]/10 transition-all duration-300 hover:bg-[var(--commandly-primary)]/30">
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
      <div
        className="flex-1 overflow-y-auto p-6 custom-scrollbar"
        style={{
          height: "calc(100% - 100px)",
        }}
      >
        {error ? (
          <div className="h-[300px] flex flex-col items-center justify-center text-white/50 gap-4">
            <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/10">
              <FiAlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium mb-1 text-red-400">{error}</p>
              <p className="text-sm text-white/50">Please try again later</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto space-y-6">
            {/* Top Row - Profile and Subscription */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Profile Card */}
              <div className="rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-6 transition-all duration-300 ease-in-out transform hover:scale-[1.01] shadow-lg shadow-black/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center shadow-lg shadow-[var(--commandly-primary)]/10">
                    <FiUser className="h-6 w-6 text-[var(--commandly-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white/90">
                      Profile
                    </h3>
                    <p className="text-sm text-white/60">
                      Your account information
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/80">
                    <FiMail className="h-5 w-5 text-[var(--commandly-primary)]" />
                    <span>{user?.email}</span>
                    {user?.isVerified ? (
                      <FiCheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <span className="text-sm text-yellow-400 hidden">
                        (Unverified)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <FiClipboard className="h-5 w-5 text-[var(--commandly-primary)]" />
                    <span>
                      Member since {formatDate(user?.createdAt || "")}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors duration-200 cursor-pointer"
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-6 transition-all duration-300 ease-in-out transform hover:scale-[1.01] shadow-lg shadow-black/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center shadow-lg shadow-[var(--commandly-primary)]/10">
                    <FiCreditCard className="h-6 w-6 text-[var(--commandly-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white/90">
                      Subscription
                    </h3>
                    <p className="text-sm text-white/60">Your current plan</p>
                  </div>
                </div>
                {subscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <FiCheckCircle className="h-5 w-5 text-green-400" />
                      <span className="font-medium">
                        {subscription.plan.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <FiRefreshCw className="h-5 w-5 text-[var(--commandly-primary)]" />
                      <span>
                        Renews on {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-white/70 mb-2">
                        Plan Features:
                      </h4>
                      <ul className="space-y-2">
                        {subscription.plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-white/60"
                          >
                            <FiCheckCircle className="h-4 w-4 text-green-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-white/60">No active subscription</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences Section */}
            <div className="rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-6 transition-all duration-300 ease-in-out transform hover:scale-[1.01] shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center shadow-lg shadow-[var(--commandly-primary)]/10">
                    <FiGlobe className="h-6 w-6 text-[var(--commandly-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white/90">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiRefreshCw
                    className={`h-5 w-5 ${isSaving ? "animate-spin" : ""}`}
                  />
                  <span>{isSaving ? "Resetting..." : "Reset to Defaults"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Theme and Language Settings */}
                <div className="space-y-4">
                  {/* <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiMoon className="h-5 w-5 text-[var(--commandly-primary)]" />
                        <span className="text-white/80">Theme</span>
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
                  </div> */}

                  <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiGlobe className="h-5 w-5 text-[var(--commandly-primary)]" />
                        <span className="text-white/80">Default Language</span>
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
                        {languages.map((language) => (
                          <option key={language.code} value={language.code}>
                            {language.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Button Visibility Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white/70 mb-2">
                    Button Visibility
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                      <div className="flex items-center gap-3">
                        <FiCopy className="h-5 w-5 text-[var(--commandly-primary)]" />
                        <span className="text-white/80">Show Copy Button</span>
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

                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                      <div className="flex items-center gap-3">
                        <FiMessageSquare className="h-5 w-5 text-[var(--commandly-primary)]" />
                        <span className="text-white/80">Show Quote Button</span>
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

                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                      <div className="flex items-center gap-3">
                        <FiClipboard className="h-5 w-5 text-[var(--commandly-primary)]" />
                        <span className="text-white/80">Show Clip Button</span>
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

                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                      <div className="flex items-center gap-3">
                        <FiGlobe className="h-5 w-5 text-[var(--commandly-primary)]" />
                        <span className="text-white/80">
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
          </div>
        )}
      </div>
    </div>
  );
}
