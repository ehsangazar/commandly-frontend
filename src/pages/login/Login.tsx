import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FiMail,
  FiKey,
  FiArrowLeft,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiCommand,
} from "react-icons/fi";
import { setAuthToken } from "../../utils/auth";

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
  const [showPassword, setShowPassword] = useState(false);
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
        setAuthToken(responseData.token);
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
    <div className="min-h-screen bg-[var(--commandly-background)] flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[var(--commandly-primary)] items-center justify-center p-12">
        <div className="max-w-md">
          <Link to="/">
            <div className="flex items-center gap-2 mb-8">
              <FiCommand className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">Commandly</span>
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-6">
            Welcome to the Future of Browsing
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Experience the power of AI-enhanced browsing with Commandly. Sign in
            to access your personalized dashboard and start browsing smarter.
          </p>
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/80" />
              <span>AI-Powered Browsing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/80" />
              <span>Smart Summarization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 mb-4"
            >
              <FiCommand className="w-8 h-8 text-[var(--commandly-primary)]" />
              <span className="text-2xl font-bold text-[var(--commandly-text-primary)]">
                Commandly
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-2">
              Welcome Back
            </h1>
            <p className="text-[var(--commandly-text-secondary)]">
              Sign in to continue to your dashboard
            </p>
          </div>

          <div className="bg-white dark:bg-[var(--commandly-hover)] rounded-2xl p-8 shadow-lg">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center">
                <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
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
                      type="email"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        emailErrors.email
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-[var(--commandly-border)] focus:ring-[var(--commandly-primary)] focus:border-[var(--commandly-primary)]"
                      } bg-[var(--commandly-background)] text-[var(--commandly-text-primary)] transition-colors duration-200`}
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
                  className="w-full bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Send Verification Code"
                  )}
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
                      type={showPassword ? "text" : "password"}
                      className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
                        codeErrors.code
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-[var(--commandly-border)] focus:ring-[var(--commandly-primary)] focus:border-[var(--commandly-primary)]"
                      } bg-[var(--commandly-background)] text-[var(--commandly-text-primary)] transition-colors duration-200`}
                      placeholder="Enter verification code"
                      {...registerCode("code", {
                        required: "Verification code is required",
                        minLength: {
                          value: 6,
                          message: "Code must be at least 6 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-[var(--commandly-text-secondary)]" />
                      ) : (
                        <FiEye className="h-5 w-5 text-[var(--commandly-text-secondary)]" />
                      )}
                    </button>
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
                  className="w-full bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Verify Code"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full flex items-center justify-center space-x-2 bg-[var(--commandly-hover)] hover:bg-[var(--commandly-hover)] text-[var(--commandly-text-primary)] font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              </form>
            )}

            <div className="mt-8 text-center text-sm text-[var(--commandly-text-secondary)]">
              <p>
                By continuing, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)]"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)]"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
