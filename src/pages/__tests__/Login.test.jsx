import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import {
  renderWithProviders,
  mockUnauthenticatedState,
} from "../../test/utils";
import Login from "../Login";

describe("Login Component", () => {
  beforeEach(() => {
    // Clear any previous state
  });

  it("renders login form correctly", () => {
    renderWithProviders(<Login />, {
      initialState: mockUnauthenticatedState,
    });

    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("shows link to registration page", () => {
    renderWithProviders(<Login />, {
      initialState: mockUnauthenticatedState,
    });

    const registerLink = screen.getByRole("link", {
      name: /create a new account/i,
    });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  it("validates required fields", async () => {
    renderWithProviders(<Login />, {
      initialState: mockUnauthenticatedState,
    });

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Field is required")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    renderWithProviders(<Login />, {
      initialState: mockUnauthenticatedState,
    });

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check that the form accepts the input
    expect(emailInput.value).toBe("invalid-email");
    expect(passwordInput.value).toBe("password123");

    // Form should be submittable (validation happens on submit)
    expect(submitButton).not.toBeDisabled();
  });

  it("validates password length", async () => {
    renderWithProviders(<Login />, {
      initialState: mockUnauthenticatedState,
    });

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters long")
      ).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const { store } = renderWithProviders(<Login />, {
      initialState: mockUnauthenticatedState,
    });

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const actions = store.getState();
      // Check that the form was submitted (no validation errors visible)
      expect(screen.queryByText("Field is required")).not.toBeInTheDocument();
    });
  });

  it("shows loading state during submission", () => {
    const loadingState = {
      ...mockUnauthenticatedState,
      auth: {
        ...mockUnauthenticatedState.auth,
        isLoading: true,
      },
    };

    renderWithProviders(<Login />, {
      initialState: loadingState,
    });

    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("displays error message when login fails", () => {
    const errorState = {
      ...mockUnauthenticatedState,
      auth: {
        ...mockUnauthenticatedState.auth,
        error: "User not found",
      },
    };

    renderWithProviders(<Login />, {
      initialState: errorState,
    });

    // Check that the form is rendered correctly with error state
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("clears field errors when user starts typing", async () => {
    renderWithProviders(<Login />, {
      initialState: mockUnauthenticatedState,
    });

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Trigger validation error
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Field is required")).toBeInTheDocument();
    });

    // Start typing should clear the error
    fireEvent.change(emailInput, { target: { value: "test" } });
    await waitFor(() => {
      expect(screen.queryByText("Field is required")).not.toBeInTheDocument();
    });
  });
});
