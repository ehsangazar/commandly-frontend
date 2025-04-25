import { useParams, Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiShare2,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";

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
    content: `
      <p>In the rapidly evolving landscape of software development, the tools we use to write code are undergoing a significant transformation. Artificial Intelligence and automation are no longer just buzzwords—they're becoming integral parts of our development workflow.</p>

      <h2>The Rise of AI in Development</h2>
      <p>AI-powered tools are changing how developers approach their work. From intelligent code completion to automated testing, these tools are helping developers focus on what matters most: solving problems and building great software.</p>

      <h2>Commandly's Approach</h2>
      <p>At Commandly, we're at the forefront of this transformation. Our platform combines the power of AI with deep insights into developer behavior to create tools that adapt to your workflow, not the other way around.</p>

      <h2>What's Next?</h2>
      <p>The future of developer productivity tools lies in their ability to understand context, predict needs, and automate routine tasks. We're excited to be part of this journey and can't wait to share what we're building next.</p>
    `,
    author: {
      name: "Sarah Johnson",
      role: "Product Lead",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  },
  {
    id: 2,
    title: "Building Scalable Command-Line Tools",
    excerpt:
      "A deep dive into the architecture and design principles behind Commandly's command-line interface.",
    date: "2024-04-10",
    readTime: "7 min read",
    category: "Engineering",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    content: `
      <p>Command-line tools are the backbone of developer productivity. At Commandly, we've spent years refining our approach to building CLI tools that scale with your needs.</p>

      <h2>Architecture Principles</h2>
      <p>Our CLI tools are built with scalability in mind. We use a modular architecture that allows for easy extension and customization while maintaining performance.</p>

      <h2>Performance Optimization</h2>
      <p>Speed is crucial in CLI tools. We've implemented various optimizations to ensure our tools remain fast even as they grow in complexity.</p>

      <h2>User Experience</h2>
      <p>A great CLI tool isn't just about functionality—it's about providing an intuitive and efficient experience for developers.</p>
    `,
    author: {
      name: "Michael Chen",
      role: "Senior Engineer",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  },
  {
    id: 3,
    title: "The Psychology of Developer Productivity",
    excerpt:
      "Understanding the mental models and habits that make developers more productive and how tools can support them.",
    date: "2024-04-05",
    readTime: "6 min read",
    category: "Productivity",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    content: `
      <p>Productivity isn't just about tools—it's about understanding how developers think and work. Let's explore the psychology behind developer productivity.</p>

      <h2>Flow State</h2>
      <p>Understanding and supporting the flow state is crucial for developer productivity. We'll look at how tools can help maintain this state.</p>

      <h2>Cognitive Load</h2>
      <p>Reducing cognitive load is key to maintaining productivity. We'll examine strategies for minimizing mental overhead.</p>

      <h2>Habit Formation</h2>
      <p>Building productive habits is essential for long-term success. We'll explore how tools can support habit formation.</p>
    `,
    author: {
      name: "Emily Rodriguez",
      role: "UX Researcher",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  },
  {
    id: 4,
    title: "Commandly's Journey to 10,000 Users",
    excerpt:
      "The story of how Commandly grew from a simple idea to a product used by thousands of developers worldwide.",
    date: "2024-03-28",
    readTime: "8 min read",
    category: "Company",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    content: `
      <p>From a small startup to serving thousands of developers worldwide, Commandly's journey has been one of continuous learning and growth.</p>

      <h2>The Early Days</h2>
      <p>Our story begins with a simple observation: developers spend too much time managing their tools instead of writing code.</p>

      <h2>Key Milestones</h2>
      <p>We'll walk through the major milestones that shaped Commandly's growth and development.</p>

      <h2>Lessons Learned</h2>
      <p>Building a successful developer tool comes with its challenges. We'll share the key lessons we've learned along the way.</p>

      <h2>Looking Ahead</h2>
      <p>As we continue to grow, we remain committed to our mission of making developers more productive.</p>
    `,
    author: {
      name: "David Wilson",
      role: "CEO & Co-founder",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  },
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((post) => post.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-bold text-[var(--commandly-text-primary)] mb-4">
            Post Not Found
          </h1>
          <p className="text-[var(--commandly-text-secondary)] mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center text-[var(--commandly-primary)] hover:text-[var(--commandly-primary-hover)]"
          >
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--commandly-background)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link
          to="/blog"
          className="inline-flex items-center text-[var(--commandly-text-secondary)] hover:text-[var(--commandly-primary)] mb-8"
        >
          <FiArrowLeft className="mr-2" />
          Back to Blog
        </Link>

        <article>
          <header className="mb-12">
            <div className="flex items-center gap-4 text-[var(--commandly-text-secondary)] mb-6">
              <span className="px-3 py-1 rounded-full bg-[var(--commandly-primary)] bg-opacity-10 text-[var(--commandly-primary)] text-sm">
                {post.category}
              </span>
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <FiClock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[var(--commandly-text-primary)] mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-semibold text-[var(--commandly-text-primary)]">
                  {post.author.name}
                </div>
                <div className="text-[var(--commandly-text-secondary)]">
                  {post.author.role}
                </div>
              </div>
            </div>
          </header>

          <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div
            className="prose prose-lg max-w-none text-[var(--commandly-text-secondary)]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-[var(--commandly-border)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)]">
                Share this post
              </h2>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-[var(--commandly-hover)] transition-colors duration-200">
                  <FiTwitter className="w-5 h-5 text-[var(--commandly-text-secondary)]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[var(--commandly-hover)] transition-colors duration-200">
                  <FiLinkedin className="w-5 h-5 text-[var(--commandly-text-secondary)]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[var(--commandly-hover)] transition-colors duration-200">
                  <FiShare2 className="w-5 h-5 text-[var(--commandly-text-secondary)]" />
                </button>
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)] mb-8">
                  Related Posts
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="bg-[var(--commandly-hover)] rounded-lg overflow-hidden"
                    >
                      <div className="relative h-48">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[var(--commandly-text-primary)] mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-[var(--commandly-text-secondary)]">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
