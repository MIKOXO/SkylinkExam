import { useSelector } from "react-redux";
import { useForm } from "../hooks/useForm";
import { commentValidationSchema } from "../utils/validation";
import Button from "./Button";

const CommentForm = ({ onSubmit, isLoading = false }) => {
  const { user } = useSelector((state) => state.auth);
  const form = useForm({ content: "" }, commentValidationSchema);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values.content.trim());
      form.reset(); // Clear form only after successful submission
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <label htmlFor="comment" className="sr-only">
              Add a comment
            </label>
            <textarea
              id="comment"
              name="content"
              rows={3}
              value={form.values.content}
              onChange={form.handleChange}
              placeholder="Write a comment..."
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 resize-none ${
                form.errors.content
                  ? "border-red-300 dark:border-red-600"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              disabled={isLoading}
            />
            {form.errors.content && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {form.errors.content}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {form.values.content.length}/1000 characters
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Commenting as <span className="font-medium">{user?.name}</span>
            </p>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isLoading}
              disabled={!form.values.content.trim()}
            >
              Post Comment
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
