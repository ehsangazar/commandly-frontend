import { Link } from "react-router-dom";
import { FiZap, FiShield, FiCommand, FiClock } from "react-icons/fi";

const About = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--commandly-text-primary)] mb-6 leading-tight">
            Browse Smarter with AI
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--commandly-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Commandly puts the power of AI in your hands, helping you browse
            faster, work smarter, and achieve more in less time.
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-6">
                Our Vision
              </h2>
              <p className="text-[var(--commandly-text-secondary)] mb-4">
                In a world where information overload is the norm, we saw an
                opportunity to revolutionize how people interact with the web.
                Commandly was born from a simple idea: what if your browser
                could think for itself?
              </p>
              <p className="text-[var(--commandly-text-secondary)]">
                We're building the future of intelligent browsing, where AI
                works alongside you to make every web interaction more
                productive and meaningful.
              </p>
            </div>
            <div className="bg-[var(--commandly-hover)] rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--commandly-primary)]">
                    50%
                  </div>
                  <div className="text-[var(--commandly-text-secondary)]">
                    Faster Browsing
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--commandly-primary)]">
                    10x
                  </div>
                  <div className="text-[var(--commandly-text-secondary)]">
                    More Productive
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--commandly-primary)]">
                    24/7
                  </div>
                  <div className="text-[var(--commandly-text-secondary)]">
                    AI Assistance
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--commandly-primary)]">
                    100%
                  </div>
                  <div className="text-[var(--commandly-text-secondary)]">
                    Privacy Focused
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-12 text-center">
            Why Choose Commandly?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[var(--commandly-hover)] rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 flex items-center justify-center mb-4">
                <FiZap className="w-6 h-6 text-[var(--commandly-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
                AI-Powered Browsing
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Our AI learns from your browsing patterns to predict your needs
                and automate routine tasks.
              </p>
            </div>
            <div className="bg-[var(--commandly-hover)] rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 flex items-center justify-center mb-4">
                <FiCommand className="w-6 h-6 text-[var(--commandly-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
                Smart Commands
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Control your browser with natural language commands and keyboard
                shortcuts.
              </p>
            </div>
            <div className="bg-[var(--commandly-hover)] rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 flex items-center justify-center mb-4">
                <FiClock className="w-6 h-6 text-[var(--commandly-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
                Time Management
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Track and optimize your browsing time with intelligent insights
                and suggestions.
              </p>
            </div>
            <div className="bg-[var(--commandly-hover)] rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 flex items-center justify-center mb-4">
                <FiShield className="w-6 h-6 text-[var(--commandly-primary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
                Privacy First
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Your data stays on your device. We never sell or share your
                browsing information.
              </p>
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
              <p className="text-[var(--commandly-text-secondary)] mb-4">
                We believe that the future of browsing is intelligent,
                personalized, and efficient. Our mission is to empower users
                with AI tools that make their online experience more productive
                and enjoyable.
              </p>
              <p className="text-[var(--commandly-text-secondary)]">
                By combining cutting-edge AI with user-friendly design, we're
                creating a browsing experience that adapts to you, not the other
                way around.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="bg-[var(--commandly-hover)] rounded-lg p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] flex items-center justify-center text-white">
                      <FiZap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                        Speed
                      </h3>
                      <p className="text-[var(--commandly-text-secondary)]">
                        AI-powered browsing that's 50% faster
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] flex items-center justify-center text-white">
                      <FiCommand className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                        Intelligence
                      </h3>
                      <p className="text-[var(--commandly-text-secondary)]">
                        Smart suggestions and automation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--commandly-primary)] flex items-center justify-center text-white">
                      <FiShield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                        Privacy
                      </h3>
                      <p className="text-[var(--commandly-text-secondary)]">
                        Your data stays on your device
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
            Ready to Browse Smarter?
          </h2>
          <p className="text-[var(--commandly-text-secondary)] mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the future of
            intelligent browsing with Commandly.
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
