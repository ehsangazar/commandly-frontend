import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import {
  FiMail,
  FiMapPin,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const schema = yup.object({
  name: yup.string().required("Name is required").max(100),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .max(100),
  subject: yup.string().required("Subject is required").max(200),
  message: yup.string().required("Message is required").max(5000),
});

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: yupResolver(schema),
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const onSubmit = async (data: ContactForm) => {
    try {
      setStatus({ type: null, message: "" });
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (response.status === 201) {
        reset();
        setStatus({
          type: "success",
          message:
            result.message ||
            "Message sent successfully! We'll get back to you soon.",
        });
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to send message",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--commandly-text-primary)] mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-[var(--commandly-text-secondary)] max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Send us a
            message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="bg-[var(--commandly-hover)] rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] flex items-center justify-center text-white">
                  <FiMail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Email
                  </h3>
                  <p className="text-[var(--commandly-text-secondary)]">
                    info@commandly.dev
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--commandly-hover)] rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] flex items-center justify-center text-white">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Office
                  </h3>
                  <p className="text-[var(--commandly-text-secondary)]">
                    London, UK
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {status.type && (
              <div
                className={`p-4 rounded-lg flex items-center space-x-3 ${
                  status.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {status.type === "success" ? (
                  <FiCheckCircle className="w-5 h-5" />
                ) : (
                  <FiXCircle className="w-5 h-5" />
                )}
                <p>{status.message}</p>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[var(--commandly-text-primary)]"
              >
                Name
              </label>
              <input
                id="name"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[var(--commandly-border)] focus:ring-[var(--commandly-primary)] focus:border-[var(--commandly-primary)]"
                } bg-[var(--commandly-background)] text-[var(--commandly-text-primary)]`}
                placeholder="Your name"
                {...register("name")}
              />
              {errors.name && (
                <div className="flex items-center text-red-500 text-sm">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.name.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--commandly-text-primary)]"
              >
                Email
              </label>
              <input
                id="email"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[var(--commandly-border)] focus:ring-[var(--commandly-primary)] focus:border-[var(--commandly-primary)]"
                } bg-[var(--commandly-background)] text-[var(--commandly-text-primary)]`}
                placeholder="your.email@example.com"
                {...register("email")}
              />
              {errors.email && (
                <div className="flex items-center text-red-500 text-sm">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-[var(--commandly-text-primary)]"
              >
                Subject
              </label>
              <input
                id="subject"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.subject
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[var(--commandly-border)] focus:ring-[var(--commandly-primary)] focus:border-[var(--commandly-primary)]"
                } bg-[var(--commandly-background)] text-[var(--commandly-text-primary)]`}
                placeholder="What is this about?"
                {...register("subject")}
              />
              {errors.subject && (
                <div className="flex items-center text-red-500 text-sm">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.subject.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[var(--commandly-text-primary)]"
              >
                Message
              </label>
              <textarea
                id="message"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.message
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[var(--commandly-border)] focus:ring-[var(--commandly-primary)] focus:border-[var(--commandly-primary)]"
                } bg-[var(--commandly-background)] text-[var(--commandly-text-primary)]`}
                rows={5}
                placeholder="Your message here..."
                {...register("message")}
              />
              {errors.message && (
                <div className="flex items-center text-red-500 text-sm">
                  <FiAlertCircle className="w-4 h-4 mr-1" />
                  {errors.message.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
