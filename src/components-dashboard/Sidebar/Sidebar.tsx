import {
  FiSettings,
  FiPlus,
  FiUser,
  FiMail,
  FiLogOut,
  FiCheckCircle,
  FiCreditCard,
  FiX,
  FiAlertCircle,
  FiGrid,
  FiImage,
} from "react-icons/fi";
import GlassmorphismBackground from "../GlassmorphismBackground";
import { useState, useEffect, useRef } from "react";
import WidgetSidebar from "../WidgetSidebar/WidgetSidebar";
import { getAuthToken, removeAuthToken } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface SidebarProps {
  isModifyMode: boolean;
  onModifyModeChange: (value: boolean) => void;
  onAddWidget: (widgetType: string) => void;
  onChangeBackground: () => void;
  existingWidgets: Array<{ type: string }>;
}

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

const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 whitespace-nowrap pointer-events-none z-[100]">
    {text}
    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
  </div>
);

const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const [userResponse, subscriptionResponse] = await Promise.all([
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
        ]);

        const userData = await userResponse.json();
        const subscriptionData = await subscriptionResponse.json();

        if (userData.success) {
          setUser(userData.user);
        } else {
          setError(userData.error || "Failed to fetch user data");
        }

        if (subscriptionData.success) {
          setSubscription(subscriptionData.subscription || null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div
          ref={modalRef}
          className="bg-white/20 backdrop-blur-2xl rounded-2xl p-8 max-w-2xl w-full mx-4 border border-white/30 shadow-2xl"
        >
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-[var(--commandly-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white/20 backdrop-blur-2xl rounded-2xl p-8 max-w-2xl w-full mx-4 border border-white/30 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors duration-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 text-red-200 border border-red-500/30 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 border border-white/30">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
                <FiUser className="w-6 h-6 text-[var(--commandly-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">User Profile</h3>
                <p className="text-sm text-white/70">
                  Manage your account settings
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-white/70" />
                  <span className="text-white">{user?.email}</span>
                </div>
                {user?.isVerified && (
                  <div className="flex items-center space-x-1 text-green-300">
                    <FiCheckCircle className="w-5 h-5" />
                    <span className="text-sm">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-white/20 backdrop-blur-xl rounded-xl p-6 border border-white/30">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--commandly-primary)]/20 flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-[var(--commandly-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Subscription</h3>
                <p className="text-sm text-white/70">
                  Manage your subscription
                </p>
              </div>
            </div>

            <div className="mt-6">
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Plan</span>
                    <span className="text-white font-medium">
                      {subscription.plan.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Status</span>
                    <span
                      className={`px-3 py-1 rounded-xl text-sm ${
                        subscription.status === "active"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                      }`}
                    >
                      {subscription.status.charAt(0).toUpperCase() +
                        subscription.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Next Billing</span>
                    <span className="text-white">
                      {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/70">No active subscription</p>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 border border-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">
              {loading ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({
  isModifyMode,
  onModifyModeChange,
  onAddWidget,
  onChangeBackground,
  existingWidgets,
}: SidebarProps) => {
  const [isWidgetSidebarOpen, setIsWidgetSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <GlassmorphismBackground
        fullRadius={true}
        className="!backdrop-blur-2xl !bg-white/10 !h-fit"
        zIndex={2}
      >
        <div className="h-fit rounded-2xl w-16 flex flex-col items-center py-4 gap-2">
          <button
            onClick={() => onModifyModeChange(!isModifyMode)}
            className={`p-3.5 cursor-pointer rounded-full transition-all duration-300 text-black relative group hover:scale-110 active:scale-95 ${
              isModifyMode
                ? "bg-gray-300"
                : "bg-gray-200 shadow-lg hover:shadow-xl"
            }`}
          >
            <FiGrid className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <Tooltip
              text={isModifyMode ? "Exit modify mode" : "Enter modify mode"}
            />
          </button>

          <button
            onClick={() => setIsWidgetSidebarOpen((prevState) => !prevState)}
            className="p-3.5 cursor-pointer rounded-full text-black transition-all duration-300 shadow-lg bg-gray-200 hover:shadow-xl focus:bg-gray-300 focus:shadow-none relative group hover:scale-110 active:scale-95"
          >
            <FiPlus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            <Tooltip text="Add Widget" />
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3.5 cursor-pointer rounded-full bg-gray-200 text-black transition-all duration-300 shadow-lg hover:shadow-xl focus:bg-gray-300 focus:shadow-none relative group hover:scale-110 active:scale-95"
          >
            <FiSettings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            <Tooltip text="Settings" />
          </button>

          <button
            onClick={onChangeBackground}
            className="p-3.5 cursor-pointer rounded-full bg-gray-200 text-black transition-all duration-300 shadow-lg hover:shadow-xl focus:bg-gray-300 focus:shadow-none relative group hover:scale-110 active:scale-95"
          >
            <FiImage className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
            <Tooltip text="Change background" />
          </button>
        </div>
      </GlassmorphismBackground>

      <WidgetSidebar
        isOpen={isWidgetSidebarOpen}
        onClose={() => setIsWidgetSidebarOpen(false)}
        onAddWidget={onAddWidget}
        existingWidgets={existingWidgets}
      />

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
