import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Supercharge Your Browsing Experience
          </h1>
          <p className={styles.heroSubtitle}>
            Commandly is your AI-powered Chrome extension that enhances
            productivity, improves accessibility, and helps you understand any
            website better
          </p>
          <div className={styles.heroButtons}>
            <Link to="/login" className={styles.primaryButton}>
              Get Started
            </Link>
            <Link to="/about" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="content-container">
          <h2 className="section-title">Why Choose Commandly?</h2>
          <p className="section-subtitle">
            Experience the power of AI in your everyday browsing
          </p>

          <div className="grid">
            <div className="card">
              <h3 className={styles.featureTitle}>Enhanced Productivity</h3>
              <p className={styles.featureDescription}>
                Automate repetitive tasks, summarize content, and get instant
                answers to your questions with our powerful AI assistant
              </p>
            </div>

            <div className="card">
              <h3 className={styles.featureTitle}>Better Accessibility</h3>
              <p className={styles.featureDescription}>
                Make any website more accessible with AI-powered text-to-speech,
                content simplification, and personalized reading assistance
              </p>
            </div>

            <div className="card">
              <h3 className={styles.featureTitle}>Deeper Understanding</h3>
              <p className={styles.featureDescription}>
                Get instant explanations, translations, and insights about any
                website content with our advanced AI technology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="content-container">
          <h2 className={styles.ctaTitle}>Ready to Transform Your Browsing?</h2>
          <p className={styles.ctaText}>
            Join thousands of users who are already experiencing the power of AI
            in their everyday browsing
          </p>
          <Link to="/login" className={styles.ctaButton}>
            Try it Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
