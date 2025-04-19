import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";

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
        <div className="text-[var(--commandly-text-primary)]">
          Loading Plans...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)] flex items-center justify-center">
        <div className="text-[var(--commandly-text-primary)]">{error}</div>
      </div>
    );
  }

  if (subscriptionStatus?.success && subscriptionStatus?.subscription?.plan) {
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
            <p className="text-[var(--commandly-text-secondary)]">
              Manage your subscription and billing details
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-[var(--commandly-hover)] rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-2">
                {subscription.plan?.name || "Unknown Plan"}
              </h2>
              <div className="text-3xl font-bold text-[var(--commandly-primary)] mb-4">
                ${subscription.plan?.price || 0}
                <span className="text-lg text-[var(--commandly-text-secondary)]">
                  /{subscription.plan?.interval || "month"}
                </span>
              </div>
              <div className="mb-6">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-[var(--commandly-primary)] text-white">
                  {subscription.status || "Unknown"}
                </span>
              </div>
              <div className="text-[var(--commandly-text-secondary)] mb-6">
                <p>
                  Current Period: {startDate} - {endDate}
                </p>
              </div>
              {subscription.plan?.features &&
                subscription.plan.features.length > 0 && (
                  <ul className="space-y-2 mb-8">
                    {subscription.plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center text-[var(--commandly-text-secondary)]"
                      >
                        <svg
                          className="w-5 h-5 mr-2 text-[var(--commandly-primary)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--commandly-text-primary)] mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-[var(--commandly-text-secondary)]">
            Choose the plan that's right for you or your team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[var(--commandly-hover)] rounded-lg p-8 relative ${
                plan.name === "Pro"
                  ? "ring-2 ring-[var(--commandly-primary)]"
                  : ""
              }`}
            >
              {plan.name === "Pro" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[var(--commandly-primary)] text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-[var(--commandly-primary)] mb-4">
                  ${plan.price}
                  <span className="text-lg text-[var(--commandly-text-secondary)]">
                    /{plan.interval}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-[var(--commandly-text-secondary)]"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-[var(--commandly-primary)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    plan.name === "Pro"
                      ? "bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white"
                      : "bg-[var(--commandly-hover)] hover:bg-[var(--commandly-hover)] text-[var(--commandly-text-primary)] border border-[var(--commandly-border)]"
                  }`}
                >
                  {plan.name === "Free" ? "Get Started" : "Subscribe Now"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-[var(--commandly-hover)] rounded-lg p-8 max-w-2xl">
            <h3 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-4">
              100% Satisfaction Guarantee
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
