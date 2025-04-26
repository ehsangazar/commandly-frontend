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
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--commandly-primary)] via-[var(--commandly-primary)] to-[var(--commandly-primary-hover)] opacity-90"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM2LjYyNyAwIDEyLTUuMzczIDEyLTEyUzQyLjYyNyAxMCAzNiAxMGMtNi42MjggMC0xMiA1LjM3My0xMiAxMnM1LjM3MiAxMiAxMiAxMnptMC0yYy01LjUyMyAwLTEwLTQuNDc3LTEwLTEwUzMwLjQ3NyAxMiAzNiAxMnMxMCA0LjQ3NyAxMCAxMC00LjQ3NyAxMC0xMCAxMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Transform Your Browsing Experience Today
          </h2>
          <p className="text-xl sm:text-2xl text-white mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who have already enhanced their productivity
            with Commandly. Start your journey to smarter browsing now.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/download"
              className="bg-white text-[var(--commandly-primary)] hover:bg-white/95 font-bold py-4 px-8 rounded-lg transition-all duration-200 text-lg inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Install Commandly Now
            </Link>
            <Link
              to="/features"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold hover:bg-white/20 py-4 px-8 rounded-lg transition-all duration-200 text-lg inline-block"
            >
              Explore Features
            </Link>
          </div>
          <p className="mt-6 text-white text-sm font-medium">
            Free to install • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
