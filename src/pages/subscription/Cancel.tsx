import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cancel.module.css";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const CancelSubscription = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cancelSubscription = async () => {
      try {
        const token = Cookies.get("commandly_token");
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
          setSuccess(true);
        } else {
          setError(data.error || "Failed to cancel subscription");
        }
      } catch (err) {
        setError("Error cancelling subscription");
        console.error("Error cancelling subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    cancelSubscription();
  }, [navigate]);

  return (
    <div className="page-container">
      <div className="content-container">
        <div className={styles.cancel}>
          {loading && (
            <>
              <h1 className="section-title">Cancelling Subscription...</h1>
              <div className={styles.loader}></div>
            </>
          )}

          {success && (
            <>
              <h1 className="section-title">Subscription Cancelled</h1>
              <p className={styles.message}>
                Your subscription has been cancelled. You'll continue to have
                access until the end of your billing period. You will be
                redirected to your dashboard shortly.
              </p>
              <div className={styles.checkmark}>✓</div>
            </>
          )}

          {error && (
            <>
              <h1 className="section-title">Error</h1>
              <p className={styles.error}>{error}</p>
              <button
                className={styles.retryButton}
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
