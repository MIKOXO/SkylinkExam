import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { cardHover, fadeInUp } from "../utils/animations";

const PostCard = ({ post }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
      variants={fadeInUp}
      whileHover={cardHover}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {post.author?.name?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {post.author?.name || "Anonymous"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt || post.created_at)}
              </p>
            </div>
          </div>
        </div>

        <Link to={`/posts/${post.id}`} className="block group">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {post.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {truncateContent(post.content)}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {post.commentsCount || post.comments_count || 0} comments
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <Link
                to={`/posts/${post.id}/edit`}
                className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
              >
                Edit
              </Link>
            )}
            <Link
              to={`/posts/${post.id}`}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors"
            >
              Read more →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
