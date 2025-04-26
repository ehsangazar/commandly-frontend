import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
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

interface SubscriptionStatus {
  success: boolean;
  subscription: Subscription | null;
}

const Pricing = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch subscription status
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
          setSubscriptionStatus(statusData);
        }

        // Fetch plans
        const plansResponse = await fetch(`${API_BASE_URL}/subscription/plans`);
        const plansData = await plansResponse.json();
        if (plansData.success) {
          setPlans(plansData.plans);
        } else {
          setError("Failed to load subscription plans");
        }
      } catch (err) {
        setError("Error loading subscription plans");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckout = async (planId: string) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/subscription/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      setError("Error creating checkout session");
      console.error("Error during checkout:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--commandly-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)] flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white dark:bg-[var(--commandly-hover)] rounded-2xl shadow-lg">
          <div className="flex items-center space-x-2 text-red-500">
            <FiAlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (
    subscriptionStatus?.success &&
    subscriptionStatus?.subscription?.plan &&
    subscriptionStatus.subscription.status === "active"
  ) {
    const { subscription } = subscriptionStatus;
    const startDate = subscription?.currentPeriodStart
      ? new Date(subscription.currentPeriodStart).toLocaleDateString()
      : "N/A";
    const endDate = subscription?.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
      : "N/A";

    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--commandly-text-primary)] mb-4">
              Your Current Subscription
            </h1>
            <p className="text-xl text-[var(--commandly-text-secondary)]">
              Manage your subscription and billing details
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white dark:bg-[var(--commandly-hover)] rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--commandly-primary)] to-[var(--commandly-primary-hover)] p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {subscription.plan?.name || "Unknown Plan"}
              </h2>
              <div className="text-4xl font-bold text-white mb-2">
                ${subscription.plan?.price || 0}
                <span className="text-xl text-white/80">
                  /{subscription.plan?.interval || "month"}
                </span>
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white">
                {subscription.status || "Unknown"}
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[var(--commandly-text-primary)] mb-4">
                  Current Billing Period
                </h3>
                <div className="flex justify-between items-center bg-[var(--commandly-background)] p-4 rounded-xl">
                  <div>
                    <p className="text-sm text-[var(--commandly-text-secondary)]">
                      Start Date
                    </p>
                    <p className="text-[var(--commandly-text-primary)]">
                      {startDate}
                    </p>
                  </div>
                  <div className="w-8 h-px bg-[var(--commandly-border)] mx-4" />
                  <div>
                    <p className="text-sm text-[var(--commandly-text-secondary)]">
                      End Date
                    </p>
                    <p className="text-[var(--commandly-text-primary)]">
                      {endDate}
                    </p>
                  </div>
                </div>
              </div>

              {subscription.plan?.features &&
                subscription.plan.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-[var(--commandly-text-primary)] mb-4">
                      Plan Features
                    </h3>
                    <div className="space-y-3">
                      {subscription.plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center space-x-3 bg-[var(--commandly-background)] p-4 rounded-xl"
                        >
                          <div className="w-6 h-6 rounded-full bg-[var(--commandly-primary)]/10 flex items-center justify-center">
                            <FiCheckCircle className="w-4 h-4 text-[var(--commandly-primary)]" />
                          </div>
                          <span className="text-[var(--commandly-text-primary)]">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="mt-8">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[var(--commandly-text-primary)] mb-4">
            {subscriptionStatus?.subscription?.status === "cancelled"
              ? "Choose a New Plan"
              : "Simple, Transparent Pricing"}
          </h1>
          <p className="text-xl text-[var(--commandly-text-secondary)] max-w-2xl mx-auto">
            {subscriptionStatus?.subscription?.status === "cancelled"
              ? "Select a new plan to continue enjoying Commandly's features."
              : "Choose the plan that's right for you or your team. All plans include a 14-day free trial."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-[var(--commandly-hover)] rounded-2xl shadow-lg overflow-hidden relative ${
                plan.name === "Pro"
                  ? "ring-2 ring-[var(--commandly-primary)]"
                  : ""
              }`}
            >
              {plan.name === "Pro" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[var(--commandly-primary)] text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="bg-gradient-to-r from-[var(--commandly-primary)] to-[var(--commandly-primary-hover)] p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-white mb-2">
                  ${plan.price}
                  <span className="text-xl text-white/80">
                    /{plan.interval}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-[var(--commandly-primary)]/10 flex items-center justify-center">
                        <FiCheckCircle className="w-4 h-4 text-[var(--commandly-primary)]" />
                      </div>
                      <span className="text-[var(--commandly-text-primary)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors duration-200 ${
                    plan.name === "Pro"
                      ? "bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white"
                      : "bg-[var(--commandly-background)] hover:bg-[var(--commandly-hover)] text-[var(--commandly-text-primary)]"
                  }`}
                >
                  {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-block bg-white dark:bg-[var(--commandly-hover)] rounded-2xl p-8 max-w-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-4">
              14-Day Free Trial
            </h3>
            <p className="text-[var(--commandly-text-secondary)]">
              Try Commandly risk-free for 14 days. If you're not completely
              satisfied, let us know and we'll refund your payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
