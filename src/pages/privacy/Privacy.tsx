const Privacy = () => {
  return (
    <div className="min-h-screen bg-[var(--commandly-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--commandly-hover)] rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-8">
            Privacy Policy
          </h1>
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Introduction
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                At Commandly, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Information We Collect
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>Account information (email address)</li>
                <li>Usage data and preferences</li>
                <li>Communication data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                How We Use Your Information
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>Provide and maintain our service</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Data Security
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, no
                method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Your Rights
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Contact Us
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:privacy@commandly.app"
                  className="text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)] hover:underline"
                >
                  privacy@commandly.app
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
