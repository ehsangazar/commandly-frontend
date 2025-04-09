import styles from "../styles/Legal.module.css";

const Privacy = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className={styles.legal}>
          <h1 className="section-title">Privacy Policy</h1>
          <div className={styles.content}>
            <section className={styles.section}>
              <h2>Introduction</h2>
              <p>
                At Commandly, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our service.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Information We Collect</h2>
              <p>
                We collect information that you provide directly to us,
                including:
              </p>
              <ul>
                <li>Account information (email address)</li>
                <li>Usage data and preferences</li>
                <li>Communication data</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and maintain our service</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, no
                method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a href="mailto:privacy@commandly.app">privacy@commandly.app</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
