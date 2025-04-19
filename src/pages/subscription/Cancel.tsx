import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";
import { FiLoader, FiCheck, FiArrowLeft } from "react-icons/fi";

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
        const token = getAuthToken();
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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-[var(--commandly-border)] bg-[var(--commandly-background)] p-8 text-center">
          {loading && (
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Cancelling Subscription...
              </h1>
              <div className="flex justify-center">
                <FiLoader className="h-8 w-8 animate-spin text-[var(--commandly-primary)]" />
              </div>
            </div>
          )}

          {success && (
            <div className="space-y-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <FiCheck className="h-6 w-6 text-green-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                  Subscription Cancelled
                </h1>
                <p className="text-[var(--commandly-text-secondary)]">
                  Your subscription has been cancelled. You'll continue to have
                  access until the end of your billing period. You will be
                  redirected to your dashboard shortly.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Error
              </h1>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-500">
                {error}
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 rounded-md border border-[var(--commandly-border)] bg-[var(--commandly-background)] px-4 py-2 text-sm font-medium text-[var(--commandly-text-primary)] hover:bg-[var(--commandly-hover)]"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
