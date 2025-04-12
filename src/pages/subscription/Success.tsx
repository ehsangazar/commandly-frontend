import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Success.module.css";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySubscription = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatus("error");
        setError("No session ID found");
        return;
      }

      try {
        const token = Cookies.get("commandly_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/subscription/verify?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setStatus("success");
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } else {
          setStatus("error");
          setError(data.error || "Failed to verify subscription");
        }
      } catch (err) {
        setStatus("error");
        setError("Error verifying subscription");
        console.error("Error verifying subscription:", err);
      }
    };

    verifySubscription();
  }, [searchParams, navigate]);

  return (
    <div className="page-container">
      <div className="content-container">
        <div className={styles.success}>
          {status === "loading" && (
            <>
              <h1 className="section-title">Verifying Subscription...</h1>
              <div className={styles.loader}></div>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="section-title">Subscription Successful!</h1>
              <p className={styles.message}>
                Thank you for subscribing to Commandly. You will be redirected
                to your dashboard shortly.
              </p>
              <div className={styles.checkmark}>✓</div>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="section-title">Subscription Error</h1>
              <p className={styles.error}>{error}</p>
              <button
                className={styles.retryButton}
                onClick={() => navigate("/pricing")}
              >
                Back to Pricing
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;
