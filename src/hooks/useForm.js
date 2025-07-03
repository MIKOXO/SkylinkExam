import { useState, useCallback } from 'react';
import { validators } from '../utils/validation';

export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const clearError = useCallback((name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValue(name, value);
    
    // Clear error when user starts typing
    if (errors[name]) {
      clearError(name);
    }
  }, [setValue, clearError, errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback((formValues = values) => {
    if (!validationSchema) return {};
    
    const validationErrors = validationSchema(formValues);
    
    // Special handling for password confirmation
    if (formValues.password && formValues.confirmPassword) {
      const passwordMatchError = validators.passwordMatch(
        formValues.password, 
        formValues.confirmPassword
      );
      if (passwordMatchError) {
        validationErrors.confirmPassword = passwordMatchError;
      }
    }
    
    return validationErrors;
  }, [validationSchema, values]);

  const validateField = useCallback((name, value = values[name]) => {
    if (!validationSchema) return null;
    
    const fieldValidation = validate({ ...values, [name]: value });
    return fieldValidation[name] || null;
  }, [validate, values, validationSchema]);

  const isValid = useCallback((formValues = values) => {
    const validationErrors = validate(formValues);
    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);

  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();
      
      const validationErrors = validate();
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        try {
          await onSubmit(values);
        } catch (error) {
          // Handle submission errors
          console.error('Form submission error:', error);
        }
      }
    };
  }, [validate, values]);

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    clearError,
    clearAllErrors,
    handleChange,
    handleBlur,
    validate,
    validateField,
    isValid,
    handleSubmit,
    reset,
  };
};
