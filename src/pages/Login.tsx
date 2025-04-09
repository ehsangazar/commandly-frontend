import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import styles from "../styles/Login.module.css";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

const Login = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/request-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setStep("code");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // Store token as cookie
      Cookies.set("commandly_token", data.token, {
        expires: 7, // 7 days
        path: "/",
        secure: true,
        sameSite: "strict",
      });

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} data-theme={theme}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome to Commandly</h1>

        {step === "email" ? (
          <form onSubmit={handleRequestCode} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="code" className={styles.label}>
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.input}
                required
                placeholder="Enter verification code"
              />
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setStep("email")}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
