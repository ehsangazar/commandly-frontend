import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[var(--commandly-background-alt)] border-t border-[var(--commandly-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[var(--commandly-primary)]">
                Commandly
              </span>
            </div>
            <p className="text-[var(--commandly-text-secondary)]">
              Supercharge your browsing experience with AI-powered tools and
              customizable dashboards.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)] mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/features"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/download"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Download
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)] mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)] mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)]"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--commandly-border)] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[var(--commandly-text-secondary)] text-sm">
              © {new Date().getFullYear()} Commandly. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/accessibility"
                className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] text-sm"
              >
                Accessibility
              </Link>
              <Link
                to="/sitemap"
                className="text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] text-sm"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
