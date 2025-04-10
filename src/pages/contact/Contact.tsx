import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./Contact.module.css";
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
    <div className="page-container">
      <div className="content-container">
        <div className={styles.contact}>
          <h1 className="section-title">Get in Touch</h1>
          <p className="section-subtitle">
            Have questions or feedback? We'd love to hear from you. Send us a
            message and we'll respond as soon as possible.
          </p>

          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>
                  <FiMail size={20} />
                  Email
                </h3>
                <p className={styles.infoText}>info@commandly.dev</p>
              </div>
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>
                  <FiMapPin size={20} />
                  Office
                </h3>
                <p className={styles.infoText}>London, UK</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              {status.type && (
                <div
                  className={`${styles.statusMessage} ${styles[status.type]}`}
                >
                  {status.type === "success" ? (
                    <FiCheckCircle size={20} />
                  ) : (
                    <FiXCircle size={20} />
                  )}
                  {status.message}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name
                </label>
                <input
                  id="name"
                  className={`${styles.input} ${
                    errors.name ? styles.error : ""
                  }`}
                  placeholder="Your name"
                  {...register("name")}
                />
                {errors.name && (
                  <span className={styles.errorMessage}>
                    <FiAlertCircle size={16} />
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email
                </label>
                <input
                  id="email"
                  className={`${styles.input} ${
                    errors.email ? styles.error : ""
                  }`}
                  placeholder="your.email@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className={styles.errorMessage}>
                    <FiAlertCircle size={16} />
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject" className={styles.label}>
                  Subject
                </label>
                <input
                  id="subject"
                  className={`${styles.input} ${
                    errors.subject ? styles.error : ""
                  }`}
                  placeholder="What is this about?"
                  {...register("subject")}
                />
                {errors.subject && (
                  <span className={styles.errorMessage}>
                    <FiAlertCircle size={16} />
                    {errors.subject.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>
                  Message
                </label>
                <textarea
                  id="message"
                  className={`${styles.textarea} ${
                    errors.message ? styles.error : ""
                  }`}
                  rows={5}
                  placeholder="Your message here..."
                  {...register("message")}
                />
                {errors.message && (
                  <span className={styles.errorMessage}>
                    <FiAlertCircle size={16} />
                    {errors.message.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
