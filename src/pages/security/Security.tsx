import { FiShield } from "react-icons/fi";

const Security = () => {
  return (
    <div className="min-h-screen bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--commandly-hover)] rounded-lg p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-full bg-[var(--commandly-primary)] p-3">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--commandly-text-primary)]">
              Security Policy
            </h1>
          </div>
          <p className="text-[var(--commandly-text-secondary)] mb-8">
            <strong>Last Updated: April 23, 2025</strong>
          </p>

          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Our Commitment to Security
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                At Commandly.dev, we take security seriously. We implement
                industry-standard security measures to protect your data and
                ensure the safety of our services. This document outlines our
                security practices and the measures we take to safeguard your
                information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Data Protection
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Encryption
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>All data in transit is encrypted using TLS 1.3</li>
                    <li>Data at rest is encrypted using AES-256</li>
                    <li>End-to-end encryption for sensitive user data</li>
                    <li>Secure key management and rotation policies</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Access Control
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Role-based access control (RBAC)</li>
                    <li>Multi-factor authentication (MFA) for all employees</li>
                    <li>Regular access reviews and audits</li>
                    <li>Principle of least privilege</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Infrastructure Security
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Cloud Infrastructure
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Hosted on secure, SOC 2 compliant cloud providers</li>
                    <li>Regular security patching and updates</li>
                    <li>Network segmentation and firewalls</li>
                    <li>DDoS protection and mitigation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Monitoring and Logging
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>24/7 security monitoring</li>
                    <li>Automated threat detection</li>
                    <li>Comprehensive audit logging</li>
                    <li>Real-time alerting system</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Application Security
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Development Practices
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Secure coding standards and guidelines</li>
                    <li>Regular security training for developers</li>
                    <li>Automated security testing in CI/CD pipeline</li>
                    <li>Code review process with security focus</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Testing and Validation
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Regular penetration testing</li>
                    <li>Vulnerability scanning</li>
                    <li>Third-party security audits</li>
                    <li>Bug bounty program</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Incident Response
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                We maintain a comprehensive incident response plan to handle
                security incidents effectively. Our process includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>Immediate incident detection and assessment</li>
                <li>Rapid response and containment</li>
                <li>Thorough investigation and analysis</li>
                <li>Transparent communication with affected users</li>
                <li>Post-incident review and improvement</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Compliance and Certifications
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                We maintain compliance with relevant security standards and
                regulations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>GDPR compliance for data protection</li>
                <li>CCPA compliance for California residents</li>
                <li>Regular third-party security audits</li>
                <li>Industry-standard security certifications</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Reporting Security Issues
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                If you believe you've found a security vulnerability in our
                service, please report it to us immediately at{" "}
                <a
                  href="mailto:security@commandly.dev"
                  className="text-[var(--commandly-primary)] hover:underline"
                >
                  security@commandly.dev
                </a>
                . We appreciate your help in keeping our service secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Updates to This Policy
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                We may update this Security Policy from time to time to reflect
                changes in our security practices or for other operational,
                legal, or regulatory reasons. We encourage you to review this
                policy periodically.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
