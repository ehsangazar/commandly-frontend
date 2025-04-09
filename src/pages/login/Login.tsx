import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";
import styles from "./Login.module.css";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface EmailFormData {
  email: string;
}

interface CodeFormData {
  code: string;
}

const Login = () => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>();

  const {
    register: registerCode,
    handleSubmit: handleSubmitCode,
    formState: { errors: codeErrors },
  } = useForm<CodeFormData>();

  const onEmailSubmit = async (data: EmailFormData) => {
    setLoading(true);
    setError("");
    setEmailValue(data.email);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/request-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.error);
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

  const onCodeSubmit = async (data: CodeFormData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailValue, code: data.code }),
      });

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.error);
      }

      // Store token as cookie
      Cookies.set("commandly_token", responseData.token, {
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
          <form
            onSubmit={handleSubmitEmail(onEmailSubmit)}
            className={styles.form}
          >
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                className={`${styles.input} ${
                  emailErrors.email ? styles.inputError : ""
                }`}
                placeholder="Enter your email"
                {...registerEmail("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {emailErrors.email && (
                <span className={styles.errorMessage}>
                  {emailErrors.email.message}
                </span>
              )}
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmitCode(onCodeSubmit)}
            className={styles.form}
          >
            <div className={styles.inputGroup}>
              <label htmlFor="code" className={styles.label}>
                Verification Code
              </label>
              <input
                id="code"
                className={`${styles.input} ${
                  codeErrors.code ? styles.inputError : ""
                }`}
                placeholder="Enter verification code"
                {...registerCode("code", {
                  required: "Verification code is required",
                  minLength: {
                    value: 6,
                    message: "Code must be at least 6 characters",
                  },
                })}
              />
              {codeErrors.code && (
                <span className={styles.errorMessage}>
                  {codeErrors.code.message}
                </span>
              )}
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
