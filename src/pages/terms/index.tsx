import styles from "./Legal.module.css";

const Terms = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className={styles.legal}>
          <h1 className="section-title">Terms and Conditions</h1>
          <div className={styles.content}>
            <section className={styles.section}>
              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using Commandly, you agree to be bound by these
                Terms and Conditions. If you disagree with any part of the
                terms, you may not access the service.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Use License</h2>
              <p>
                Permission is granted to temporarily use Commandly for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Transfer the materials to another person</li>
                <li>Attempt to decompile or reverse engineer any software</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>User Account</h2>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password. You agree to accept responsibility for all
                activities that occur under your account.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Service Modifications</h2>
              <p>
                We reserve the right to withdraw or amend our service, and any
                service or material we provide, in our sole discretion without
                notice. We will not be liable if for any reason all or any part
                of the service is unavailable at any time or for any period.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Limitation of Liability</h2>
              <p>
                In no event shall Commandly or its suppliers be liable for any
                damages arising out of the use or inability to use the materials
                on our service, even if we have been notified orally or in
                writing of the possibility of such damage.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at <a href="mailto:legal@commandly.app">legal@commandly.app</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
