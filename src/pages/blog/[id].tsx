import { useParams, Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiArrowLeft,
  FiShare2,
  FiTwitter,
  FiLinkedin,
  FiTag,
} from "react-icons/fi";
import postsData from "../../data/posts.json";
import { useState } from "react";

type ContentBlock = {
  type: "paragraph" | "heading" | "list";
  text?: string;
  items?: string[];
};

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  image: string;
  content: ContentBlock[];
};

const BlogPost = () => {
  const { id } = useParams();
  const [showCopied, setShowCopied] = useState(false);
  const post = postsData.posts.find((post) => post.slug === id) as
    | BlogPost
    | undefined;

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

  const relatedPosts = postsData.posts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2) as BlogPost[];

  const renderContent = (content: ContentBlock[]) => {
    return content.map((block, index) => {
      switch (block.type) {
        case "paragraph":
          return (
            <p
              key={index}
              className="text-[var(--commandly-text-secondary)] mb-6 leading-relaxed"
            >
              {block.text}
            </p>
          );
        case "heading":
          return (
            <h2
              key={index}
              className="text-2xl font-bold text-[var(--commandly-text-primary)] mt-8 mb-4"
            >
              {block.text}
            </h2>
          );
        case "list":
          return (
            <ul key={index} className="list-disc list-inside mb-6 space-y-2">
              {block.items?.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-[var(--commandly-text-secondary)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          );
        default:
          return null;
      }
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = post?.title || "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copying URL to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  const handleTwitterShare = () => {
    const url = window.location.href;
    const text = encodeURIComponent(post?.title || "");
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
      url
    )}`;
    window.open(twitterUrl, "_blank");
  };

  const handleLinkedInShare = () => {
    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedInUrl, "_blank");
  };

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
            <p className="text-xl text-[var(--commandly-text-secondary)] mb-8">
              {post.excerpt}
            </p>
          </header>

          <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--commandly-border)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[var(--commandly-text-primary)]">
                Share this post
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleTwitterShare}
                  className="p-2 rounded-lg hover:bg-[var(--commandly-hover)] transition-colors duration-200"
                  aria-label="Share on Twitter"
                >
                  <FiTwitter className="w-5 h-5 text-[var(--commandly-text-secondary)]" />
                </button>
                <button
                  onClick={handleLinkedInShare}
                  className="p-2 rounded-lg hover:bg-[var(--commandly-hover)] transition-colors duration-200"
                  aria-label="Share on LinkedIn"
                >
                  <FiLinkedin className="w-5 h-5 text-[var(--commandly-text-secondary)]" />
                </button>
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg hover:bg-[var(--commandly-hover)] transition-colors duration-200"
                    aria-label="Share post"
                  >
                    <FiShare2 className="w-5 h-5 text-[var(--commandly-text-secondary)]" />
                  </button>
                  {showCopied && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[var(--commandly-primary)] text-white text-sm rounded-lg whitespace-nowrap">
                      URL copied!
                    </div>
                  )}
                </div>
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
                      to={`/blog/${relatedPost.slug}`}
                      className="bg-[var(--commandly-hover)] rounded-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                    >
                      <div className="relative h-48">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-[var(--commandly-text-secondary)] mb-3">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            {relatedPost.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            {relatedPost.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiTag className="w-4 h-4" />
                            {relatedPost.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--commandly-text-primary)] mb-2">
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
