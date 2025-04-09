import styles from "./About.module.css";

const About = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>About Commandly</h1>
            <p>Empowering developers with intelligent productivity tools</p>
          </div>
        </div>

        <section className={styles.about}>
          <div className={styles.content}>
            <div className={styles.story}>
              <div className={styles.textContent}>
                <h2>Our Story</h2>
                <p>
                  Founded in 2024, Commandly emerged from a simple observation:
                  developers spend too much time managing tools instead of
                  writing code. What began as a solution to track and optimize
                  command-line usage has evolved into a comprehensive platform
                  that helps developers work smarter.
                </p>
                <p>
                  Today, Commandly is used by thousands of developers worldwide,
                  helping them understand and improve their development
                  workflows through intelligent analytics and automation.
                </p>
              </div>
              <div className={styles.imageSection}>
                <img
                  src="/images/about/story.jpg"
                  alt="Developer working with Commandly"
                  className={styles.storyImage}
                />
              </div>
            </div>

            <div className={styles.mission}>
              <div className={styles.imageSection}>
                <img
                  src="/images/about/mission.jpg"
                  alt="Team collaboration"
                  className={styles.missionImage}
                />
              </div>
              <div className={styles.textContent}>
                <h2>Our Mission</h2>
                <p>
                  We believe that great software is built when developers can
                  focus on what matters most: solving problems. Our mission is
                  to eliminate the friction in development workflows by
                  providing intelligent insights and automation.
                </p>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>10K+</span>
                    <span className={styles.statLabel}>Active Users</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>1M+</span>
                    <span className={styles.statLabel}>Commands Analyzed</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>30%</span>
                    <span className={styles.statLabel}>Time Saved</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.values}>
              <h2>Our Values</h2>
              <div className={styles.valueGrid}>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3>Innovation</h3>
                  <p>
                    Pushing the boundaries of developer productivity through
                    cutting-edge technology
                  </p>
                </div>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </div>
                  <h3>Simplicity</h3>
                  <p>
                    Creating intuitive tools that simplify complex development
                    workflows
                  </p>
                </div>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3>Community</h3>
                  <p>
                    Building and nurturing a vibrant ecosystem of developers
                    worldwide
                  </p>
                </div>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3>Quality</h3>
                  <p>
                    Maintaining the highest standards in our code, design, and
                    user experience
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.team}>
              <h2>Our Team</h2>
              <div className={styles.teamGrid}>
                <div className={styles.teamMember}>
                  <div className={styles.memberPhoto}>
                    <img src="/images/team/ceo.jpg" alt="CEO" />
                  </div>
                  <h3>Sarah Chen</h3>
                  <p>CEO & Co-founder</p>
                  <div className={styles.memberSocial}>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className={styles.teamMember}>
                  <div className={styles.memberPhoto}>
                    <img src="/images/team/cto.jpg" alt="CTO" />
                  </div>
                  <h3>Alex Rodriguez</h3>
                  <p>CTO & Co-founder</p>
                  <div className={styles.memberSocial}>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className={styles.teamMember}>
                  <div className={styles.memberPhoto}>
                    <img src="/images/team/lead.jpg" alt="Lead Engineer" />
                  </div>
                  <h3>Maya Patel</h3>
                  <p>Lead Engineer</p>
                  <div className={styles.memberSocial}>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
