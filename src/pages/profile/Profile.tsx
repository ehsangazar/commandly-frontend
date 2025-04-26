import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiSettings,
  FiLogOut,
  FiAlertCircle,
  FiCheckCircle,
  FiCreditCard,
  FiX,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { removeAuthToken, getAuthToken } from "../../utils/auth";

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

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState("");

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
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    setCancelError("");
    try {
      const token = getAuthToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/subscription/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Refresh subscription data
        const statusResponse = await fetch(
          `${API_BASE_URL}/subscription/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const statusData = await statusResponse.json();
        if (statusData.success) {
          setSubscription(statusData.subscription || null);
        }
        setShowCancelDialog(false);
      } else {
        setCancelError(data.error || "Failed to cancel subscription");
      }
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
    } finally {
      setCancelLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--commandly-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--commandly-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--commandly-background)] flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white dark:bg-[var(--commandly-hover)] rounded-2xl shadow-lg">
          <div className="flex items-center space-x-2 text-red-500">
            <FiAlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--commandly-background)]">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[var(--commandly-hover)] rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[var(--commandly-primary)] to-[var(--commandly-primary-hover)] p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                  <FiUser className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    User Profile
                  </h1>
                  <p className="text-white/90 mt-1">
                    Manage your account settings
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - User Info */}
              <div className="space-y-8">
                {/* Email Section */}
                <div className="bg-[var(--commandly-background)] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)]/10 flex items-center justify-center">
                      <FiMail className="w-6 h-6 text-[var(--commandly-primary)]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-[var(--commandly-text-secondary)]">
                        Email Address
                      </h3>
                      <p className="text-lg text-[var(--commandly-text-primary)] mt-1">
                        {user?.email}
                      </p>
                    </div>
                    {user?.isVerified && (
                      <div className="flex items-center space-x-1 text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                        <FiCheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Created Section */}
                <div className="bg-[var(--commandly-background)] rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)]/10 flex items-center justify-center">
                      <FiSettings className="w-6 h-6 text-[var(--commandly-primary)]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[var(--commandly-text-secondary)]">
                        Account Created
                      </h3>
                      <p className="text-lg text-[var(--commandly-text-primary)] mt-1">
                        {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="font-medium">
                    {loading ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </div>

              {/* Right Column - Subscription Info */}
              <div className="space-y-8">
                {subscription && subscription.plan ? (
                  <div className="bg-[var(--commandly-background)] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)]/10 flex items-center justify-center">
                        <FiCreditCard className="w-6 h-6 text-[var(--commandly-primary)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[var(--commandly-text-secondary)]">
                          Subscription Plan
                        </h3>
                        <p className="text-lg text-[var(--commandly-text-primary)] mt-1">
                          {subscription.plan.name}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            subscription.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {subscription.status.charAt(0).toUpperCase() +
                            subscription.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-[var(--commandly-hover)] p-4 rounded-lg">
                          <p className="text-sm text-[var(--commandly-text-secondary)]">
                            Current Period
                          </p>
                          <p className="text-[var(--commandly-text-primary)] mt-1">
                            {formatDate(subscription.currentPeriodStart)} -{" "}
                            {formatDate(subscription.currentPeriodEnd)}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-[var(--commandly-hover)] p-4 rounded-lg">
                          <p className="text-sm text-[var(--commandly-text-secondary)]">
                            Price
                          </p>
                          <p className="text-[var(--commandly-text-primary)] mt-1">
                            ${subscription.plan.price}/
                            {subscription.plan.interval}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[var(--commandly-text-secondary)] mb-3">
                          Plan Features
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {subscription.plan.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 bg-white dark:bg-[var(--commandly-hover)] p-3 rounded-lg"
                            >
                              <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-[var(--commandly-text-primary)]">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {subscription.status === "active" && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => setShowCancelDialog(true)}
                            className="px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                          >
                            Cancel Subscription
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[var(--commandly-background)] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)]/10 flex items-center justify-center">
                        <FiCreditCard className="w-6 h-6 text-[var(--commandly-primary)]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[var(--commandly-text-secondary)]">
                          Subscription Status
                        </h3>
                        <p className="text-lg text-[var(--commandly-text-primary)] mt-1">
                          No active subscription
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-[var(--commandly-text-secondary)] mb-4">
                        Upgrade to a premium plan to unlock all features and
                        enhance your experience.
                      </p>
                      <Link
                        to="/pricing"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[var(--commandly-primary)] text-white rounded-xl hover:bg-[var(--commandly-primary-hover)] transition-colors duration-200"
                      >
                        View Pricing Plans
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[var(--commandly-hover)] rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                Cancel Subscription
              </h3>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-text-primary)]"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center space-x-2">
                <FiAlertCircle className="w-5 h-5" />
                <p>{cancelError}</p>
              </div>
            )}

            <p className="text-[var(--commandly-text-secondary)] mb-6">
              Are you sure you want to cancel your subscription? You'll continue
              to have access until the end of your current billing period.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 py-2 text-[var(--commandly-text-primary)] bg-[var(--commandly-background)] rounded-lg hover:bg-[var(--commandly-hover)] transition-colors duration-200"
                disabled={cancelLoading}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cancelLoading}
              >
                {cancelLoading ? "Canceling..." : "Yes, Cancel Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
