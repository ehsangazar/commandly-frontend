import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { FiCheck, FiArrowLeft } from "react-icons/fi";

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
    <div className="min-h-screen bg-[var(--commandly-background)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--commandly-hover)] rounded-lg p-8 shadow-sm">
          {status === "loading" && (
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold text-[var(--commandly-text-primary)]">
                Verifying Subscription...
              </h1>
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--commandly-primary)] border-t-transparent"></div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold text-[var(--commandly-text-primary)]">
                Subscription Successful!
              </h1>
              <p className="text-[var(--commandly-text-secondary)]">
                Thank you for subscribing to Commandly. You will be redirected
                to your dashboard shortly.
              </p>
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <FiCheck className="h-6 w-6" />
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold text-[var(--commandly-text-primary)]">
                Subscription Error
              </h1>
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--commandly-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--commandly-primary-hover)]"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to Pricing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;
