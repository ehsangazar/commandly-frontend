import styles from "../styles/About.module.css";

const About = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        <section className={styles.about}>
          <h1 className="section-title">About Commandly</h1>
          <p className="section-subtitle">
            Building the future of command-line productivity
          </p>

          <div className={styles.content}>
            <div className={styles.story}>
              <h2 className={styles.sectionHeading}>Our Story</h2>
              <p className={styles.text}>
                Commandly was born from a simple idea: make command-line tools
                more accessible and powerful for everyone. What started as a
                side project has grown into a platform used by developers
                worldwide.
              </p>
            </div>

            <div className={styles.mission}>
              <h2 className={styles.sectionHeading}>Our Mission</h2>
              <p className={styles.text}>
                We're on a mission to revolutionize how developers interact with
                their tools. By combining powerful command-line capabilities
                with intuitive interfaces, we're making development workflows
                more efficient than ever.
              </p>
            </div>

            <div className={styles.values}>
              <h2 className={styles.sectionHeading}>Our Values</h2>
              <ul className={styles.valuesList}>
                <li>
                  <strong>Innovation:</strong> Constantly pushing the boundaries
                  of what's possible
                </li>
                <li>
                  <strong>Simplicity:</strong> Making complex tools accessible
                  to everyone
                </li>
                <li>
                  <strong>Community:</strong> Building and supporting a vibrant
                  developer ecosystem
                </li>
                <li>
                  <strong>Quality:</strong> Delivering reliable and performant
                  solutions
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.team}>
            <h2 className={styles.sectionHeading}>Our Team</h2>
            <div className={styles.teamGrid}>
              {[1, 2, 3].map((member) => (
                <div key={member} className={styles.teamMember}>
                  <div className={styles.avatar} />
                  <h3 className={styles.memberName}>Team Member {member}</h3>
                  <p className={styles.memberRole}>Role Title</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
