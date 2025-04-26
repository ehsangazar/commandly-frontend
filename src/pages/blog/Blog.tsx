import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiTag } from "react-icons/fi";
import postsData from "../../data/posts.json";

const Blog = () => {
  const { posts } = postsData;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--commandly-text-primary)] mb-4">
            Blog
          </h1>
          <p className="text-xl text-[var(--commandly-text-secondary)] max-w-2xl mx-auto">
            Insights, updates, and stories about intelligent browsing and
            AI-powered productivity.
          </p>
        </div>

        {/* Featured Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)] mb-6">
            Featured Posts
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {posts
              .filter((post) => post.featured)
              .map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                  <div className="bg-[var(--commandly-hover)] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-[var(--commandly-text-secondary)] mb-3">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiTag className="w-4 h-4" />
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2 group-hover:text-[var(--commandly-primary)] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[var(--commandly-text-secondary)]">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* All Posts */}
        <div>
          <h2 className="text-2xl font-semibold text-[var(--commandly-text-primary)] mb-6">
            All Posts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="group">
                <div className="bg-[var(--commandly-hover)] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-[var(--commandly-text-secondary)] mb-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiTag className="w-4 h-4" />
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2 group-hover:text-[var(--commandly-primary)] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[var(--commandly-text-secondary)]">
                      {post.excerpt}
                    </p>
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
