import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiArrowRight } from "react-icons/fi";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Developer Productivity Tools",
    excerpt:
      "Exploring how AI and automation are transforming the way developers work and how Commandly is leading the charge.",
    date: "2024-04-15",
    readTime: "5 min read",
    category: "Product",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
];

const Blog = () => {
  const featuredPost = blogPosts.find((post) => post.featured);
  const recentPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--commandly-text-primary)] mb-6 leading-tight">
            Blog
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--commandly-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            Insights, stories, and updates from the Commandly team
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-8">
              Featured Post
            </h2>
            <Link to={`/blog/${featuredPost.id}`}>
              <div className="bg-[var(--commandly-hover)] rounded-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-[var(--commandly-text-secondary)] mb-4">
                      <span className="px-3 py-1 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 text-[var(--commandly-primary)] text-sm">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-4">
                      {featuredPost.title}
                    </h3>
                    <p className="text-[var(--commandly-text-secondary)] mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="inline-flex items-center text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)]">
                      Read More
                      <FiArrowRight className="ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Recent Posts */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-8">
            Recent Posts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <div className="bg-[var(--commandly-hover)] rounded-lg overflow-hidden h-full">
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-[var(--commandly-text-secondary)] mb-4">
                      <span className="px-3 py-1 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 text-[var(--commandly-primary)] text-sm">
                        {post.category}
                      </span>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--commandly-text-primary)] mb-4">
                      {post.title}
                    </h3>
                    <p className="text-[var(--commandly-text-secondary)] mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[var(--commandly-text-secondary)]">
                        <FiClock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                      <div className="inline-flex items-center text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)]">
                        Read More
                        <FiArrowRight className="ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
