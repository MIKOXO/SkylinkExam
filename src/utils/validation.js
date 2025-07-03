// Validation utility functions
export const validators = {
  required: (value, fieldName = "Field") => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && !value.trim())
    ) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },

  minLength: (value, min, fieldName = "Field") => {
    if (!value) return null;
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (value, max, fieldName = "Field") => {
    if (!value) return null;
    if (value.length > max) {
      return `${fieldName} must be less than ${max} characters`;
    }
    return null;
  },

  strongPassword: (value) => {
    if (!value) return null;

    const requirements = {
      length: value.length >= 8,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    const unmetRequirements = [];
    if (!requirements.length) unmetRequirements.push("at least 8 characters");
    if (!requirements.lowercase) unmetRequirements.push("one lowercase letter");
    if (!requirements.uppercase) unmetRequirements.push("one uppercase letter");
    if (!requirements.number) unmetRequirements.push("one number");
    if (!requirements.special) unmetRequirements.push("one special character");

    if (unmetRequirements.length > 0) {
      return `Password must include: ${unmetRequirements.join(", ")}`;
    }
    return null;
  },

  passwordMatch: (password, confirmPassword) => {
    if (!confirmPassword) return null;
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  },
};

// Validation schema builder
export const createValidationSchema = (fields) => {
  return (formData) => {
    const errors = {};

    Object.entries(fields).forEach(([fieldName, fieldValidators]) => {
      const value = formData[fieldName];

      for (const validator of fieldValidators) {
        let error = null;

        if (typeof validator === "function") {
          error = validator(value);
        } else if (typeof validator === "object") {
          const { type, ...params } = validator;
          if (validators[type]) {
            error = validators[type](value, ...Object.values(params));
          }
        }

        if (error) {
          errors[fieldName] = error;
          break; // Stop at first error for this field
        }
      }
    });

    return errors;
  };
};

// Common validation schemas
export const authValidationSchemas = {
  login: createValidationSchema({
    email: [validators.required, validators.email],
    password: [
      (value) => validators.required(value, "Password"),
      (value) => validators.minLength(value, 6, "Password"),
    ],
  }),

  register: createValidationSchema({
    name: [
      (value) => validators.required(value, "Name"),
      (value) => validators.minLength(value, 2, "Name"),
    ],
    email: [validators.required, validators.email],
    password: [
      (value) => validators.required(value, "Password"),
      validators.strongPassword,
    ],
    confirmPassword: [
      (value) => validators.required(value, "Password confirmation"),
    ],
  }),
};

export const postValidationSchema = createValidationSchema({
  title: [
    (value) => validators.required(value, "Title"),
    (value) => validators.minLength(value, 5, "Title"),
    (value) => validators.maxLength(value, 200, "Title"),
  ],
  content: [
    (value) => validators.required(value, "Content"),
    (value) => validators.minLength(value, 20, "Content"),
  ],
});

export const commentValidationSchema = createValidationSchema({
  content: [
    (value) => validators.required(value, "Comment"),
    (value) => validators.minLength(value, 3, "Comment"),
    (value) => validators.maxLength(value, 1000, "Comment"),
  ],
});
