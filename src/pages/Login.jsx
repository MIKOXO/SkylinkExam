import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, clearError } from "../store/slices/authSlice";
import { useForm } from "../hooks/useForm";
import { authValidationSchemas } from "../utils/validation";
import FormField from "../components/FormField";
import Button from "../components/Button";
import Alert from "../components/Alert";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const from = location.state?.from?.pathname || "/";

  const form = useForm(
    { email: "", password: "" },
    authValidationSchemas.login
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await dispatch(loginUser(values));
  });

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <Alert type="error">{error}</Alert>}

          <div className="space-y-4">
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
              autoComplete="current-password"
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
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
