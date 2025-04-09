import { Link } from "react-router-dom";
import styles from "../styles/Pricing.module.css";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "Basic command-line tools",
      "Community support",
      "Up to 3 saved commands",
      "Basic documentation",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "12",
    description: "Best for professionals",
    features: [
      "Everything in Free",
      "Unlimited saved commands",
      "Custom command creation",
      "Priority support",
      "Advanced documentation",
      "Team collaboration",
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantees",
      "Security features",
      "Team training",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className={styles.pricing}>
          <h1 className="section-title">Simple, Transparent Pricing</h1>
          <p className="section-subtitle">
            Choose the plan that's right for you or your team
          </p>

          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${
                  plan.popular ? styles.popular : ""
                }`}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>Most Popular</div>
                )}
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  {plan.price === "Custom" ? (
                    plan.price
                  ) : (
                    <>
                      <span className={styles.currency}>$</span>
                      {plan.price}
                      <span className={styles.period}>/mo</span>
                    </>
                  )}
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      <span className={styles.checkmark}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === "Enterprise" ? "/contact" : "/login"}
                  className={`${styles.planButton} ${
                    plan.popular ? styles.popularButton : ""
                  }`}
                >
                  {plan.buttonText}
                </Link>
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
