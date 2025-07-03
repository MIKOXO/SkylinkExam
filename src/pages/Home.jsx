/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchPosts, setSearchQuery } from "../store/slices/postsSlice";
import SearchBar from "../components/SearchBar";
import PostCard from "../components/PostCard";
import LoadingSpinner from "../components/LoadingSpinner";
import AnimatedPage from "../components/AnimatedPage";
import { staggerContainer, staggerItem, fadeInUp } from "../utils/animations";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error, searchQuery, pagination } = useSelector(
    (state) => state.posts
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(setSearchQuery(query));
      setCurrentPage(1);
      dispatch(fetchPosts({ search: query, page: 1 }));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    // Fetch posts on component mount
    dispatch(fetchPosts({ search: searchQuery, page: currentPage }));
  }, [dispatch, currentPage]);

  const handleSearch = (query) => {
    debouncedSearch(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(fetchPosts({ search: searchQuery, page }));
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AnimatedPage className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Blogger
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Discover amazing stories and share your thoughts
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {posts.map((post) => (
              <motion.div key={post.id} variants={staggerItem}>
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    page === currentPage
                      ? "text-white bg-primary-600 border border-primary-600"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery ? "No posts found" : "No posts yet"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery
              ? `No posts match your search for "${searchQuery}"`
              : "Be the first to share your story!"}
          </p>
          {!searchQuery && (
            <Link
              to="/create-post"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create your first post
            </Link>
          )}
        </div>
      )}

      {/* Loading overlay for pagination */}
      {isLoading && posts.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
    </AnimatedPage>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default Home;
