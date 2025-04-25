import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiExternalLink,
} from "react-icons/fi";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    location: "Remote",
    type: "Full-time",
    salary: "Competitive",
    description:
      "Join our frontend team to build beautiful and performant user interfaces using React and TypeScript.",
    responsibilities: [
      "Develop and maintain high-quality, responsive user interfaces",
      "Collaborate with designers and backend developers to implement new features",
      "Optimize application performance and user experience",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and contribute to technical discussions",
    ],
    requirements: [
      "5+ years of experience in frontend development",
      "Strong proficiency in React, TypeScript, and modern JavaScript",
      "Experience with state management libraries (Redux, Zustand, etc.)",
      "Familiarity with testing frameworks (Jest, React Testing Library)",
      "Understanding of web performance optimization techniques",
      "Experience with CI/CD pipelines and modern development tools",
    ],
    benefits: [
      "Competitive salary and equity options",
      "Fully remote work environment",
      "Flexible working hours",
      "Health insurance and wellness programs",
      "Learning and development budget",
      "Regular team retreats",
    ],
    applyLink:
      "mailto:careers@commandly.dev?subject=Application for Senior Frontend Developer",
  },
  {
    id: 2,
    title: "Backend Engineer",
    location: "Remote",
    type: "Full-time",
    salary: "Competitive",
    description:
      "Help us scale our backend infrastructure and build robust APIs using Node.js and Python.",
    responsibilities: [
      "Design and implement scalable backend services and APIs",
      "Optimize database performance and query efficiency",
      "Implement security best practices and data protection measures",
      "Collaborate with frontend developers to integrate APIs",
      "Monitor and maintain system health and performance",
    ],
    requirements: [
      "5+ years of experience in backend development",
      "Strong proficiency in Node.js and/or Python",
      "Experience with database design and optimization",
      "Knowledge of cloud platforms (AWS, GCP, or Azure)",
      "Understanding of microservices architecture",
      "Experience with containerization and orchestration tools",
    ],
    benefits: [
      "Competitive salary and equity options",
      "Fully remote work environment",
      "Flexible working hours",
      "Health insurance and wellness programs",
      "Learning and development budget",
      "Regular team retreats",
    ],
    applyLink:
      "mailto:careers@commandly.dev?subject=Application for Backend Engineer",
  },
  {
    id: 3,
    title: "Product Designer",
    location: "Remote",
    type: "Full-time",
    salary: "Competitive",
    description:
      "Design intuitive user experiences and beautiful interfaces for our developer tools.",
    responsibilities: [
      "Create user-centered designs through research and testing",
      "Develop wireframes, prototypes, and high-fidelity designs",
      "Collaborate with developers to implement designs",
      "Conduct user research and usability testing",
      "Maintain and evolve design systems",
    ],
    requirements: [
      "4+ years of experience in product design",
      "Strong portfolio showcasing UX/UI work",
      "Proficiency in design tools (Figma, Sketch, etc.)",
      "Experience with user research and testing",
      "Understanding of frontend development principles",
      "Excellent communication and collaboration skills",
    ],
    benefits: [
      "Competitive salary and equity options",
      "Fully remote work environment",
      "Flexible working hours",
      "Health insurance and wellness programs",
      "Learning and development budget",
      "Regular team retreats",
    ],
    applyLink:
      "mailto:careers@commandly.dev?subject=Application for Product Designer",
  },
];

const JobDetail = () => {
  const { id } = useParams();
  const job = jobOpenings.find((job) => job.id === Number(id));

  if (!job) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-[var(--commandly-text-primary)] mb-4">
            Job Not Found
          </h1>
          <p className="text-[var(--commandly-text-secondary)] mb-8">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/careers"
            className="inline-flex items-center text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)]"
          >
            <FiArrowLeft className="mr-2" />
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link
          to="/careers"
          className="inline-flex items-center text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] mb-8"
        >
          <FiArrowLeft className="mr-2" />
          Back to Careers
        </Link>

        <div className="bg-[var(--commandly-hover)] rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-4">
            {job.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-[var(--commandly-text-secondary)] mb-6">
            <div className="flex items-center">
              <FiMapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <FiClock className="w-4 h-4 mr-1" />
              {job.type}
            </div>
            <div className="flex items-center">
              <FiDollarSign className="w-4 h-4 mr-1" />
              {job.salary}
            </div>
          </div>
          <p className="text-[var(--commandly-text-secondary)] mb-6">
            {job.description}
          </p>
          <a
            href={job.applyLink}
            className="inline-flex items-center bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Apply Now
            <FiExternalLink className="ml-2" />
          </a>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-4">
              Responsibilities
            </h2>
            <ul className="list-disc list-inside text-[var(--commandly-text-secondary)] space-y-2">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-4">
              Requirements
            </h2>
            <ul className="list-disc list-inside text-[var(--commandly-text-secondary)] space-y-2">
              {job.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-4">
              Benefits
            </h2>
            <ul className="list-disc list-inside text-[var(--commandly-text-secondary)] space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>

          <div className="text-center">
            <a
              href={job.applyLink}
              className="inline-flex items-center bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Apply Now
              <FiExternalLink className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
