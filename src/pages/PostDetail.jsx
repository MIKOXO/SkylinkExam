import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  clearCurrentPost,
  deletePost,
} from "../store/slices/postsSlice";
import {
  fetchCommentsByPostId,
  createComment,
  clearComments,
} from "../store/slices/commentsSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import AnimatedPage from "../components/AnimatedPage";
import Modal from "../components/Modal";
import Button from "../components/Button";

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    currentPost,
    isLoading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.posts);
  const {
    comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = useSelector((state) => state.comments);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
      dispatch(fetchCommentsByPostId(id));
    }

    return () => {
      dispatch(clearCurrentPost());
      dispatch(clearComments());
    };
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCommentSubmit = async (content) => {
    const result = await dispatch(createComment({ postId: id, content }));
    if (createComment.rejected.match(result)) {
      throw new Error(result.payload);
    }
    return result;
  };

  const handleDeletePost = async () => {
    try {
      const result = await dispatch(deletePost(id));
      if (deletePost.fulfilled.match(result)) {
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
    setShowDeleteConfirm(false);
  };

  // Check if current user can edit/delete this post (simplified for demo)
  const canEditPost = isAuthenticated && currentPost;

  if (postsLoading && !currentPost) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Error loading post
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{postsError}</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Post not found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The post you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <AnimatedPage className="max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Post content */}
      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-8">
          {/* Post header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {currentPost.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {currentPost.author?.name?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentPost.author?.name || "Anonymous"}
                    </p>
                    <p className="text-xs">
                      {formatDate(
                        currentPost.createdAt || currentPost.created_at
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit and Delete buttons */}
              {canEditPost && (
                <div className="flex-col sm:flex-row ml-7 items-start space-y-2 space-x-2">
                  <Link
                    to={`/posts/${currentPost.id}/edit`}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentPost.content}
            </div>
          </div>
        </div>
      </article>

      {/* Comments section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment form */}
          {isAuthenticated ? (
            <div className="mb-8">
              <CommentForm
                onSubmit={handleCommentSubmit}
                isLoading={commentsLoading}
              />
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Please log in to leave a comment.
              </p>
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Sign in here
              </Link>
            </div>
          )}

          {/* Comments list */}
          {commentsError && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {commentsError}
            </div>
          )}

          <CommentList comments={comments} isLoading={commentsLoading} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Post"
        size="sm"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
        <div className="flex items-center justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            Delete
          </Button>
        </div>
      </Modal>
    </AnimatedPage>
  );
};

export default PostDetail;
