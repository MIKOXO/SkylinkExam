import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../store/slices/authSlice";
import { useForm } from "../hooks/useForm";
import { authValidationSchemas } from "../utils/validation";
import FormField from "../components/FormField";
import Button from "../components/Button";
import Alert from "../components/Alert";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const form = useForm(
    { name: "", email: "", password: "", confirmPassword: "" },
    authValidationSchemas.register
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const { confirmPassword, ...userData } = values;
    await dispatch(registerUser(userData));
  });

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              sign in to your existing account
            </Link>
          </p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Password Requirements:</strong> Your password must be at
              least 8 characters long and include uppercase, lowercase, number,
              and special character.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <Alert type="error">{error}</Alert>}

          <div className="space-y-4">
            <FormField
              label="Full Name"
              id="name"
              name="name"
              type="text"
              value={form.values.name}
              onChange={form.handleChange}
              error={form.errors.name}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

            <FormField
              label="Email address"
              id="email"
              name="email"
              type="email"
              value={form.values.email}
              onChange={form.handleChange}
              error={form.errors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              value={form.values.password}
              onChange={form.handleChange}
              error={form.errors.password}
              placeholder="Enter your password"
              autoComplete="new-password"
              showPasswordStrength={true}
              required
            />

            <FormField
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.values.confirmPassword}
              onChange={form.handleChange}
              error={form.errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
