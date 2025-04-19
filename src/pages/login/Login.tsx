import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { FiMail, FiKey, FiArrowLeft, FiAlertCircle } from "react-icons/fi";

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

      if (responseData.success) {
        setStep("code");
      } else {
        setError(responseData.error || "Failed to send verification code");
      }
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

      if (responseData.success) {
        // Set cookie with 1 year expiration
        Cookies.set("commandly_token", responseData.token, {
          expires: 365,
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        // Set localStorage with 1 year expiration
        const tokenData = {
          token: responseData.token,
          expires: new Date().getTime() + 365 * 24 * 60 * 60 * 1000, // 1 year from now
        };
        localStorage.setItem("commandly_token", JSON.stringify(tokenData));

        navigate("/dashboard");
      } else {
        setError(responseData.error || "Failed to verify code");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)] flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--commandly-hover)] rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[var(--commandly-text-primary)]">
              Welcome to Commandly
            </h1>
            <p className="mt-2 text-[var(--commandly-text-secondary)]">
              {step === "email"
                ? "Enter your email to get started"
                : "Enter your verification code"}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              <p>{error}</p>
            </div>
          )}

          {step === "email" ? (
            <form
              onSubmit={handleSubmitEmail(onEmailSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--commandly-text-primary)]"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-[var(--commandly-text-secondary)]" />
                  </div>
                  <input
                    id="email"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      emailErrors.email
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[var(--commandly-border)] focus:ring-[var(--commandly-primary)] focus:border-[var(--commandly-primary)]"
                    } bg-[var(--commandly-background)] text-[var(--commandly-text-primary)]`}
                    placeholder="Enter your email"
                    {...registerEmail("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {emailErrors.email && (
                  <div className="flex items-center text-red-500 text-sm">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {emailErrors.email.message}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitCode(onCodeSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-[var(--commandly-text-primary)]"
                >
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="h-5 w-5 text-[var(--commandly-text-secondary)]" />
                  </div>
                  <input
                    id="code"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      codeErrors.code
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[var(--commandly-border)] focus:ring-[var(--commandly-primary)] focus:border-[var(--commandly-primary)]"
                    } bg-[var(--commandly-background)] text-[var(--commandly-text-primary)]`}
                    placeholder="Enter verification code"
                    {...registerCode("code", {
                      required: "Verification code is required",
                      minLength: {
                        value: 6,
                        message: "Code must be at least 6 characters",
                      },
                    })}
                  />
                </div>
                {codeErrors.code && (
                  <div className="flex items-center text-red-500 text-sm">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {codeErrors.code.message}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center space-x-2 bg-[var(--commandly-hover)] hover:bg-[var(--commandly-hover)] text-[var(--commandly-text-primary)] font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setStep("email")}
                disabled={loading}
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
