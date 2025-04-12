import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Pricing.module.css";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
}

const Pricing = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subscription/plans`);
        const data = await response.json();
        if (data.success) {
          setPlans(data.plans);
        } else {
          setError("Failed to load subscription plans");
        }
      } catch (err) {
        setError("Error loading subscription plans");
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleCheckout = async (planId: string) => {
    try {
      const token = Cookies.get("commandly_token");
      if (!token) {
        navigate("/login");
        return;
      }

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
        // Redirect to Stripe Checkout
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
      <div className="page-container">
        <div className="content-container">
          <div className={styles.pricing}>
            <h1 className="section-title">Loading Plans...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className={styles.pricing}>
            <h1 className="section-title">Error</h1>
            <p className={styles.error}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        <div className={styles.pricing}>
          <h1 className="section-title">Simple, Transparent Pricing</h1>
          <p className="section-subtitle">
            Choose the plan that's right for you or your team
          </p>

          <div className={styles.pricingGrid}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.pricingCard} ${
                  plan.name === "Pro" ? styles.popular : ""
                }`}
              >
                {plan.name === "Pro" && (
                  <div className={styles.popularBadge}>Most Popular</div>
                )}
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.currency}>$</span>
                  {plan.price}
                  <span className={styles.period}>/{plan.interval}</span>
                </div>
                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      <span className={styles.checkmark}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(plan.id)}
                  className={`${styles.planButton} ${
                    plan.name === "Pro" ? styles.popularButton : ""
                  }`}
                >
                  {plan.name === "Free" ? "Get Started" : "Subscribe Now"}
                </button>
              </div>
            ))}
          </div>

          <div className={styles.guarantee}>
            <h3 className={styles.guaranteeTitle}>
              100% Satisfaction Guarantee
            </h3>
            <p className={styles.guaranteeText}>
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
