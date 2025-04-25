import { Link } from "react-router-dom";
import {
  FaLanguage,
  FaLightbulb,
  FaClipboard,
  FaChartLine,
  FaPuzzlePiece,
} from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-[var(--commandly-background)]">
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--commandly-text-primary)] mb-6 leading-tight">
              Supercharge Your Browsing Experience
            </h1>
            <p className="text-xl sm:text-2xl text-[var(--commandly-text-secondary)] max-w-3xl mx-auto mb-12 leading-relaxed">
              Commandly is your AI-powered Chrome extension that enhances
              productivity, improves accessibility, and helps you understand any
              website better
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/download"
                className="bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Get Started
              </Link>
              <Link
                to="/features"
                className="bg-[var(--commandly-hover)] hover:bg-[var(--commandly-hover)] text-[var(--commandly-text-primary)] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[var(--commandly-background-alt)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[var(--commandly-text-primary)] mb-16">
            Powerful Features at Your Fingertips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[var(--commandly-background)] p-6 rounded-xl shadow-lg">
              <FaLanguage className="text-4xl text-[var(--commandly-primary)] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[var(--commandly-text-primary)]">
                Smart Translation
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Instantly translate any webpage with AI-powered accuracy
              </p>
            </div>
            <div className="bg-[var(--commandly-background)] p-6 rounded-xl shadow-lg">
              <FaLightbulb className="text-4xl text-[var(--commandly-primary)] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[var(--commandly-text-primary)]">
                AI Explanation
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Get clear explanations of complex content in any language
              </p>
            </div>
            <div className="bg-[var(--commandly-background)] p-6 rounded-xl shadow-lg">
              <FaClipboard className="text-4xl text-[var(--commandly-primary)] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[var(--commandly-text-primary)]">
                Smart Clipping
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Save and organize important content with intelligent tagging
              </p>
            </div>
            <div className="bg-[var(--commandly-background)] p-6 rounded-xl shadow-lg">
              <FaPuzzlePiece className="text-4xl text-[var(--commandly-primary)] mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[var(--commandly-text-primary)]">
                Custom Widgets
              </h3>
              <p className="text-[var(--commandly-text-secondary)]">
                Add and customize widgets to enhance your browsing experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-6">
                Your Personal Browser Dashboard
              </h2>
              <p className="text-lg text-[var(--commandly-text-secondary)] mb-8">
                Transform your browser into a powerful productivity hub with
                customizable widgets and real-time insights.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <FaChartLine className="text-[var(--commandly-primary)] mr-3" />
                  <span className="text-[var(--commandly-text-primary)]">
                    Screen time tracking and productivity analytics
                  </span>
                </li>
                <li className="flex items-center">
                  <FaPuzzlePiece className="text-[var(--commandly-primary)] mr-3" />
                  <span className="text-[var(--commandly-text-primary)]">
                    Customizable widget layout
                  </span>
                </li>
                <li className="flex items-center">
                  <FaLightbulb className="text-[var(--commandly-primary)] mr-3" />
                  <span className="text-[var(--commandly-text-primary)]">
                    Smart recommendations based on your browsing habits
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-[var(--commandly-background-alt)] p-8 rounded-xl shadow-lg">
              <div className="aspect-video bg-[var(--commandly-background)] rounded-lg flex items-center justify-center">
                <p className="text-[var(--commandly-text-secondary)]">
                  Dashboard Preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-[var(--commandly-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Browsing Experience?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already enhanced their productivity
            with Commandly
          </p>
          <Link
            to="/download"
            className="bg-white text-[var(--commandly-primary)] hover:bg-white/90 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg inline-block"
          >
            Install Commandly Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
