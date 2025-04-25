import { Link } from "react-router-dom";
import { FiArrowRight, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "Remote",
      type: "Full-time",
      salary: "Competitive",
      description:
        "Join our frontend team to build beautiful and performant user interfaces using React and TypeScript.",
    },
    {
      id: 2,
      title: "Backend Engineer",
      location: "Remote",
      type: "Full-time",
      salary: "Competitive",
      description:
        "Help us scale our backend infrastructure and build robust APIs using Node.js and Python.",
    },
    {
      id: 3,
      title: "Product Designer",
      location: "Remote",
      type: "Full-time",
      salary: "Competitive",
      description:
        "Design intuitive user experiences and beautiful interfaces for our developer tools.",
    },
  ];

  const benefits = [
    {
      title: "Remote Work",
      description:
        "Work from anywhere in the world with our fully remote setup.",
    },
    {
      title: "Competitive Salary",
      description:
        "We offer competitive compensation packages and equity options.",
    },
    {
      title: "Learning & Development",
      description:
        "Annual learning budget and conference attendance opportunities.",
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs.",
    },
    {
      title: "Flexible Hours",
      description:
        "Set your own schedule and work when you're most productive.",
    },
    {
      title: "Team Retreats",
      description:
        "Regular team meetups in exciting locations around the world.",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--commandly-text-primary)] mb-6 leading-tight">
            Join Our Team
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--commandly-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Help us build the future of developer productivity tools
          </p>
        </div>

        {/* Culture Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-6">
                Our Culture
              </h2>
              <p className="text-[var(--commandly-text-secondary)] mb-4">
                At Commandly, we believe in creating an environment where
                talented individuals can do their best work. We value
                collaboration, innovation, and continuous learning.
              </p>
              <p className="text-[var(--commandly-text-secondary)]">
                Our team is distributed across the globe, working together to
                build tools that make developers' lives easier. We're looking
                for passionate individuals who share our vision and want to make
                a real impact.
              </p>
            </div>
            <div className="bg-[var(--commandly-hover)] rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-lg font-semibold text-[var(--commandly-text-primary)]">
                      {benefit.title}
                    </h3>
                    <p className="text-[var(--commandly-text-secondary)]">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Job Openings Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-8 text-center">
            Current Openings
          </h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-[var(--commandly-hover)] rounded-lg p-6 hover:bg-[var(--commandly-hover)] transition-colors duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-[var(--commandly-text-secondary)]">
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
                    <p className="text-[var(--commandly-text-secondary)] mt-2">
                      {job.description}
                    </p>
                  </div>
                  <Link
                    to={`/careers/${job.id}`}
                    className="inline-flex items-center text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)] font-medium"
                  >
                    Learn More
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-[var(--commandly-text-primary)] mb-6">
            Don't See Your Role?
          </h2>
          <p className="text-[var(--commandly-text-secondary)] mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. If
            you don't see a role that matches your skills, we'd still love to
            hear from you.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/contact"
              className="bg-[var(--commandly-primary)] hover:bg-[var(--commandly-primary-hover)] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Careers;
