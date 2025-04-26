import { FiDownload, FiChrome, FiCheck, FiArrowRight } from "react-icons/fi";

const Download = () => {
  const features = [
    {
      title: "AI-Powered Browsing",
      description:
        "Get intelligent assistance while browsing with our advanced AI technology.",
    },
    {
      title: "Smart Summarization",
      description:
        "Quickly understand long articles with AI-generated summaries.",
    },
    {
      title: "Intelligent Search",
      description:
        "Find what you need faster with context-aware search capabilities.",
    },
    {
      title: "Personalized Experience",
      description: "Adapts to your browsing habits for a tailored experience.",
    },
    {
      title: "Cross-Platform Sync",
      description: "Seamlessly sync your data across all your devices.",
    },
    {
      title: "Privacy Focused",
      description: "Your data stays secure with end-to-end encryption.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-[var(--commandly-text-primary)] mb-6">
            Download Commandly
          </h1>
          <p className="text-xl text-[var(--commandly-text-secondary)] max-w-3xl mx-auto mb-8">
            Enhance your browsing experience with our powerful AI-powered
            browser extension. Available now for Chrome.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://chrome.google.com/webstore/detail/commandly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--commandly-primary)] text-white hover:bg-[var(--commandly-primary-hover)] transition-colors duration-200"
            >
              <FiChrome className="w-5 h-5 mr-2" />
              Add to Chrome
            </a>
            <a
              href="#features"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-[var(--commandly-border)] text-[var(--commandly-text-primary)] hover:bg-[var(--commandly-hover)] transition-colors duration-200"
            >
              Learn More
              <FiArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] text-center mb-12">
            Why Choose Commandly?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[var(--commandly-hover)] p-6 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-[var(--commandly-primary)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)]">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-[var(--commandly-text-secondary)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Guide */}
        <div className="bg-[var(--commandly-hover)] rounded-lg p-8 mb-20">
          <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-8">
            How to Install
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-4">
                For Chrome
              </h3>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <span className="text-[var(--commandly-text-secondary)]">
                    Click the "Add to Chrome" button above
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <span className="text-[var(--commandly-text-secondary)]">
                    Click "Add Extension" in the Chrome Web Store
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span className="text-[var(--commandly-text-secondary)]">
                    Pin the extension to your toolbar for easy access
                  </span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-4">
                System Requirements
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-[var(--commandly-text-secondary)]">
                  <FiCheck className="w-4 h-4 text-[var(--commandly-primary)]" />
                  Chrome browser version 88 or later
                </li>
                <li className="flex items-center gap-2 text-[var(--commandly-text-secondary)]">
                  <FiCheck className="w-4 h-4 text-[var(--commandly-primary)]" />
                  Windows 10/11, macOS 10.15+, or Linux
                </li>
                <li className="flex items-center gap-2 text-[var(--commandly-text-secondary)]">
                  <FiCheck className="w-4 h-4 text-[var(--commandly-primary)]" />
                  Internet connection for AI features
                </li>
                <li className="flex items-center gap-2 text-[var(--commandly-text-secondary)]">
                  <FiCheck className="w-4 h-4 text-[var(--commandly-primary)]" />
                  500MB of free disk space
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-[var(--commandly-hover)] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
                Is Commandly free to use?
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Yes, Commandly offers a free tier with basic features. We also
                have premium plans with additional capabilities for power users.
              </p>
            </div>
            <div className="bg-[var(--commandly-hover)] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
                How does Commandly protect my privacy?
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                We take privacy seriously. All data is encrypted, and we never
                sell your information. You can read more in our Privacy Policy.
              </p>
            </div>
            <div className="bg-[var(--commandly-hover)] p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
                Will Commandly be available for other browsers?
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                We're currently focused on Chrome, but we plan to expand to
                other browsers in the future. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Download;
