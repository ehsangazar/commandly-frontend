import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--commandly-text-primary)] mb-6 leading-tight">
            About Commandly
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--commandly-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Empowering developers with intelligent productivity tools
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-6">
                Our Story
              </h2>
              <p className="text-[var(--commandly-text-secondary)] mb-4">
                Founded in 2024, Commandly emerged from a simple observation:
                developers spend too much time managing tools instead of writing
                code. What began as a solution to track and optimize
                command-line usage has evolved into a comprehensive platform
                that helps developers work smarter.
              </p>
              <p className="text-[var(--commandly-text-secondary)]">
                Today, Commandly is used by thousands of developers worldwide,
                helping them understand and improve their development workflows
                through intelligent analytics and automation.
              </p>
            </div>
            <div className="bg-[var(--commandly-hover)] rounded-lg p-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--commandly-primary)]">
                    10K+
                  </div>
                  <div className="text-[var(--commandly-text-secondary)]">
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--commandly-primary)]">
                    1M+
                  </div>
                  <div className="text-[var(--commandly-text-secondary)]">
                    Commands Analyzed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--commandly-primary)]">
                    30%
                  </div>
                  <div className="text-[var(--commandly-text-secondary)]">
                    Time Saved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-6">
                Our Mission
              </h2>
              <p className="text-[var(--commandly-text-secondary)]">
                We believe that great software is built when developers can
                focus on what matters most: solving problems. Our mission is to
                eliminate the friction in development workflows by providing
                intelligent insights and automation.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-[var(--commandly-hover)] rounded-lg p-8 h-full">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                        Speed
                      </h3>
                      <p className="text-[var(--commandly-text-secondary)]">
                        Accelerate your development workflow
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                        Security
                      </h3>
                      <p className="text-[var(--commandly-text-secondary)]">
                        Enterprise-grade security features
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] flex items-center justify-center text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                        Customization
                      </h3>
                      <p className="text-[var(--commandly-text-secondary)]">
                        Tailor the experience to your needs
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-[var(--commandly-text-secondary)] mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using Commandly to
            enhance their productivity and streamline their workflows.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/download"
              className="bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Download Now
            </Link>
            <Link
              to="/contact"
              className="bg-[var(--commandly-hover)] hover:bg-[var(--commandly-hover)] text-[var(--commandly-text-primary)] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
