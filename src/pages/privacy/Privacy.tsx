import { FiFileText } from "react-icons/fi";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--commandly-hover)] rounded-lg p-8 shadow-sm">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-full bg-[var(--commandly-primary)] p-3">
              <FiFileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--commandly-text-primary)]">
              Privacy Policy
            </h1>
          </div>
          <p className="text-[var(--commandly-text-secondary)] mb-8">
            <strong>Last Updated: April 23, 2025</strong>
          </p>

          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Introduction
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                Welcome to Commandly.dev. We respect your privacy and are
                committed to protecting your personal data. This privacy policy
                will inform you about how we look after your personal data when
                you use our Chrome extension and website, and tell you about
                your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Who We Are
              </h2>
              <p className="text-[var(--commandly-text-secondary)] leading-relaxed">
                Commandly.dev is a Chrome extension that provides smart
                contextual actions such as translation, explanations, and
                content clipping on webpages, along with a customizable
                dashboard for monitoring screen time and productivity.
              </p>
              <div className="mt-4">
                <p className="text-[var(--commandly-text-secondary)]">
                  <strong>Contact Details:</strong>
                </p>
                <p className="text-[var(--commandly-text-secondary)]">
                  Email: privacy@commandly.dev
                </p>
                <p className="text-[var(--commandly-text-secondary)]">
                  Website: https://commandly.dev
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                What Data We Collect
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We collect and process the following categories of personal
                data:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Authentication Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>User credentials (encrypted)</li>
                    <li>Login information</li>
                    <li>Account details</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Web History
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>URLs of visited websites</li>
                    <li>Page titles</li>
                    <li>Time and duration of visits</li>
                    <li>Browsing patterns and habits</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    User Activity
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Interactions with websites</li>
                    <li>Screen time statistics</li>
                    <li>Feature usage within our extension</li>
                    <li>Widget preferences and configurations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Website Content
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Text selected for translation or explanation</li>
                    <li>Content saved through the clipping feature</li>
                    <li>Website elements you interact with</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Location Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>
                      IP addresses (used for service functionality and security)
                    </li>
                    <li>General geographic region (not precise location)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Personally Identifiable Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>
                      Email address (for account creation and communications)
                    </li>
                    <li>Name (if provided)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                How We Collect Your Data
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We collect data through:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>
                  <strong>Direct Interactions:</strong> Information you provide
                  when creating an account, setting preferences, or using the
                  extension features.
                </li>
                <li>
                  <strong>Automated Technologies:</strong> Our extension
                  automatically collects data about your browsing habits when
                  you have granted the necessary permissions and enabled
                  relevant features.
                </li>
                <li>
                  <strong>Third-Party Services:</strong> We may receive data
                  from analytics providers and technical service providers that
                  support our extension functionality.
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                How We Use Your Data
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    To Provide Core Extension Functionality
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Process translation requests</li>
                    <li>Generate explanations for selected content</li>
                    <li>Save and organize clipped content</li>
                    <li>Personalize your dashboard widgets</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    To Improve User Experience
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Analyze feature usage to improve our services</li>
                    <li>Identify and fix technical issues</li>
                    <li>Develop new features based on user behavior</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    To Maintain Your Account
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Authenticate your identity</li>
                    <li>Sync your settings and saved content across devices</li>
                    <li>
                      Process subscription or payment information if applicable
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    To Communicate With You
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Send service updates and notifications</li>
                    <li>Respond to your inquiries and support requests</li>
                    <li>Provide information about new features or services</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Data Processing and Storage
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Local Processing
                  </h3>
                  <p className="text-[var(--commandly-text-secondary)]">
                    Where possible, we process your data locally on your device
                    to minimize data transmission. This includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Basic translation functions</li>
                    <li>User interface rendering</li>
                    <li>Local storage of preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                    Remote Processing
                  </h3>
                  <p className="text-[var(--commandly-text-secondary)]">
                    Some features require processing on our secure servers,
                    including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                    <li>Advanced translation capabilities</li>
                    <li>AI-powered explanations</li>
                    <li>Cross-device synchronization</li>
                    <li>Analytics processing for dashboard insights</li>
                  </ul>
                  <p className="text-[var(--commandly-text-secondary)] mt-4">
                    All data transmitted to our servers is encrypted using
                    industry-standard TLS protocols. We store your data on
                    secure cloud infrastructure with appropriate technical and
                    organizational measures to protect against unauthorized
                    access.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Data Retention
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We retain your personal data only for as long as necessary to
                fulfill the purposes for which we collected it, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>
                  <strong>Account Information:</strong> Retained until you
                  delete your account
                </li>
                <li>
                  <strong>Browsing History:</strong> Retained for 90 days to
                  provide dashboard analytics
                </li>
                <li>
                  <strong>Clipped Content:</strong> Retained until you delete it
                  from your account
                </li>
                <li>
                  <strong>Usage Statistics:</strong> Aggregated after 30 days
                  and retained as anonymized data
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Your Legal Rights
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                Depending on your location, you may have the following rights
                regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>
                  <strong>Access:</strong> Request copies of your personal data
                </li>
                <li>
                  <strong>Rectification:</strong> Request correction of
                  incomplete or inaccurate data
                </li>
                <li>
                  <strong>Erasure:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Restriction:</strong> Request limited processing of
                  your data
                </li>
                <li>
                  <strong>Data Portability:</strong> Request transfer of your
                  data
                </li>
                <li>
                  <strong>Objection:</strong> Object to processing of your data
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Revoke previously given
                  consent
                </li>
              </ul>
              <p className="text-[var(--commandly-text-secondary)] mt-4">
                To exercise any of these rights, please contact us at
                privacy@commandly.dev. We will respond to all legitimate
                requests within 30 days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Third-Party Services
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                Our extension may use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[var(--commandly-text-secondary)]">
                <li>
                  <strong>Translation APIs:</strong> To process translation
                  requests
                </li>
                <li>
                  <strong>Cloud Storage Providers:</strong> To store user data
                  securely
                </li>
                <li>
                  <strong>Analytics Services:</strong> To improve our service
                  and features
                </li>
              </ul>
              <p className="text-[var(--commandly-text-secondary)] mt-4">
                Each third-party service provider is carefully selected and
                required to provide appropriate security measures for your
                personal data.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Cookies and Similar Technologies
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                Our website and extension may use cookies and similar tracking
                technologies to distinguish you from other users and to remember
                your preferences. This helps us to provide you with a good
                experience and to improve our service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Children's Privacy
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                Our service is not intended for children under 16 years of age,
                and we do not knowingly collect personal data from children. If
                you are a parent or guardian and believe your child has provided
                us with personal data, please contact us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                International Transfers
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We may transfer your personal data to countries outside your
                jurisdiction. When we do, we ensure similar protection is
                afforded by implementing appropriate safeguards, such as
                standard contractual clauses approved by relevant authorities.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Changes to This Privacy Policy
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We may update this privacy policy from time to time. The updated
                version will be indicated by an updated "Last Updated" date at
                the top of this document. We encourage you to review this
                privacy policy periodically.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                How to Contact Us
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                If you have any questions about this privacy policy or our
                privacy practices, please contact us at:
              </p>
              <div className="mt-4">
                <p className="text-[var(--commandly-text-secondary)]">
                  Email: privacy@commandly.dev
                </p>
                <p className="text-[var(--commandly-text-secondary)]">
                  Website: https://commandly.dev/contact
                </p>
              </div>
              <p className="text-[var(--commandly-text-secondary)] mt-4">
                If you are not satisfied with our response, you have the right
                to lodge a complaint with the relevant data protection authority
                in your jurisdiction.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)]">
                Consent
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                By using our Chrome extension and website, you consent to this
                privacy policy and our collection, processing, and sharing of
                your information as described herein.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
