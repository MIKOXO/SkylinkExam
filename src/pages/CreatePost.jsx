import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost, clearError } from "../store/slices/postsSlice";
import { useForm } from "../hooks/useForm";
import { postValidationSchema } from "../utils/validation";
import FormField from "../components/FormField";
import Button from "../components/Button";
import Alert from "../components/Alert";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.posts);

  const form = useForm({ title: "", content: "" }, postValidationSchema);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const result = await dispatch(
      createPost({
        title: values.title.trim(),
        content: values.content.trim(),
      })
    );

    if (createPost.fulfilled.match(result)) {
      navigate(`/posts/${result.payload.id}`);
    }
  });

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Post
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Share your thoughts with the community
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <Alert type="error">{error}</Alert>}

          <FormField
            label="Title"
            id="title"
            name="title"
            type="text"
            value={form.values.title}
            onChange={form.handleChange}
            error={form.errors.title}
            placeholder="Enter an engaging title for your post..."
            className="text-lg"
            required
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {form.values.title.length}/200 characters
          </p>

          <FormField
            label="Content"
            id="content"
            name="content"
            type="textarea"
            value={form.values.content}
            onChange={form.handleChange}
            error={form.errors.content}
            placeholder="Write your post content here... Share your thoughts, experiences, or insights with the community."
            required
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {form.values.content.length} characters (minimum 20)
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isLoading}>
              Publish Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
