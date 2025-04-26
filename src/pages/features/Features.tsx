import {
  FaChartLine,
  FaThLarge,
  FaLightbulb,
  FaLanguage,
  FaRegFileAlt,
} from "react-icons/fa";

const features = [
  {
    title: "Screen Time Tracking & Analytics",
    description:
      "Monitor your browsing habits and gain insights into your productivity with real-time analytics.",
    icon: (
      <FaChartLine className="text-4xl text-[var(--commandly-primary)] mb-4" />
    ),
  },
  {
    title: "Customizable Widget Layout",
    description:
      "Personalize your dashboard with widgets that fit your workflow and style.",
    icon: (
      <FaThLarge className="text-4xl text-[var(--commandly-primary)] mb-4" />
    ),
  },
  {
    title: "Smart Recommendations",
    description:
      "Get AI-powered suggestions to optimize your browsing and boost productivity.",
    icon: (
      <FaLightbulb className="text-4xl text-[var(--commandly-primary)] mb-4" />
    ),
  },
  {
    title: "Translation",
    description:
      "Instantly translate any webpage or selected text with high accuracy.",
    icon: (
      <FaLanguage className="text-4xl text-[var(--commandly-primary)] mb-4" />
    ),
  },
  {
    title: "Summarisation",
    description:
      "Quickly understand long articles or documents with concise AI-generated summaries.",
    icon: (
      <FaRegFileAlt className="text-4xl text-[var(--commandly-primary)] mb-4" />
    ),
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--commandly-background)] via-[var(--commandly-background-alt)] to-white py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--commandly-primary)] text-center mb-4">
          Explore Commandly's Features
        </h1>
        <p className="text-lg text-[var(--commandly-text-secondary)] text-center mb-12 max-w-2xl mx-auto">
          Discover the powerful tools that make your browsing smarter, more
          productive, and uniquely yours.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl flex flex-col items-center border border-[var(--commandly-primary)]/10 transition-transform hover:scale-105 hover:shadow-2xl hover:border-[var(--commandly-primary)]/30 duration-200"
            >
              {feature.icon}
              <h2 className="text-2xl font-semibold text-[var(--commandly-primary)] mb-2 text-center">
                {feature.title}
              </h2>
              <p className="text-[var(--commandly-text-secondary)] text-lg text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
