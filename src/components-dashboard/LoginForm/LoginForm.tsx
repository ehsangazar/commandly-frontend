/// <reference types="chrome" />

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setAuthToken } from "@/utils/auth";
import {
  FiMail,
  FiKey,
  FiArrowLeft,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiCommand,
} from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface EmailFormData {
  email: string;
}

interface CodeFormData {
  code: string;
}

const LoginForm = () => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

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
        if (chrome?.storage?.local) {
          chrome.storage.local.set({ commandly_token: responseData.token });
        }
        window.location.reload();
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
    <div className="min-h-screen bg-[#F8F7FF] dark:bg-[#0D0D0D] flex relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-transparent to-blue-500/30 dark:from-purple-600/20 dark:to-blue-600/20 animate-gradient-slow" />
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-indigo-500/20 dark:from-pink-600/10 dark:to-indigo-600/10 animate-gradient-fast blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 relative">
        <div
          className={`max-w-md transform transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <FiCommand className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin-slow" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-400 animate-gradient-x">
              Commandly
            </span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white animate-gradient-slow">
            Welcome to
            <br />
            the Future of
            <br />
            Browsing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Experience the power of AI-enhanced browsing with Commandly.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div
          className={`w-full max-w-md transform transition-all duration-1000 ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="lg:hidden text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FiCommand className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin-slow" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-400 animate-gradient-x">
                Commandly
              </span>
            </div>
          </div>

          <div className="backdrop-blur-2xl bg-white/80 dark:bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-white/20 ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-all duration-500 hover:shadow-[0_0_50px_-12px] hover:shadow-purple-500/30">
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center animate-fade-in">
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
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400 dark:text-gray-300 group-hover:text-purple-500 transition-colors duration-300" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border ${
                        emailErrors.email
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-200 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                      } bg-white/80 dark:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-300 hover:bg-white/90 dark:hover:bg-white/30 focus:bg-white/90 dark:focus:bg-white/30`}
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
                    <div className="flex items-center text-red-500 text-sm mt-2 animate-fade-in">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {emailErrors.email.message}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] group"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="group-hover:animate-gradient-x">
                      Send Verification Code
                    </span>
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
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Verification Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiKey className="h-5 w-5 text-gray-400 dark:text-gray-300 group-hover:text-purple-500 transition-colors duration-300" />
                    </div>
                    <input
                      id="code"
                      type={showPassword ? "text" : "password"}
                      className={`w-full pl-11 pr-12 py-3.5 rounded-2xl border ${
                        codeErrors.code
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-200 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
                      } bg-white/80 dark:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-300 hover:bg-white/90 dark:hover:bg-white/30 focus:bg-white/90 dark:focus:bg-white/30`}
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
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-300 hover:text-purple-500 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {codeErrors.code && (
                    <div className="flex items-center text-red-500 text-sm mt-2 animate-fade-in">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {codeErrors.code.message}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] group"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="group-hover:animate-gradient-x">
                      Verify Code
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full flex items-center justify-center space-x-2 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-gray-700 dark:text-white font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 border border-gray-200 dark:border-white/10 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={loading}
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
              </form>
            )}

            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
              <p>
                By continuing, you agree to our{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
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

export default LoginForm;
